import type { CollectionConfig } from 'payload'

import { Media } from './media'
import { Companies } from './organization/companies'
import { Locations } from './organization/locations'
import { AssetCategories } from './catalog/asset-categories'
import { AssetStatuses } from './catalog/asset-statuses'
import { TicketTypes } from './catalog/ticket-types'
import { Employees } from './people/employees'
import { MaintenanceTeams } from './people/maintenance-teams'
import { Users } from './people/users'
import { Assets } from './assets/assets'
import { AssetMovements } from './assets/asset-movements'
import { Tickets } from './maintenance/tickets'

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
]
