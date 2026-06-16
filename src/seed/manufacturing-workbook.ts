import fs from "node:fs";
import path from "node:path";
import type { Payload } from "payload";
import * as XLSX from "xlsx";

const WORKBOOK_PATH_CANDIDATES = [
  "/Users/dan/Downloads/Planning Sheet - Book1.xlsx",
  path.resolve(process.cwd(), "seed-data/Planning Sheet - Book1.xlsx"),
];
const WORKBOOK_OBJECT_PATH = path.resolve(
  process.cwd(),
  "seed-data/manufacturing-workbook-object.json"
);
const FACTORY_SHEETS = [
  { match: "factory1", locationName: "Factory 1", code: "F1" },
  { match: "factory2", locationName: "Factory 2", code: "F2" },
  { match: "factory3", locationName: "Factory 3", code: "F3" },
] as const;

const MARKER = "manufacturing-workbook-seed";
const ISO_DATE_PATTERN = /\d{4}-\d{2}-\d{2}/;
const HAS_ALPHA_PATTERN = /[A-Z]/;
const HAS_DIGIT_PATTERN = /\d/;
const MACHINE_CODE_PATTERN = /^(EZ|N|H|B|E)\d+/i;

type SeedManufacturingWorkbookOptions = {
  companyId: string;
};

type MachineSeedSummary = {
  assetsCreated: number;
  assetsUpdated: number;
  categoryId: string;
  locationCount: number;
  machineCount: number;
  sheetCount: number;
  statusId: string;
};

type MachineSnapshot = {
  machineCode?: string;
  currentJobLabel?: string;
  moNumber?: string;
  salesOrderOrStock?: string;
  month?: string;
  palletType?: string;
  setupTimeMin?: number;
  lsFlag?: string;
  targetCycleTimeSec?: number;
  actualCycleTimeSec?: number;
  oeePercent?: number;
  targetOutputPerHour?: number;
  actualOutputPerHour?: number;
  cycleVariancePercent?: number;
  productionVariancePercent?: number;
  machineStoppage?: boolean;
  stoppageReason?: string;
  reasonForDrift?: string;
  productionStartDate?: string;
  originalPlannedDate?: string;
  driftDays?: number;
  remainDays?: number;
  remainQty?: number;
  qtyPerDay?: number;
  remainHours?: number;
  orderQty?: number;
  cavQty?: number;
  shotQty?: number;
  satMon?: boolean;
  productionEndDate?: string;
  machineStatus?: "running" | "warning" | "critical" | "stopped";
  lastSnapshotAt?: string;
};

function normalize(value: string) {
  return value.toLowerCase().replaceAll(/\s+/g, "");
}

function cleanMachineName(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replaceAll(/\s+/g, " ").trim();
}

function cleanText(value: unknown) {
  if (value == null) {
    return;
  }
  const text = String(value).trim();
  return text ? text : undefined;
}

function parseNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === "string") {
    const normalized = value.replaceAll(",", "").replace("%", "").trim();
    if (!normalized) {
      return;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return;
}

function parseSnapshotDate(value: unknown) {
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (!date) {
      return;
    }
    const jsDate = new Date(
      Date.UTC(date.y, date.m - 1, date.d, date.H, date.M, date.S)
    );
    return Number.isNaN(jsDate.getTime()) ? undefined : jsDate.toISOString();
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }
  return;
}

function parseDate(value: unknown) {
  return parseSnapshotDate(value);
}

function toDate(value: string | undefined) {
  if (!value) {
    return;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function roundNumber(value: number | undefined, decimals = 2) {
  if (value == null || !Number.isFinite(value)) {
    return;
  }
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function deriveDriftDays(
  productionStartDate: string | undefined,
  originalPlannedDate: string | undefined
) {
  const start = toDate(productionStartDate);
  const planned = toDate(originalPlannedDate);
  if (start == null || planned == null) {
    return;
  }
  const msPerDay = 1000 * 60 * 60 * 24;
  return roundNumber((start.getTime() - planned.getTime()) / msPerDay, 2);
}

function addRemainingDays(baseDate: Date, remainingDays: number, satMon: boolean) {
  if (!Number.isFinite(remainingDays) || remainingDays <= 0) {
    return new Date(baseDate);
  }

  if (satMon) {
    return new Date(baseDate.getTime() + remainingDays * 24 * 60 * 60 * 1000);
  }

  const result = new Date(baseDate);
  let wholeDays = Math.floor(remainingDays);
  const fractional = remainingDays - wholeDays;

  while (wholeDays > 0) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      wholeDays -= 1;
    }
  }

  if (fractional > 0) {
    result.setHours(result.getHours() + fractional * 24);
    const day = result.getDay();
    if (day === 0) {
      result.setDate(result.getDate() + 1);
    } else if (day === 6) {
      result.setDate(result.getDate() + 2);
    }
  }

  return result;
}

function isLikelyMachineCode(value: string) {
  if (!value) {
    return false;
  }
  const machine = value.toUpperCase();
  if (machine.includes("MACHINE") || machine.includes("FACTORY")) {
    return false;
  }
  if (ISO_DATE_PATTERN.test(machine)) {
    return false;
  }
  if (HAS_ALPHA_PATTERN.test(machine) && HAS_DIGIT_PATTERN.test(machine)) {
    return true;
  }
  return MACHINE_CODE_PATTERN.test(machine);
}

function parseBooleanFlag(value: unknown) {
  const text = cleanText(value)?.toLowerCase();
  if (!text) {
    return false;
  }
  return (
    text.includes("yes") ||
    text.includes("y") ||
    text.includes("true") ||
    text.includes("sat")
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: machine status combines explicit states and threshold alerts
function deriveMachineStatus(
  explicitStatus: string | undefined,
  machineStoppage: boolean,
  cycleVariancePercent: number | undefined,
  productionVariancePercent: number | undefined,
  oeePercent: number | undefined,
  driftDays: number | undefined
): MachineSnapshot["machineStatus"] {
  if (machineStoppage) {
    return "stopped";
  }

  const status = explicitStatus?.toLowerCase();
  if (status?.includes("stop") || status?.includes("down")) {
    return "stopped";
  }
  if (status?.includes("critical") || status?.includes("alarm")) {
    return "critical";
  }
  if (status?.includes("warn") || status?.includes("risk")) {
    return "warning";
  }
  if (status?.includes("run") || status?.includes("active")) {
    return "running";
  }

  if (
    (cycleVariancePercent != null && cycleVariancePercent > 5) ||
    (productionVariancePercent != null && productionVariancePercent < -5) ||
    (oeePercent != null && oeePercent < 70)
  ) {
    return "critical";
  }

  if (
    (cycleVariancePercent != null && cycleVariancePercent > 2) ||
    (productionVariancePercent != null && productionVariancePercent < -2) ||
    (oeePercent != null && oeePercent < 75)
  ) {
    return "warning";
  }

  if (oeePercent != null) {
    if (oeePercent < 75) {
      return "warning";
    }
    return "running";
  }

  if (driftDays != null) {
    if (driftDays < 0) {
      return "critical";
    }
    if (driftDays <= 2) {
      return "warning";
    }
    return "running";
  }

  return "running";
}

function toTagToken(value: string) {
  return value
    .toUpperCase()
    .replaceAll(/[^A-Z0-9]+/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

async function ensureCompany(payload: Payload, companyId: string) {
  const company = await payload.findByID({
    collection: "companies",
    id: companyId,
    overrideAccess: true,
  });

  return String(company.id);
}

async function ensureCategory(payload: Payload) {
  const existing = await payload.find({
    collection: "asset-categories",
    where: {
      or: [
        { name: { equals: "Injection Machines" } },
        { name: { equals: "Machine" } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    return String(existing.docs[0].id);
  }

  const created = await payload.create({
    collection: "asset-categories",
    data: {
      name: "Injection Machines",
      description: MARKER,
    },
    overrideAccess: true,
  });

  return String(created.id);
}

async function ensureStatus(payload: Payload) {
  const existing = await payload.find({
    collection: "asset-statuses",
    where: { name: { equals: "Active" } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    return String(existing.docs[0].id);
  }

  const created = await payload.create({
    collection: "asset-statuses",
    data: {
      name: "Active",
      description: MARKER,
    },
    overrideAccess: true,
  });

  return String(created.id);
}

async function ensureManufacturingRootLocation(
  payload: Payload,
  companyId: string
) {
  const existing = await payload.find({
    collection: "locations",
    where: {
      and: [
        { company: { equals: companyId } },
        { name: { equals: "Manufacturing" } },
        { isGroup: { equals: true } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    return String(existing.docs[0].id);
  }

  const created = await payload.create({
    collection: "locations",
    data: {
      name: "Manufacturing",
      company: companyId,
      isGroup: true,
      kind: "region",
      notes: MARKER,
    },
    overrideAccess: true,
  });

  return String(created.id);
}

async function ensureFactoryLeafLocation(
  payload: Payload,
  companyId: string,
  parentId: string,
  locationName: string
) {
  const existing = await payload.find({
    collection: "locations",
    where: {
      and: [
        { company: { equals: companyId } },
        { name: { equals: locationName } },
        { isGroup: { equals: false } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    return String(existing.docs[0].id);
  }

  const created = await payload.create({
    collection: "locations",
    data: {
      name: locationName,
      company: companyId,
      parent: parentId,
      isGroup: false,
      kind: "floor",
      notes: MARKER,
    },
    overrideAccess: true,
  });

  return String(created.id);
}

function getColumnIndex(
  headerMap: Map<string, number>,
  aliases: readonly string[]
) {
  for (const alias of aliases) {
    const index = headerMap.get(normalize(alias));
    if (index != null) {
      return index;
    }
  }
  return -1;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: workbook structure is irregular and needs explicit parsing branches
function buildMachineSnapshotsFromSheet(sheet: XLSX.WorkSheet) {
  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
  });

  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => normalize(String(cell ?? "")) === "machine")
  );

  if (headerIndex < 0) {
    return new Map<string, MachineSnapshot>();
  }

  const headerRow = rows[headerIndex] ?? [];
  const machineColumnIndex = headerRow.findIndex(
    (cell) => normalize(String(cell ?? "")) === "machine"
  );

  if (machineColumnIndex < 0) {
    return new Map<string, MachineSnapshot>();
  }

  const headerMap = new Map<string, number>();
  for (const [index, cell] of headerRow.entries()) {
    const key = normalize(String(cell ?? ""));
    if (key) {
      headerMap.set(key, index);
    }
  }

  const machineCodeIndex = getColumnIndex(headerMap, [
    "machine code",
    "machine no",
    "machine number",
    "machine",
  ]);
  const currentJobIndex = getColumnIndex(headerMap, [
    "current job",
    "product name",
    "product",
  ]);
  const moNumberIndex = getColumnIndex(headerMap, [
    "mo",
    "mo number",
    "mo no",
    "work order",
    "work order no",
  ]);
  const salesOrderIndex = getColumnIndex(headerMap, [
    "sales o/n or stock o/n",
    "sales order",
    "stock o/n",
  ]);
  const monthIndex = getColumnIndex(headerMap, ["month"]);
  const palletTypeIndex = getColumnIndex(headerMap, ["pallet type"]);
  const setupTimeIndex = getColumnIndex(headerMap, ["setup time"]);
  const lsIndex = getColumnIndex(headerMap, ["l/s", "ls"]);
  const targetCycleIndex = getColumnIndex(headerMap, [
    "cycle time",
    "cycle time sec",
    "cycle",
  ]);
  const actualCycleIndex = getColumnIndex(headerMap, [
    "actual cycle time sec",
    "actual cycletime sec",
    "actual cycle sec",
    "actual cycle",
    "actual ct",
  ]);
  const oeeIndex = getColumnIndex(headerMap, ["oee", "oee %", "oee percent"]);
  const driftDaysIndex = getColumnIndex(headerMap, ["drift", "drift days"]);
  const driftReasonIndex = getColumnIndex(headerMap, [
    "reason for drift",
    "drift reason",
  ]);
  const remainDaysIndex = getColumnIndex(headerMap, [
    "remain days",
    "remaining days",
    "remain",
    "remaining",
  ]);
  const statusIndex = getColumnIndex(headerMap, ["status", "machine status"]);
  const prodStartDateIndex = getColumnIndex(headerMap, ["prod start date"]);
  const originalPlannedDateIndex = getColumnIndex(headerMap, [
    "original planned date",
  ]);
  const orderQtyIndex = getColumnIndex(headerMap, ["order qty"]);
  const cavQtyIndex = getColumnIndex(headerMap, ["cav qty"]);
  const shotQtyIndex = getColumnIndex(headerMap, ["shot qty"]);
  const remainQtyIndex = getColumnIndex(headerMap, ["remain qty", "0"]);
  const qtyPerDayIndex = getColumnIndex(headerMap, ["qty p/day"]);
  const remainHoursIndex = getColumnIndex(headerMap, ["remain hrs"]);
  const qtyProducedToDateIndex = getColumnIndex(headerMap, [
    "qty produced to date",
    "produced qty",
    "qty produced",
    "actual qty",
    "actual output",
  ]);
  const shiftHoursIndex = getColumnIndex(headerMap, [
    "shift hours",
    "shift hrs",
    "shift hr",
  ]);
  const satMonIndex = getColumnIndex(headerMap, ["sat-mon"]);
  const prodEndDateIndex = getColumnIndex(headerMap, ["prod end date"]);
  const snapshotAtIndex = getColumnIndex(headerMap, [
    "snapshot at",
    "snapshot date",
    "date",
    "timestamp",
    "recorded at",
  ]);

  const snapshotsByMachine = new Map<
    string,
    { score: number; data: MachineSnapshot }
  >();

  for (const row of rows.slice(headerIndex + 1)) {
    const machine = cleanMachineName(row[machineColumnIndex]);
    if (!machine) {
      continue;
    }
    if (machine.toLowerCase() === "machine") {
      continue;
    }
    if (!isLikelyMachineCode(machine)) {
      continue;
    }

    const machineCode =
      machineCodeIndex >= 0
        ? (cleanText(row[machineCodeIndex]) ?? machine)
        : machine;
    const currentJobLabel =
      currentJobIndex >= 0 ? cleanText(row[currentJobIndex]) : undefined;
    const moNumber =
      moNumberIndex >= 0 ? cleanText(row[moNumberIndex]) : undefined;
    const salesOrderOrStock =
      salesOrderIndex >= 0 ? cleanText(row[salesOrderIndex]) : undefined;
    const month = monthIndex >= 0 ? cleanText(row[monthIndex]) : undefined;
    const palletType =
      palletTypeIndex >= 0 ? cleanText(row[palletTypeIndex]) : undefined;
    const setupTimeMin =
      setupTimeIndex >= 0 ? parseNumber(row[setupTimeIndex]) : undefined;
    const lsFlag = lsIndex >= 0 ? cleanText(row[lsIndex]) : undefined;
    const targetCycleTimeSec =
      targetCycleIndex >= 0 ? parseNumber(row[targetCycleIndex]) : undefined;
    const sourceActualCycle =
      actualCycleIndex >= 0 ? parseNumber(row[actualCycleIndex]) : undefined;
    const oeePercent = oeeIndex >= 0 ? parseNumber(row[oeeIndex]) : undefined;
    const actualCycleTimeSec =
      sourceActualCycle ??
      (targetCycleTimeSec != null && oeePercent != null && oeePercent > 0
        ? targetCycleTimeSec / (oeePercent / 100)
        : undefined);
    const driftDays =
      driftDaysIndex >= 0 ? parseNumber(row[driftDaysIndex]) : undefined;
    const reasonForDrift =
      driftReasonIndex >= 0 ? cleanText(row[driftReasonIndex]) : undefined;
    const remainDays =
      remainDaysIndex >= 0 ? parseNumber(row[remainDaysIndex]) : undefined;
    const orderQty =
      orderQtyIndex >= 0 ? parseNumber(row[orderQtyIndex]) : undefined;
    const cavQty = cavQtyIndex >= 0 ? parseNumber(row[cavQtyIndex]) : undefined;
    const shotQty =
      shotQtyIndex >= 0 ? parseNumber(row[shotQtyIndex]) : undefined;
    const remainQty =
      remainQtyIndex >= 0 ? parseNumber(row[remainQtyIndex]) : undefined;
    const qtyPerDay =
      qtyPerDayIndex >= 0 ? parseNumber(row[qtyPerDayIndex]) : undefined;
    const remainHours =
      remainHoursIndex >= 0 ? parseNumber(row[remainHoursIndex]) : undefined;
    const qtyProducedToDate =
      qtyProducedToDateIndex >= 0
        ? parseNumber(row[qtyProducedToDateIndex])
        : undefined;
    const shiftHours =
      shiftHoursIndex >= 0 ? parseNumber(row[shiftHoursIndex]) : undefined;
    const satMon =
      satMonIndex >= 0 ? parseBooleanFlag(row[satMonIndex]) : false;
    const productionStartDate =
      prodStartDateIndex >= 0 ? parseDate(row[prodStartDateIndex]) : undefined;
    const originalPlannedDate =
      originalPlannedDateIndex >= 0
        ? parseDate(row[originalPlannedDateIndex])
        : undefined;
    const productionEndDate =
      prodEndDateIndex >= 0 ? parseDate(row[prodEndDateIndex]) : undefined;
    const explicitStatus =
      statusIndex >= 0 ? cleanText(row[statusIndex]) : undefined;
    const lastSnapshotAt =
      snapshotAtIndex >= 0
        ? parseSnapshotDate(row[snapshotAtIndex])
        : undefined;
    const derivedDriftDays =
      driftDays ??
      deriveDriftDays(productionStartDate, originalPlannedDate) ??
      undefined;
    const machineStoppage =
      Boolean(explicitStatus?.toLowerCase().includes("stop")) ||
      Boolean(explicitStatus?.toLowerCase().includes("down")) ||
      Boolean(reasonForDrift?.toLowerCase().includes("stop"));
    const stoppageReason = machineStoppage
      ? (reasonForDrift ?? explicitStatus ?? "Stopped")
      : undefined;
    const targetOutputPerHour =
      cavQty != null && targetCycleTimeSec != null && targetCycleTimeSec > 0
        ? (cavQty / targetCycleTimeSec) * 3600
        : undefined;
    const actualOutputPerHour =
      targetOutputPerHour != null && oeePercent != null
        ? targetOutputPerHour * (oeePercent / 100)
        : undefined;
    const cycleVariancePercent =
      targetCycleTimeSec != null &&
      actualCycleTimeSec != null &&
      targetCycleTimeSec > 0
        ? (actualCycleTimeSec / targetCycleTimeSec - 1) * 100
        : undefined;
    const productionVariancePercent =
      targetOutputPerHour != null &&
      actualOutputPerHour != null &&
      targetOutputPerHour > 0
        ? (actualOutputPerHour / targetOutputPerHour - 1) * 100
        : undefined;
    const derivedRemainQty =
      remainQty ??
      (orderQty != null && qtyProducedToDate != null
        ? orderQty - qtyProducedToDate
        : undefined);
    const derivedQtyPerDay =
      qtyPerDay ??
      (actualOutputPerHour != null && shiftHours != null
        ? actualOutputPerHour * shiftHours
        : undefined);
    const derivedRemainHours =
      remainHours ??
      (derivedRemainQty != null &&
      actualOutputPerHour != null &&
      actualOutputPerHour > 0
        ? derivedRemainQty / actualOutputPerHour
        : undefined);
    const derivedRemainDays =
      remainDays ??
      (derivedRemainHours != null && shiftHours != null && shiftHours > 0
        ? derivedRemainHours / shiftHours
        : undefined);
    let derivedProductionEndDate = productionEndDate;
    if (derivedProductionEndDate == null && derivedRemainDays != null) {
      derivedProductionEndDate = addRemainingDays(
        new Date(),
        derivedRemainDays,
        satMon
      ).toISOString();
    }
    const machineStatus = deriveMachineStatus(
      explicitStatus,
      machineStoppage,
      cycleVariancePercent,
      productionVariancePercent,
      oeePercent,
      derivedDriftDays
    );

    const score =
      (currentJobLabel ? 4 : 0) +
      (moNumber ? 4 : 0) +
      (targetCycleTimeSec == null ? 0 : 2) +
      (oeePercent == null ? 0 : 2) +
      (productionEndDate ? 1 : 0) +
      (productionStartDate ? 1 : 0);

    const rowData: MachineSnapshot = {
      machineCode,
      currentJobLabel,
      moNumber,
      salesOrderOrStock,
      month,
      palletType,
      setupTimeMin,
      lsFlag,
      targetCycleTimeSec,
      actualCycleTimeSec,
      oeePercent,
      targetOutputPerHour,
      actualOutputPerHour,
      cycleVariancePercent,
      productionVariancePercent,
      machineStoppage,
      stoppageReason,
      reasonForDrift,
      productionStartDate,
      originalPlannedDate,
      driftDays: derivedDriftDays,
      remainDays: derivedRemainDays,
      remainQty: derivedRemainQty,
      qtyPerDay: derivedQtyPerDay,
      remainHours: derivedRemainHours,
      orderQty,
      cavQty,
      shotQty,
      satMon,
      productionEndDate: derivedProductionEndDate,
      machineStatus,
      lastSnapshotAt:
        lastSnapshotAt ?? productionStartDate ?? productionEndDate,
    };

    const existing = snapshotsByMachine.get(machine);
    if (existing && score < existing.score) {
      continue;
    }
    snapshotsByMachine.set(machine, {
      score,
      data: rowData,
    });
  }

  const finalSnapshots = new Map<string, MachineSnapshot>();
  for (const [machine, snapshot] of snapshotsByMachine.entries()) {
    finalSnapshots.set(machine, snapshot.data);
  }

  return finalSnapshots;
}

async function upsertMachineAsset(
  payload: Payload,
  input: {
    assetTag: string;
    categoryId: string;
    companyId: string;
    locationId: string;
    machineName: string;
    machineSnapshot: MachineSnapshot;
    sheetName: string;
    statusId: string;
  }
) {
  const existing = await payload.find({
    collection: "assets",
    where: { assetTag: { equals: input.assetTag } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    const existingAsset = existing.docs[0];
    await payload.update({
      collection: "assets",
      id: existingAsset.id,
      data: {
        name: input.machineName,
        company: input.companyId,
        location: input.locationId,
        category: input.categoryId,
        status: input.statusId,
        machineCode: input.machineSnapshot.machineCode,
        factorySheet: input.sheetName,
        currentJobLabel: input.machineSnapshot.currentJobLabel,
        moNumber: input.machineSnapshot.moNumber,
        salesOrderOrStock: input.machineSnapshot.salesOrderOrStock,
        month: input.machineSnapshot.month,
        palletType: input.machineSnapshot.palletType,
        setupTimeMin: input.machineSnapshot.setupTimeMin,
        lsFlag: input.machineSnapshot.lsFlag,
        targetCycleTimeSec: input.machineSnapshot.targetCycleTimeSec,
        actualCycleTimeSec: input.machineSnapshot.actualCycleTimeSec,
        oeePercent: input.machineSnapshot.oeePercent,
        targetOutputPerHour: input.machineSnapshot.targetOutputPerHour,
        actualOutputPerHour: input.machineSnapshot.actualOutputPerHour,
        cycleVariancePercent: input.machineSnapshot.cycleVariancePercent,
        productionVariancePercent:
          input.machineSnapshot.productionVariancePercent,
        machineStoppage: input.machineSnapshot.machineStoppage,
        stoppageReason: input.machineSnapshot.stoppageReason,
        reasonForDrift: input.machineSnapshot.reasonForDrift,
        productionStartDate: input.machineSnapshot.productionStartDate,
        originalPlannedDate: input.machineSnapshot.originalPlannedDate,
        driftDays: input.machineSnapshot.driftDays,
        remainDays: input.machineSnapshot.remainDays,
        remainQty: input.machineSnapshot.remainQty,
        qtyPerDay: input.machineSnapshot.qtyPerDay,
        remainHours: input.machineSnapshot.remainHours,
        orderQty: input.machineSnapshot.orderQty,
        cavQty: input.machineSnapshot.cavQty,
        shotQty: input.machineSnapshot.shotQty,
        satMon: input.machineSnapshot.satMon,
        productionEndDate: input.machineSnapshot.productionEndDate,
        machineStatus: input.machineSnapshot.machineStatus,
        lastSnapshotAt: input.machineSnapshot.lastSnapshotAt,
        notes: MARKER,
      },
      overrideAccess: true,
    });
    return "updated";
  }

  await payload.create({
    collection: "assets",
    data: {
      name: input.machineName,
      assetTag: input.assetTag,
      company: input.companyId,
      location: input.locationId,
      category: input.categoryId,
      status: input.statusId,
      machineCode: input.machineSnapshot.machineCode,
      factorySheet: input.sheetName,
      currentJobLabel: input.machineSnapshot.currentJobLabel,
      moNumber: input.machineSnapshot.moNumber,
      salesOrderOrStock: input.machineSnapshot.salesOrderOrStock,
      month: input.machineSnapshot.month,
      palletType: input.machineSnapshot.palletType,
      setupTimeMin: input.machineSnapshot.setupTimeMin,
      lsFlag: input.machineSnapshot.lsFlag,
      targetCycleTimeSec: input.machineSnapshot.targetCycleTimeSec,
      actualCycleTimeSec: input.machineSnapshot.actualCycleTimeSec,
      oeePercent: input.machineSnapshot.oeePercent,
      targetOutputPerHour: input.machineSnapshot.targetOutputPerHour,
      actualOutputPerHour: input.machineSnapshot.actualOutputPerHour,
      cycleVariancePercent: input.machineSnapshot.cycleVariancePercent,
      productionVariancePercent:
        input.machineSnapshot.productionVariancePercent,
      machineStoppage: input.machineSnapshot.machineStoppage,
      stoppageReason: input.machineSnapshot.stoppageReason,
      reasonForDrift: input.machineSnapshot.reasonForDrift,
      productionStartDate: input.machineSnapshot.productionStartDate,
      originalPlannedDate: input.machineSnapshot.originalPlannedDate,
      driftDays: input.machineSnapshot.driftDays,
      remainDays: input.machineSnapshot.remainDays,
      remainQty: input.machineSnapshot.remainQty,
      qtyPerDay: input.machineSnapshot.qtyPerDay,
      remainHours: input.machineSnapshot.remainHours,
      orderQty: input.machineSnapshot.orderQty,
      cavQty: input.machineSnapshot.cavQty,
      shotQty: input.machineSnapshot.shotQty,
      satMon: input.machineSnapshot.satMon,
      productionEndDate: input.machineSnapshot.productionEndDate,
      machineStatus: input.machineSnapshot.machineStatus,
      lastSnapshotAt: input.machineSnapshot.lastSnapshotAt,
      notes: MARKER,
    },
    overrideAccess: true,
  });

  return "created";
}

function loadWorkbookSheets() {
  const workbookSheetsByName = new Map<string, XLSX.WorkSheet>();

  if (fs.existsSync(WORKBOOK_OBJECT_PATH)) {
    try {
      const objectRaw = fs.readFileSync(WORKBOOK_OBJECT_PATH, "utf8");
      const objectData = JSON.parse(objectRaw) as {
        sheets?: Record<string, (string | number | null)[][]>;
      };
      const sheets = objectData.sheets ?? {};
      for (const [sheetName, rows] of Object.entries(sheets)) {
        workbookSheetsByName.set(sheetName, XLSX.utils.aoa_to_sheet(rows));
      }
    } catch {
      workbookSheetsByName.clear();
    }
  }

  if (workbookSheetsByName.size > 0) {
    return {
      sheetNames: [...workbookSheetsByName.keys()],
      sheetsByName: workbookSheetsByName,
    };
  }

  for (const candidate of WORKBOOK_PATH_CANDIDATES) {
    if (!fs.existsSync(candidate)) {
      continue;
    }
    try {
      const fileBuffer = fs.readFileSync(candidate);
      const workbook = XLSX.read(fileBuffer, { dense: true, type: "buffer" });
      for (const name of workbook.SheetNames) {
        const sheet = workbook.Sheets[name];
        if (sheet) {
          workbookSheetsByName.set(name, sheet);
        }
      }
      if (workbookSheetsByName.size > 0) {
        return {
          sheetNames: workbook.SheetNames,
          sheetsByName: workbookSheetsByName,
        };
      }
    } catch {
      // Try the next candidate path.
    }
  }

  throw new Error(
    `Workbook not accessible. Checked: ${WORKBOOK_PATH_CANDIDATES.join(", ")}`
  );
}

export async function seedManufacturingWorkbook(
  payload: Payload,
  options: SeedManufacturingWorkbookOptions
): Promise<MachineSeedSummary> {
  const { sheetNames: workbookSheetNames, sheetsByName: workbookSheetsByName } =
    loadWorkbookSheets();

  const companyId = await ensureCompany(payload, options.companyId);
  const categoryId = await ensureCategory(payload);
  const statusId = await ensureStatus(payload);
  const rootLocationId = await ensureManufacturingRootLocation(
    payload,
    companyId
  );

  let assetsCreated = 0;
  let assetsUpdated = 0;
  let machineCount = 0;
  let locationCount = 0;
  let sheetCount = 0;

  for (const mapping of FACTORY_SHEETS) {
    const sheetName = workbookSheetNames.find(
      (name) => normalize(name) === mapping.match
    );
    if (!sheetName) {
      continue;
    }

    sheetCount += 1;

    const sheet = workbookSheetsByName.get(sheetName);
    if (!sheet) {
      continue;
    }

    const locationId = await ensureFactoryLeafLocation(
      payload,
      companyId,
      rootLocationId,
      mapping.locationName
    );
    locationCount += 1;

    const machineSnapshots = buildMachineSnapshotsFromSheet(sheet);
    machineCount += machineSnapshots.size;

    for (const [machineName, machineSnapshot] of machineSnapshots.entries()) {
      const token = toTagToken(machineName) || "UNKNOWN";
      const assetTag = `MFG-${mapping.code}-${token}`;
      const result = await upsertMachineAsset(payload, {
        assetTag,
        categoryId,
        companyId,
        locationId,
        machineName,
        machineSnapshot,
        sheetName,
        statusId,
      });

      if (result === "created") {
        assetsCreated += 1;
      } else {
        assetsUpdated += 1;
      }
    }
  }

  return {
    assetsCreated,
    assetsUpdated,
    categoryId,
    locationCount,
    machineCount,
    sheetCount,
    statusId,
  };
}
