import User from '../models/user.model.js'

class UserRepository {
  async create(data) {
    return await User.create(data)
  }

  async findByEmail(email) {
    return await User.findOne({ email })
  }

  async findById(id) {
    return await User.findById(id).select('-password')
  }

  async confirmUser(id) {
    return await User.findByIdAndUpdate(id, { confirmed: true }, { new: true })
  }

  async updatePassword(id, newPassword) {
    return await User.findByIdAndUpdate(id, { password: newPassword }, { new: true })
  }
}

const userRepository = new UserRepository()
export default userRepository
