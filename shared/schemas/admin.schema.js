import { z } from 'zod'
import { addressSchema } from './auth.schema.js'

export const employeeSchema = z.object({
  _id:       z.string(),
  email:     z.string(),
  role:      z.string(),
  createdAt: z.string(),
})

export const employeesResponseSchema = z.array(employeeSchema)

export const customerSchema = z.object({
  _id:       z.string(),
  firstName: z.string(),
  lastName:  z.string(),
  dni:       z.string(),
  phone:     z.string(),
  email:     z.string(),
  address:   addressSchema,
  createdAt: z.string(),
})

export const customerResponseSchema = z.array(customerSchema)

export const deleteCustomerResponseSchema = z.object({
  customer: customerSchema
})