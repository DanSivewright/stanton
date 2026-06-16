"use server";

import config from "@payload-config";
import { getPayload } from "payload";

type MutationResult = { ok: true; id: string } | { ok: false; error: string };

type TicketInput = {
  title: string;
  description?: string;
  type: string;
  priority: string;
  status: string;
  reviewStatus: string;
  company: string;
  location: string;
  asset?: string;
  reportedBy: string;
  assignedTeam?: string;
  assignedTo?: string;
};

type AssetInput = {
  name: string;
  assetTag: string;
  company: string;
  location: string;
  category: string;
  status: string;
  serialNumber?: string;
  tonnage?: number;
  custodian?: string;
  defaultTeam?: string;
  notes?: string;
};

type LocationInput = {
  name: string;
  company: string;
  isGroup: boolean;
  parent?: string;
  kind?: string;
  notes?: string;
};

type MaintenanceTeamInput = {
  name: string;
  company: string;
  members: string[];
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unknown error while saving changes.";
}

export async function createTicket(data: TicketInput): Promise<MutationResult> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.create({
      collection: "tickets",
      data: data as never,
    });
    return { ok: true, id: String((doc as { id: string }).id) };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function updateTicket(
  id: string,
  data: TicketInput
): Promise<MutationResult> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.update({
      collection: "tickets",
      id,
      data: data as never,
    });
    return { ok: true, id: String((doc as { id: string }).id) };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function createAsset(data: AssetInput): Promise<MutationResult> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.create({
      collection: "assets",
      data: data as never,
    });
    return { ok: true, id: String((doc as { id: string }).id) };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function updateAsset(
  id: string,
  data: AssetInput
): Promise<MutationResult> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.update({
      collection: "assets",
      id,
      data: data as never,
    });
    return { ok: true, id: String((doc as { id: string }).id) };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function createLocation(
  data: LocationInput
): Promise<MutationResult> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.create({
      collection: "locations",
      data: data as never,
    });
    return { ok: true, id: String((doc as { id: string }).id) };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function updateLocation(
  id: string,
  data: LocationInput
): Promise<MutationResult> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.update({
      collection: "locations",
      id,
      data: data as never,
    });
    return { ok: true, id: String((doc as { id: string }).id) };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function createMaintenanceTeam(
  data: MaintenanceTeamInput
): Promise<MutationResult> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.create({
      collection: "maintenance-teams",
      data: data as never,
    });
    return { ok: true, id: String((doc as { id: string }).id) };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}

export async function updateMaintenanceTeam(
  id: string,
  data: MaintenanceTeamInput
): Promise<MutationResult> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.update({
      collection: "maintenance-teams",
      id,
      data: data as never,
    });
    return { ok: true, id: String((doc as { id: string }).id) };
  } catch (error) {
    return { ok: false, error: toErrorMessage(error) };
  }
}
