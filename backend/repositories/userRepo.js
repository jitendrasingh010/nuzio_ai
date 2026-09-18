const { User, UserInterest } = require('../models');

class UserRepo {
  async findById(id) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: UserInterest,
          as: 'interests',
          attributes: ['interest'],
        },
      ],
    });
  }

  async findByIdWithPassword(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({
      where: { email },
      include: [
        {
          model: UserInterest,
          as: 'interests',
          attributes: ['interest'],
        },
      ],
    });
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async updateUser(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(updateData);
  }
}

module.exports = new UserRepo();
