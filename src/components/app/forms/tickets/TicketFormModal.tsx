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
import { createTicket, updateTicket } from "@/lib/app/entity-mutations";
import { relId } from "@/lib/app/helpers";
import type { Ticket } from "@/payload-types";

const TICKET_PRIORITY_OPTIONS: FormOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

const TICKET_STATUS_OPTIONS: FormOption[] = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const REVIEW_STATUS_OPTIONS: FormOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

type TicketFormModalProps = {
  assets: FormOption[];
  companies: FormOption[];
  employees: FormOption[];
  locations: FormOption[];
  maintenanceTeams: FormOption[];
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  open: boolean;
  ticket?: Ticket;
  ticketTypes: FormOption[];
};

function getDefaultValues(ticket?: Ticket) {
  return {
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    type: relId(ticket?.type) ?? "",
    priority: ticket?.priority ?? "medium",
    status: ticket?.status ?? "open",
    reviewStatus: ticket?.reviewStatus ?? "pending",
    company: relId(ticket?.company) ?? "",
    location: relId(ticket?.location) ?? "",
    asset: relId(ticket?.asset) ?? "",
    reportedBy: relId(ticket?.reportedBy) ?? "",
    assignedTeam: relId(ticket?.assignedTeam) ?? "",
    assignedTo: relId(ticket?.assignedTo) ?? "",
  };
}

export function TicketFormModal({
  assets,
  companies,
  employees,
  locations,
  maintenanceTeams,
  mode,
  onOpenChange,
  open,
  ticket,
  ticketTypes,
}: TicketFormModalProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const defaultValues = useMemo(() => getDefaultValues(ticket), [ticket]);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setSubmitError(undefined);
      const result =
        mode === "create"
          ? await createTicket(value)
          : await updateTicket(ticket!.id, value);

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
      submitLabel={mode === "create" ? "Create Ticket" : "Save Ticket"}
      title={mode === "create" ? "Create Ticket" : "Edit Ticket"}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="title">
          {(field) => (
            <TextField
              label="Title"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="type">
          {(field) => (
            <SelectField
              label="Type"
              onChange={field.handleChange}
              options={ticketTypes}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="priority">
          {(field) => (
            <SelectField
              label="Priority"
              onChange={(nextValue) => field.handleChange(nextValue as never)}
              options={TICKET_PRIORITY_OPTIONS}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <SelectField
              label="Status"
              onChange={(nextValue) => field.handleChange(nextValue as never)}
              options={TICKET_STATUS_OPTIONS}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="reviewStatus">
          {(field) => (
            <SelectField
              label="Review Status"
              onChange={(nextValue) => field.handleChange(nextValue as never)}
              options={REVIEW_STATUS_OPTIONS}
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
        <form.Field name="asset">
          {(field) => (
            <SelectField
              label="Asset"
              onChange={field.handleChange}
              options={assets}
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="reportedBy">
          {(field) => (
            <SelectField
              label="Reported By"
              onChange={field.handleChange}
              options={employees}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="assignedTeam">
          {(field) => (
            <SelectField
              label="Assigned Team"
              onChange={field.handleChange}
              options={maintenanceTeams}
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="assignedTo">
          {(field) => (
            <SelectField
              label="Assigned To"
              onChange={field.handleChange}
              options={employees}
              value={field.state.value}
            />
          )}
        </form.Field>
      </div>
      <form.Field name="description">
        {(field) => (
          <TextAreaField
            label="Description"
            onBlur={field.handleBlur}
            onChange={field.handleChange}
            value={field.state.value}
          />
        )}
      </form.Field>
    </EntityFormModal>
  );
}
