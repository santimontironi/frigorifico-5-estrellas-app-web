import api from './api'
import { employeesResponseSchema } from '../../../shared/index.js'

export const getEmployeesService = async () => {
  const res = await api.get('/admin/employees')
  return employeesResponseSchema.parse(res.data)
}
