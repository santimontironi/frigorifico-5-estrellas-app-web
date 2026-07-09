import User from "../models/user.model.js";

class UserRepository {
  async create(data) {
    return await User.create(data);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
<<<<<<< HEAD
    return await User.findOne({ _id: id, active: true }).select('-password')
=======
    return await User.findById(id).select("-password");
>>>>>>> c5eef5c01ecdf0f0d49d13e0fd92e1c6433876e8
  }

  async confirmUser(id) {
    return await User.findByIdAndUpdate(
      id,
      { confirmed: true },
      { returnDocument: "after" },
    );
  }

  async updatePassword(id, newPassword) {
    return await User.findByIdAndUpdate(
      id,
      { password: newPassword },
      { returnDocument: "after" },
    );
  }

<<<<<<< HEAD
  async findConfirmedUser(email){
    return await User.find({email: email, confirmed: true, active: true})
  }

  async findByRole(role){
    return await User.find({ role, active: true }).select('-password').sort({ createdAt: -1 })
  }

  async deleteUser(id) {
    return await User.findByIdAndUpdate(id, { active: false }, { returnDocument: 'after' })
=======
  async findConfirmedUser(email) {
    return await User.find({ email: email, confirmed: true });
  }

  async findByRole(role) {
    return await User.find({ role, active: true })
      .select("-password")
      .sort({ createdAt: -1 });
  }

  async deleteEmployeeById(id) {
    return await User.findOneAndUpdate(
      { _id: id, role: "employee" },
      { active: false },
      { returnDocument: "after" },
    );
>>>>>>> c5eef5c01ecdf0f0d49d13e0fd92e1c6433876e8
  }
}

const userRepository = new UserRepository();
export default userRepository;
