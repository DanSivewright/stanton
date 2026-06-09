import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import type { PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { ActivityEvents } from './collections/ActivityEvents'
import { Companies } from './collections/Companies'
import { Contacts } from './collections/Contacts'
import { ContractTemplates } from './collections/ContractTemplates'
import { Customers } from './collections/Customers'
import { Departments } from './collections/Departments'
import { Documents } from './collections/Documents'
import { Employees } from './collections/Employees'
import { FinanceReportLines } from './collections/FinanceReportLines'
import { IntegrationSyncEvents } from './collections/IntegrationSyncEvents'
import { FinanceReportingPeriods } from './collections/FinanceReportingPeriods'
import { FinancialMetrics } from './collections/FinancialMetrics'
import { LlmPrompts } from './collections/LlmPrompts'
import { Machines } from './collections/Machines'
import { MaintenanceJobs } from './collections/MaintenanceJobs'
import { MaintenancePOs } from './collections/MaintenancePOs'
import { ManufacturingOrders } from './collections/ManufacturingOrders'
import { Media } from './collections/Media'
import { Moulds } from './collections/Moulds'
import { OneOnOneScores } from './collections/OneOnOneScores'
import { Parts } from './collections/Parts'
import { PerformanceContracts } from './collections/PerformanceContracts'
import { ProductionSnapshots } from './collections/ProductionSnapshots'
import { Products } from './collections/Products'
import { QuarterlyReviews } from './collections/QuarterlyReviews'
import { SalesActivities } from './collections/SalesActivities'
import { SalesActuals } from './collections/SalesActuals'
import { SalesPerformancePeriods } from './collections/SalesPerformancePeriods'
import { SalesTargets } from './collections/SalesTargets'
import { Sites } from './collections/Sites'
import { SpdChangeRequests } from './collections/SpdChangeRequests'
import { SpdGateSignOffs } from './collections/SpdGateSignOffs'
import { SpdProcessTemplates } from './collections/SpdProcessTemplates'
import { SpdProjects } from './collections/SpdProjects'
import { Tags } from './collections/Tags'
import { Teams } from './collections/Teams'
import { ToolingAssets } from './collections/ToolingAssets'
import { Users } from './collections/Users'
import { FinanceSettings } from './globals/FinanceSettings'
import { IntegrationSettings } from './globals/IntegrationSettings'
import { HrSettings } from './globals/HrSettings'
import { LlmSettings } from './globals/LlmSettings'
import { MaintenanceSettings } from './globals/MaintenanceSettings'
import { ManufacturingSettings } from './globals/ManufacturingSettings'
import { SalesSettings } from './globals/SalesSettings'
import { SpdSettings } from './globals/SpdSettings'
import { seedCompanies } from './seed/companies'
import { seedEmployees } from './seed/employees'
import { seedIntegration } from './seed/integration'
import { seedPlatformDemo } from './seed/platformDemo'
import { seedSpdProcessTemplate } from './seed/spdProcessTemplate'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const importExportCollections = [
  'employees',
  'users',
  'media',
  'products',
  'machines',
  'moulds',
  'parts',
  'manufacturing-orders',
  'production-snapshots',
  'one-on-one-scores',
  'maintenance-jobs',
  'finance-reporting-periods',
  'finance-report-lines',
  'financial-metrics',
  'sales-targets',
  'sales-actuals',
  'sales-activities',
  'spd-projects',
  'spd-gate-sign-offs',
  'spd-change-requests',
] as const

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    // Platform
    Users,
    Media,
    Tags,
    ActivityEvents,
    IntegrationSyncEvents,
    LlmPrompts,
    // Foundations
    Companies,
    Sites,
    Departments,
    Teams,
    Employees,
    Customers,
    Contacts,
    Products,
    Machines,
    Moulds,
    Documents,
    // SPD
    SpdProcessTemplates,
    SpdProjects,
    SpdGateSignOffs,
    SpdChangeRequests,
    ToolingAssets,
    // Manufacturing
    ManufacturingOrders,
    ProductionSnapshots,
    OneOnOneScores,
    // Maintenance
    Parts,
    MaintenanceJobs,
    MaintenancePOs,
    // Finance
    FinanceReportingPeriods,
    FinanceReportLines,
    FinancialMetrics,
    // Sales
    SalesPerformancePeriods,
    SalesTargets,
    SalesActuals,
    SalesActivities,
    // HR
    ContractTemplates,
    PerformanceContracts,
    QuarterlyReviews,
  ],
  globals: [
    SpdSettings,
    ManufacturingSettings,
    MaintenanceSettings,
    FinanceSettings,
    SalesSettings,
    HrSettings,
    IntegrationSettings,
    LlmSettings,
  ],
  onInit: async (payload) => {
    await seedCompanies(payload)
    await seedEmployees(payload)
    await seedSpdProcessTemplate(payload)
    await seedIntegration(payload)
    await seedPlatformDemo(payload)
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    // Serverless (Vercel Pro): restore vercel.json from vercel.cron.example.json — not on Hobby.
    autoRun:
      process.env.ENABLE_PAYLOAD_AUTORUN === 'true'
        ? [{ cron: '*/5 * * * *', limit: 50, queue: 'default' }]
        : undefined,
    jobsCollectionOverrides: ({ defaultJobsCollection }) => ({
      ...defaultJobsCollection,
      admin: {
        ...defaultJobsCollection.admin,
        group: 'Platform',
        hidden: false,
      },
    }),
  },
  sharp,
  plugins: [
    importExportPlugin({
      collections: importExportCollections.map((slug) => ({ slug })),
    }),
  ],
})
