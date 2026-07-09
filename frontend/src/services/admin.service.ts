import api from "./api";
import { employeesResponseSchema, customerResponseSchema } from "../../../shared/index.js";
import type { EmployeeRegisterCredentials } from "../types/admin.types";

export const getEmployeesService = async () => {
  const res = await api.get("/admin/employees");
  return employeesResponseSchema.parse(res.data);
};

export const deleteEmployeeService = async (id: string) => {
  const res = await api.delete(`/admin/employees/${id}`);
  return res.data;
};

export const addEmployeeService = async (credentials: EmployeeRegisterCredentials) => {
  const res = await api.post("/register/employee", credentials);
  return res.data;
};

export const getCustomersService = async () => {
  const res = await api.get("/admin/customers");
  return customerResponseSchema.parse(res.data);
};

export const deleteCustomerService = async (id: string) => {
  const res = await api.delete(`/admin/customers/${id}`);
  return res.data;
};
