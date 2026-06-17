import type { CollectionConfig } from "payload";
import { AssetMovements } from "./assets/asset-movements";
import { Assets } from "./assets/assets";
import { AssetCategories } from "./catalog/asset-categories";
import { AssetStatuses } from "./catalog/asset-statuses";
import { TicketTypes } from "./catalog/ticket-types";
import { Media } from "./Media";
import { Tickets } from "./maintenance/tickets";
import { Companies } from "./organization/companies";
import { Locations } from "./organization/locations";
import { Employees } from "./people/employees";
import { MaintenanceTeams } from "./people/maintenance-teams";
import { Users } from "./people/users";

export const collections: CollectionConfig[] = [
  Users,
  Media,
  Companies,
  Locations,
  AssetCategories,
  AssetStatuses,
  TicketTypes,
  Employees,
  MaintenanceTeams,
  Assets,
  AssetMovements,
  Tickets,
];
