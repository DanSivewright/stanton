import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";
import { generateTicketNumber } from "../../hooks/tickets/generateTicketNumber";
import { inheritCompanyFromLocation } from "../../hooks/tickets/inheritCompanyFromLocation";
import { inheritFromAsset } from "../../hooks/tickets/inheritFromAsset";
import { onWorkCompleted } from "../../hooks/tickets/onWorkCompleted";
import { setReportedAt } from "../../hooks/tickets/setReportedAt";
import { validateTicketLocationIsLeaf } from "../../hooks/tickets/validateLocationIsLeaf";
import { ACTIVITY_KINDS } from "../../lib/constants/activityKinds";
import {
  DEFAULT_TICKET_PRIORITY,
  TICKET_PRIORITIES,
} from "../../lib/constants/ticketPriorities";
import {
  DEFAULT_TICKET_REVIEW_STATUS,
  TICKET_REVIEW_STATUSES,
} from "../../lib/constants/ticketReviewStatuses";
import {
  DEFAULT_TICKET_STATUS,
  TICKET_STATUSES,
} from "../../lib/constants/ticketStatuses";

export const Tickets: CollectionConfig = {
  slug: "tickets",
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "ticketNumber",
      "title",
      "status",
      "reviewStatus",
      "priority",
      "location",
    ],
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [
      generateTicketNumber,
      inheritFromAsset,
      inheritCompanyFromLocation,
      validateTicketLocationIsLeaf,
      setReportedAt,
      onWorkCompleted,
    ],
  },
  fields: [
    {
      name: "ticketNumber",
      type: "text",
      unique: true,
      index: true,
      label: "Ticket Number",
      admin: {
        readOnly: true,
        description: "Auto-generated on create.",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
    {
      name: "type",
      type: "relationship",
      relationTo: "ticket-types",
      required: true,
      label: "Type",
    },
    {
      name: "priority",
      type: "select",
      required: true,
      defaultValue: DEFAULT_TICKET_PRIORITY,
      options: [...TICKET_PRIORITIES],
      label: "Priority",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: DEFAULT_TICKET_STATUS,
      options: [...TICKET_STATUSES],
      label: "Status",
    },
    {
      name: "reviewStatus",
      type: "select",
      required: true,
      defaultValue: DEFAULT_TICKET_REVIEW_STATUS,
      options: [...TICKET_REVIEW_STATUSES],
      label: "Review Status",
    },
    {
      name: "company",
      type: "relationship",
      relationTo: "companies",
      required: true,
      label: "Company",
    },
    {
      name: "location",
      type: "relationship",
      relationTo: "locations",
      required: true,
      label: "Location",
      filterOptions: {
        isGroup: { equals: false },
      },
    },
    {
      name: "asset",
      type: "relationship",
      relationTo: "assets",
      label: "Asset",
    },
    {
      name: "reportedBy",
      type: "relationship",
      relationTo: "employees",
      required: true,
      label: "Reported By",
    },
    {
      name: "reportedAt",
      type: "date",
      required: true,
      label: "Reported At",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "assignedTeam",
      type: "relationship",
      relationTo: "maintenance-teams",
      label: "Assigned Team",
    },
    {
      name: "assignedTo",
      type: "relationship",
      relationTo: "employees",
      label: "Assigned To",
    },
    {
      name: "activity",
      type: "array",
      label: "Activity",
      admin: {
        description:
          "Chronological log of comments, photos, and lifecycle events.",
      },
      fields: [
        {
          name: "kind",
          type: "select",
          required: true,
          options: [...ACTIVITY_KINDS],
          label: "Kind",
        },
        {
          name: "author",
          type: "relationship",
          relationTo: "employees",
          required: true,
          label: "Author",
        },
        {
          name: "body",
          type: "textarea",
          label: "Body",
        },
        {
          name: "photos",
          type: "upload",
          relationTo: "media",
          hasMany: true,
          label: "Photos",
        },
        {
          name: "createdAt",
          type: "date",
          required: true,
          label: "Created At",
          admin: {
            date: {
              pickerAppearance: "dayAndTime",
            },
          },
        },
      ],
    },
  ],
};
