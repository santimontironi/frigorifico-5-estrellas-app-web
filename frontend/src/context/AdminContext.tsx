import { createContext, useState } from "react";

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
}

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminContextProvider = ({ children }: { children: any }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState<AdminLoadingState>({
    employees: false,
  });

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

  return (
    <AdminContext.Provider
      value={{
        loading,
        employees,
        fetchEmployees,
        deleteEmployee,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
