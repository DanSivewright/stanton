import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Companies } from './collections/Companies'
import { Contacts } from './collections/Contacts'
import { Customers } from './collections/Customers'
import { Documents } from './collections/Documents'
import { Employees } from './collections/Employees'
import { Media } from './collections/Media'
import { SpdChangeRequests } from './collections/SpdChangeRequests'
import { SpdGateSignOffs } from './collections/SpdGateSignOffs'
import { SpdProcessTemplates } from './collections/SpdProcessTemplates'
import { SpdProjects } from './collections/SpdProjects'
import { ToolingAssets } from './collections/ToolingAssets'
import { Users } from './collections/Users'
import { SpdSettings } from './globals/SpdSettings'
import { seedCompanies } from './seed/companies'
import { seedEmployees } from './seed/employees'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Companies,
    Employees,
    Customers,
    Contacts,
    Documents,
    SpdProcessTemplates,
    SpdProjects,
    SpdGateSignOffs,
    SpdChangeRequests,
    ToolingAssets,
  ],
  globals: [SpdSettings],
  onInit: async (payload) => {
    await seedCompanies(payload)
    await seedEmployees(payload)
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
