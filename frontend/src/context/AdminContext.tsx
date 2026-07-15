import { createContext, useState } from "react";

import type { AdminLoadingState, Employee, Customer, EmployeeRegisterCredentials } from "../types/admin.types";
import type { OrderAdmin, UpdateOrderStatusInput } from "../types/order.types";

import { getEmployeesService, deleteEmployeeService, addEmployeeService, getCustomersService, deleteCustomerService } from "../services/admin.service";
import { getAllOrdersService, updateOrderStatusService } from "../services/order.service";

interface AdminContextType {
  loading: AdminLoadingState;
  employees: Employee[];
  customers: Customer[];
  orders: OrderAdmin[];
  ordersFiltered: OrderAdmin[];
  fetchEmployees: () => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addEmployee: (credentials: EmployeeRegisterCredentials) => Promise<void>;
  getCustomers: () => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getAllOrders: () => Promise<void>;
  updateOrderStatus: (id: string, data: UpdateOrderStatusInput) => Promise<void>;
  getOrdersByStatus: (status: string) => void;
}

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminContextProvider = ({ children }: { children: any }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [customers, setCustomers] = useState<Customer[]>([])

  const [orders, setOrders] = useState<OrderAdmin[]>([])

  const [ordersFiltered, setOrdersFiltered] = useState<OrderAdmin[]>([])

  const [loading, setLoading] = useState<AdminLoadingState>({
    employees: false,
    customers: false,
    addEmployee: false,
    deleteCustomer: false,
    orders: false,
    updateOrder: false,
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
      setEmployees((prev) => prev.filter((e) => e._id !== id));
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

  async function getAllOrders() {
    try {
      setLoading(prev => ({ ...prev, orders: true }))
      const res = await getAllOrdersService()
      setOrders(res.orders)
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, orders: false }))
    }
  }

  async function updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
    try {
      setLoading(prev => ({ ...prev, updateOrder: true }))
      const res = await updateOrderStatusService(id, data)
      // Reemplazamos el pedido actualizado en la lista, sin recargar todo.
      setOrders(prev => prev.map(o => o._id === id ? res.order : o))
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, updateOrder: false }))
    }
  }

  function getOrdersByStatus(status: string) {
    setOrdersFiltered(status ? orders.filter(o => o.status === status) : orders)
  }

  return (
    <AdminContext.Provider
      value={{
        loading,
        employees,
        customers,
        orders,
        fetchEmployees,
        deleteEmployee,
        addEmployee,
        getCustomers,
        deleteCustomer,
        getAllOrders,
        updateOrderStatus,
        ordersFiltered,
        getOrdersByStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
