import { createContext, useState } from "react";

<<<<<<< HEAD
import type { AdminLoadingState, Employee, EmployeeRegisterCredentials, Customer } from '../types/admin.types'

import { getEmployeesService, addEmployeeService, getCustomersService, deleteCustomerService } from '../services/admin.service'

interface AdminContextType {
  loading: AdminLoadingState
  employees: Employee[]
  customers: Customer[]
  fetchEmployees: () => Promise<void>
  addEmployee: (credentials: EmployeeRegisterCredentials) => Promise<void>
  getCustomers: () => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
=======
import type { AdminLoadingState, Employee } from "../types/admin.types";

import {
  getEmployeesService,
  deleteEmployeeService,
} from "../services/admin.service";

interface AdminContextType {
  loading: AdminLoadingState;
  employees: Employee[];
  fetchEmployees: () => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
>>>>>>> c5eef5c01ecdf0f0d49d13e0fd92e1c6433876e8
}

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminContextProvider = ({ children }: { children: any }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [customers, setCustomers] = useState<Customer[]>([])

  const [loading, setLoading] = useState<AdminLoadingState>({
    employees: false,
<<<<<<< HEAD
    customers: false,
    addEmployee: false,
    deleteCustomer: false
  })
=======
  });
>>>>>>> c5eef5c01ecdf0f0d49d13e0fd92e1c6433876e8

  async function fetchEmployees() {
    try {
      setLoading((prev) => ({ ...prev, employees: true }));
      const res = await getEmployeesService();
      setEmployees(res);
    } catch (error: any) {
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, employees: false }));
    }
  }

  async function deleteEmployee(id: string) {
    try {
      await deleteEmployeeService(id);
      await fetchEmployees();
    } catch (error: any) {
      throw error;
    }
  }

  async function addEmployee(credentials: EmployeeRegisterCredentials) {
    try {
      setLoading(prev => ({ ...prev, addEmployee: true }))
      await addEmployeeService(credentials)
      await fetchEmployees()
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, addEmployee: false }))
    }
  }

  async function getCustomers() {
    try {
      setLoading(prev => ({ ...prev, customers: true }))
      const res = await getCustomersService()
      setCustomers(res)
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, customers: false }))
    }
  }

  async function deleteCustomer(id: string) {
    try {
      setLoading(prev => ({ ...prev, deleteCustomer: true }))
      await deleteCustomerService(id)
      setCustomers(prev => prev.filter(c => c._id !== id))
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, deleteCustomer: false }))
    }
  }

  return (
<<<<<<< HEAD
    <AdminContext.Provider value={{
      loading,
      employees,
      fetchEmployees,
      addEmployee,
      customers,
      getCustomers,
      deleteCustomer
    }}>
=======
    <AdminContext.Provider
      value={{
        loading,
        employees,
        fetchEmployees,
        deleteEmployee,
      }}
    >
>>>>>>> c5eef5c01ecdf0f0d49d13e0fd92e1c6433876e8
      {children}
    </AdminContext.Provider>
  );
};
