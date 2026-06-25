import Admin from '../models/admin.model.js'

class AdminRepository {
  async createAdmin(data) {
    return await Admin.create(data)
  }

  async findAdminByUsername(username) {
    return await Admin.findOne({ username })
  }

  async findAdminById(id) {
    return await Admin.findById(id).select('-password')
  }
}

const adminRepository = new AdminRepository()
export default adminRepository
