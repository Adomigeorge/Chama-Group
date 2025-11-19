const { user } = require('../models');

const registerUser = async (req, res) => {
  try {
    console.log('=== REGISTER USER CONTROLLER START ===');
    console.log('Request body received:', req.body);

    const { name, email, phone, password } = req.body;

    // Check if we have all required fields
    if (!name || !email || !phone || !password) {
      console.log('Missing fields:', { name, email, phone, password: !!password });
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    console.log('Checking if user exists...');
    const existingUser = await user.findOne({ where: { email } });
    console.log('Existing user found:', existingUser ? 'YES' : 'NO');

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    console.log('Creating user in database...');
    const newUser = await user.create({
      name,
      email,       
      phone,
      password
    });
    console.log('✅ User created successfully with ID:', newUser.id);

    // Remove password from response
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;

    console.log('=== REGISTER USER CONTROLLER SUCCESS ===');
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: userResponse
    });

  } catch (error) {
    console.error('=== REGISTER USER CONTROLLER ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error creating user: ' + error.message
    });
  }
};

module.exports = {
  registerUser
};