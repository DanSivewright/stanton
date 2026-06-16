"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EntityFormModal } from "@/components/app/forms/EntityFormModal";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/app/forms/FormFieldAdapters";
import type { FormOption } from "@/lib/app/entity-form-options";
import { createAsset, updateAsset } from "@/lib/app/entity-mutations";
import { relId } from "@/lib/app/helpers";
import type { Asset } from "@/payload-types";

type AssetFormModalProps = {
  asset?: Asset;
  assetCategories: FormOption[];
  assetStatuses: FormOption[];
  companies: FormOption[];
  employees: FormOption[];
  locations: FormOption[];
  maintenanceTeams: FormOption[];
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

function getDefaultValues(asset?: Asset) {
  return {
    name: asset?.name ?? "",
    assetTag: asset?.assetTag ?? "",
    company: relId(asset?.company) ?? "",
    location: relId(asset?.location) ?? "",
    category: relId(asset?.category) ?? "",
    status: relId(asset?.status) ?? "",
    serialNumber: asset?.serialNumber ?? "",
    tonnage: asset?.tonnage ?? undefined,
    custodian: relId(asset?.custodian) ?? "",
    defaultTeam: relId(asset?.defaultTeam) ?? "",
    notes: asset?.notes ?? "",
  };
}

export function AssetFormModal({
  asset,
  assetCategories,
  assetStatuses,
  companies,
  employees,
  locations,
  maintenanceTeams,
  mode,
  onOpenChange,
  open,
}: AssetFormModalProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const defaultValues = useMemo(() => getDefaultValues(asset), [asset]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setSubmitError(undefined);
      const payload = {
        ...value,
        tonnage:
          typeof value.tonnage === "number" && Number.isNaN(value.tonnage)
            ? undefined
            : value.tonnage,
      };
      const result =
        mode === "create"
          ? await createAsset(payload)
          : await updateAsset(asset!.id, payload);

      if (!result.ok) {
        setSubmitError(result.error);
        return;
      }

      onOpenChange(false);
      router.refresh();
    },
  });

  return (
    <EntityFormModal
      error={submitError}
      onOpenChange={onOpenChange}
      onSubmit={() => form.handleSubmit()}
      open={open}
      submitLabel={mode === "create" ? "Create Asset" : "Save Asset"}
      title={mode === "create" ? "Create Asset" : "Edit Asset"}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <TextField
              label="Asset Name"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="assetTag">
          {(field) => (
            <TextField
              label="Asset Tag"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="company">
          {(field) => (
            <SelectField
              label="Company"
              onChange={field.handleChange}
              options={companies}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="location">
          {(field) => (
            <SelectField
              label="Location"
              onChange={field.handleChange}
              options={locations}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="category">
          {(field) => (
            <SelectField
              label="Category"
              onChange={field.handleChange}
              options={assetCategories}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <SelectField
              label="Status"
              onChange={field.handleChange}
              options={assetStatuses}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="serialNumber">
          {(field) => (
            <TextField
              label="Serial Number"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="tonnage">
          {(field) => (
            <TextField
              label="Tonnage"
              onBlur={field.handleBlur}
              onChange={(nextValue) =>
                field.handleChange(nextValue ? Number(nextValue) : undefined)
              }
              value={field.state.value?.toString() ?? ""}
            />
          )}
        </form.Field>
        <form.Field name="custodian">
          {(field) => (
            <SelectField
              label="Custodian"
              onChange={field.handleChange}
              options={employees}
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="defaultTeam">
          {(field) => (
            <SelectField
              label="Default Team"
              onChange={field.handleChange}
              options={maintenanceTeams}
              value={field.state.value}
            />
          )}
        </form.Field>
      </div>
      <form.Field name="notes">
        {(field) => (
          <TextAreaField
            label="Notes"
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            value={field.state.value}
          />
        )}
      </form.Field>
    </EntityFormModal>
  );
}
