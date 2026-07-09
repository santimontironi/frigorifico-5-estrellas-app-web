import userRepository from "../repository/user.repository.js";

class AdminController {
  async getEmployees(req, res) {
    try {
      const employees = await userRepository.findByRole("employee");
      return res.status(200).json(employees);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const employee = await userRepository.deleteEmployeeById(id);
      if (!employee)
        return res.status(404).json({ message: "Empleado no encontrado" });
      return res
        .status(200)
        .json({ message: "Empleado eliminado correctamente" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getCustomers(req, res) {
    try{
      const customers = await userRepository.findByRole('user')

      if(!customers) return res.status(404).json({ message: 'No se encontraron clientes' })
        
      return res.status(200).json(customers)
    }
    catch(error){
      return res.status(500).json({ message: error.message })
    }
  }

  async deleteCustomer(req, res) {
    try{
      const { id } = req.params

      const customerToDelete = await userRepository.findById(id)

      if(!customerToDelete) return res.status(404).json({ message: 'Cliente no encontrado' })

      await userRepository.deleteUser(id)

      return res.status(200).json({ customer: customerToDelete, message: 'Cliente eliminado correctamente' })
    }
    catch(error){
      return res.status(500).json({ message: error.message })
    }
  }
}

const adminController = new AdminController();
export default adminController;
