const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function createAdmin() {
  try {
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      middleName: '',
      nameExtension: 'N/A',
      idNumber: '22-2023-000001',
      salutation: 'Mr.',
      email: 'yurisuncheeze27@gmail.com',
      password: 'admin123',
      role: 'admin'
    };

    console.log('Creating admin account...');
    const response = await axios.post(`${API_URL}/auth/setup-admin`, adminData);
    
    console.log('Admin account created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
  } catch (error) {
    console.error('Error creating admin account:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

createAdmin(); 