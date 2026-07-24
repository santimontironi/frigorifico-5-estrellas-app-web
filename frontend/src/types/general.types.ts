import type { z } from 'zod'
import type { contactSchema } from '../../../shared/index.js'

export type viewDashboardAdmin =  'orders' | 'products' | 'importProducts' | 'welcome' | 'categories' | 'offers' | 'employees' | 'customers' | 'photos'

export type viewDashboardUser = 'myOrders' | 'myProfile' | 'welcome'

export type ContactData = z.infer<typeof contactSchema>
