import api from './api'
import { employeesResponseSchema, customerResponseSchema, deleteCustomerResponseSchema } from '../../../shared/index.js'
import type { EmployeeRegisterCredentials } from '../types/admin.types'

export const getEmployeesService = async () => {
  const res = await api.get('/admin/employees')
  return employeesResponseSchema.parse(res.data)
}

export const addEmployeeService = (credentials: EmployeeRegisterCredentials) =>
  api.post('/register/employee', credentials)

export const getCustomersService = async () => {
  const res = await api.get('/admin/customers')
  return customerResponseSchema.parse(res.data)
}

export const deleteCustomerService = async (id: string) => {
  const res = await api.delete(`/admin/customers/${id}`)
  return deleteCustomerResponseSchema.parse(res.data)
}