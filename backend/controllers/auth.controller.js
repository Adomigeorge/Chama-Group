const { user } = require('../models');  // lowercase 'user'
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Login user
const loginUser = async (req, res) => {
  try {
    console.log('🎯 === AUTH CONTROLLER CALLED ===');
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;

    // 1) Check if email exists
    if (!email) {
      console.log('❌ No email provided');
      return res.status(400).json({
        status: 'error',
        message: 'Email is required',
      });
    }

    // 2) Check if user exists - use lowercase 'user'
    console.log('Searching for user with email:', email);
    const foundUser = await user.findOne({ where: { email } });
    console.log('User found:', foundUser ? `YES (ID: ${foundUser.id})` : 'NO');

    if (!foundUser) {
      console.log('❌ User does not exist - rejecting login');
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    // 3) Check if password exists
    if (!password) {
      console.log('❌ No password provided');
      return res.status(400).json({
        status: 'error',
        message: 'Password is required',
      });
    }

    // 4) Verify password
    console.log('Verifying password...');
    console.log('Input password:', password);
    console.log('Stored hash:', foundUser.password.substring(0, 20) + '...');
    
    const isPasswordValid = await foundUser.verifyPassword(password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password - rejecting login');
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    // 5) Generate token and send response
    const token = generateToken(foundUser.id);
    
    // Remove password from response
    const userResponse = { ...foundUser.toJSON() };
    delete userResponse.password;

    console.log('✅ Login successful for user:', foundUser.id);
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      data: {
        user: userResponse,
      },
    });

  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during login',
    });
  }
};

module.exports = {
  loginUser,
};