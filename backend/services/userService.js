const bcrypt = require('bcryptjs');
const userRepo = require('../repositories/userRepo');
const interestRepo = require('../repositories/interestRepo');

class UserService {
  async getPreferences(userId) {
    const user = await userRepo.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const interests = await interestRepo.getInterestsByUserId(userId);

    return {
      language: user.language || 'English',
      profession: user.profession || 'Technology',
      voice: user.voice || 'Aria',
      interests: interests || [],
    };
  }

  async savePreferences(userId, { language, profession, interests = [], voice }) {
    const updateData = {};

    if (language) {
      const validLangs = ['English', 'Hindi'];
      if (!validLangs.includes(language)) {
        const error = new Error('Invalid language selection. Must be English or Hindi.');
        error.statusCode = 400;
        throw error;
      }
      updateData.language = language;
    }

    if (profession) {
      updateData.profession = profession;
    }

    if (voice) {
      const validVoices = ['Aria', 'Kai', 'Meera'];
      if (!validVoices.includes(voice)) {
        const error = new Error('Invalid voice selection. Must be Aria, Kai, or Meera.');
        error.statusCode = 400;
        throw error;
      }
      updateData.voice = voice;
    }

    if (Object.keys(updateData).length > 0) {
      await userRepo.updateUser(userId, updateData);
    }

    if (Array.isArray(interests)) {
      await interestRepo.setInterests(userId, interests);
    }

    return await this.getPreferences(userId);
  }

  async updateProfile(userId, { name }) {
    if (!name || !name.trim()) {
      const error = new Error('Name cannot be empty');
      error.statusCode = 400;
      throw error;
    }

    await userRepo.updateUser(userId, { name: name.trim() });
    const updatedUser = await userRepo.findById(userId);
    return updatedUser;
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      const error = new Error('Current password and new password are required');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('New password must be at least 6 characters long');
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepo.findByIdWithPassword(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error('Incorrect current password');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({ password: hashedPassword });

    return {
      message: 'Password changed successfully',
    };
  }
}

module.exports = new UserService();