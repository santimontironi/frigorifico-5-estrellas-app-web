import User from '../models/user.model.js'

class UserRepository {
  async createUser(data) {
    return await User.create(data)
  }

  async findUserByEmail(email) {
    return await User.findOne({ email })
  }

  async findUserById(id) {
    return await User.findById(id).select('-password')
  }

  async confirmUser(id) {
    return await User.findByIdAndUpdate(id, { confirmed: true }, { new: true })
  }
}

const userRepository = new UserRepository()
export default userRepository
