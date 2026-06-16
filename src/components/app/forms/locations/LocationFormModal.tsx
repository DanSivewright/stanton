"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EntityFormModal } from "@/components/app/forms/EntityFormModal";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/app/forms/FormFieldAdapters";
import type { FormOption } from "@/lib/app/entity-form-options";
import { createLocation, updateLocation } from "@/lib/app/entity-mutations";
import { relId } from "@/lib/app/helpers";
import type { Location } from "@/payload-types";

const LOCATION_KIND_OPTIONS: FormOption[] = [
  { label: "Region", value: "region" },
  { label: "Building", value: "building" },
  { label: "Floor", value: "floor" },
  { label: "Zone", value: "zone" },
];

type LocationFormModalProps = {
  companies: FormOption[];
  location?: Location;
  locations: FormOption[];
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

function getDefaultValues(location?: Location) {
  return {
    name: location?.name ?? "",
    company: relId(location?.company) ?? "",
    isGroup: location?.isGroup ?? false,
    parent: relId(location?.parent) ?? "",
    kind: location?.kind ?? "",
    notes: location?.notes ?? "",
  };
}

export function LocationFormModal({
  companies,
  location,
  locations,
  mode,
  onOpenChange,
  open,
}: LocationFormModalProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const defaultValues = useMemo(() => getDefaultValues(location), [location]);

  const parentOptions = useMemo(
    () => locations.filter((option) => option.value !== location?.id),
    [location?.id, locations]
  );

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setSubmitError(undefined);
      const payload = {
        ...value,
        parent: value.parent || undefined,
        kind: value.kind || undefined,
        notes: value.notes || undefined,
      };
      const result =
        mode === "create"
          ? await createLocation(payload)
          : await updateLocation(location!.id, payload);

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
      submitLabel={mode === "create" ? "Create Location" : "Save Location"}
      title={mode === "create" ? "Create Location" : "Edit Location"}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <TextField
              label="Location Name"
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
        <form.Field name="parent">
          {(field) => (
            <SelectField
              label="Parent Location"
              onChange={field.handleChange}
              options={parentOptions}
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="kind">
          {(field) => (
            <SelectField
              label="Kind"
              onChange={field.handleChange}
              options={LOCATION_KIND_OPTIONS}
              value={field.state.value}
            />
          )}
        </form.Field>
      </div>
      <form.Field name="isGroup">
        {(field) => (
          <CheckboxField
            checked={field.state.value}
            label="Is Group"
            onChange={field.handleChange}
          />
        )}
      </form.Field>
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
