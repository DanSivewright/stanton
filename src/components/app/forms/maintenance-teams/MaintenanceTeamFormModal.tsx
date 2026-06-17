// @ts-nocheck
"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EntityFormModal } from "@/components/app/forms/EntityFormModal";
import {
  SelectField,
  TextField,
} from "@/components/app/forms/FormFieldAdapters";
import * as Checkbox from "@/components/ui/checkbox";
import * as Hint from "@/components/ui/hint";
import * as Label from "@/components/ui/label";
import type { FormOption } from "@/lib/app/entity-form-options";
import {
  createMaintenanceTeam,
  updateMaintenanceTeam,
} from "@/lib/app/entity-mutations";
import { relId } from "@/lib/app/helpers";
import type { MaintenanceTeam } from "@/payload-types";

type MaintenanceTeamFormModalProps = {
  companies: FormOption[];
  employees: FormOption[];
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  open: boolean;
  team?: MaintenanceTeam;
};

function getDefaultValues(team?: MaintenanceTeam) {
  return {
    name: team?.name ?? "",
    company: relId(team?.company) ?? "",
    members:
      team?.members?.flatMap((member) => {
        const value = relId(member);
        return value ? [value] : [];
      }) ?? [],
  };
}

export function MaintenanceTeamFormModal({
  companies,
  employees,
  mode,
  onOpenChange,
  open,
  team,
}: MaintenanceTeamFormModalProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const defaultValues = useMemo(() => getDefaultValues(team), [team]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setSubmitError(undefined);
      const result =
        mode === "create"
          ? await createMaintenanceTeam(value)
          : await updateMaintenanceTeam(team!.id, value);

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
      submitLabel={mode === "create" ? "Create Team" : "Save Team"}
      title={
        mode === "create" ? "Create Maintenance Team" : "Edit Maintenance Team"
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <TextField
              label="Team Name"
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
      </div>

      <form.Field name="members">
        {(field) => (
          <div className="space-y-2">
            <Label.Root>Members</Label.Root>
            <div className="grid max-h-56 grid-cols-1 gap-2 overflow-auto rounded-lg border border-stroke-soft-200 p-3 md:grid-cols-2">
              {employees.map((employee) => {
                const checked = field.state.value.includes(employee.value);
                return (
                  <label
                    className="flex cursor-pointer items-center gap-2 text-paragraph-sm text-text-sub-600"
                    key={employee.value}
                  >
                    <Checkbox.Root
                      checked={checked}
                      onCheckedChange={(nextValue) => {
                        if (nextValue === true && !checked) {
                          field.handleChange([
                            ...field.state.value,
                            employee.value,
                          ]);
                          return;
                        }
                        if (nextValue !== true && checked) {
                          field.handleChange(
                            field.state.value.filter(
                              (member) => member !== employee.value
                            )
                          );
                        }
                      }}
                    />
                    {employee.label}
                  </label>
                );
              })}
            </div>
            <Hint.Root>
              <span>Select one or more employees to include in this team.</span>
            </Hint.Root>
          </div>
        )}
      </form.Field>
    </EntityFormModal>
  );
}
