import type { z } from 'zod'
import type { adminRegisterSchema, employeeSchema, customerSchema } from '../../../shared/index.js'

// El registro de empleado reutiliza el mismo schema que el de admin (email + password)
export type EmployeeRegisterCredentials = z.infer<typeof adminRegisterSchema>

export type Employee = z.infer<typeof employeeSchema>

export type Customer = z.infer<typeof customerSchema>

// Este tipo es creado manualmente, no viene de shared
export interface AdminLoadingState {
  employees: boolean,
  customers: boolean,
  addEmployee: boolean,
  deleteCustomer: boolean
}
