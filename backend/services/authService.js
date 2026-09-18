const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepo');
const { sendResetEmail } = require('../utils/nodemail');

class AuthService {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await userRepo.findByEmail(normalizedEmail);
    if (existingUser) {
      const error = new Error('A user with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userRepo.createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      language: 'English',
      profession: 'Technology',
      voice: 'Aria',
    });

    const token = this.generateToken(newUser);

    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        language: newUser.language,
        profession: newUser.profession,
        voice: newUser.voice,
        interests: [],
      },
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepo.findByEmail(normalizedEmail);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);
    const interests = user.interests ? user.interests.map((i) => i.interest) : [];

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        language: user.language,
        profession: user.profession,
        voice: user.voice,
        interests,
      },
    };
  }

  async forgotPassword(email) {
    if (!email) {
      const error = new Error('Email address is required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepo.findByEmail(normalizedEmail);
    if (!user) {
      const error = new Error('No user found with this email address');
      error.statusCode = 404;
      throw error;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.update({
      resetOtp: otp,
      resetOtpExpiry: expiry,
    });

    // Send email using nodemail utility
    const emailResult = await sendResetEmail({
      to: user.email,
      otp,
      userName: user.name,
    });

    return {
      message: 'Verification code sent to your email',
      email: user.email,
      devOtp: emailResult.fallbackOtp || otp,
    };
  }

  async resetPassword({ email, otp, newPassword }) {
    if (!email || !otp || !newPassword) {
      const error = new Error('Email, verification code, and new password are required');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('New password must be at least 6 characters long');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userRepo.findByEmail(normalizedEmail);
    if (!user) {
      const error = new Error('No user found with this email address');
      error.statusCode = 404;
      throw error;
    }

    if (!user.resetOtp || user.resetOtp !== otp.trim()) {
      const error = new Error('Invalid verification code');
      error.statusCode = 400;
      throw error;
    }

    if (new Date() > new Date(user.resetOtpExpiry)) {
      const error = new Error('Verification code has expired. Please request a new code.');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({
      password: hashedPassword,
      resetOtp: null,
      resetOtpExpiry: null,
    });

    return {
      message: 'Password reset successfully. You can now log in with your new password.',
    };
  }

  generateToken(user) {
    const secret = process.env.JWT_SECRET || 'nuzio_ai_super_secret_jwt_key_2026_secure';
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      secret,
      { expiresIn: '7d' }
    );
  }
}

module.exports = new AuthService();
