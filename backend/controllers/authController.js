const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to process forgot password request',
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPassword({ email, otp, newPassword });
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to reset password',
      });
    }
  }
}

module.exports = new AuthController();
