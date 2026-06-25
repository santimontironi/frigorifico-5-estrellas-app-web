import Admin from '../models/admin.model.js'

class AdminRepository{
    async findAdminByUsername(username){
        return await Admin.findOne({username})
    }

    async createAdmin(admin, password){
        return await Admin.create(admin, password)
    }
}

const adminRepository = new AdminRepository()
export default adminRepository