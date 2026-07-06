import type { z } from 'zod'
import type { contactSchema } from '../../../shared/index.js'

export type viewDashboardAdmin = 'addProduct' | 'orders' | 'products' | 'importProducts' | 'welcome' | 'categories' | 'addCategory'

export type viewDashboardUser = 'myOrders' | 'myProfile' | 'welcome'

export type ContactData = z.infer<typeof contactSchema>
