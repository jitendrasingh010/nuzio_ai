const userService = require('../services/userService');

class UserController {
  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = await userService.getPreferences(userId);
      return res.status(200).json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch user preferences',
      });
    }
  }

  async savePreferences(req, res) {
    try {
      const userId = req.user.id;
      const { language, profession, interests, voice } = req.body;
      const updated = await userService.savePreferences(userId, {
        language,
        profession,
        interests,
        voice,
      });
      return res.status(200).json({
        success: true,
        message: 'Preferences updated successfully',
        data: updated,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to save preferences',
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name } = req.body;
      const updatedUser = await userService.updateProfile(userId, { name });
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update profile',
      });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(userId, {
        currentPassword,
        newPassword,
      });
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to change password',
      });
    }
  }
}

module.exports = new UserController();
