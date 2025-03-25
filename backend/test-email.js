require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmailConfig() {
  console.log('Email Configuration Test');
  console.log('=======================');
  console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set (hidden)' : 'Not set');
  console.log('BASE_URL:', process.env.BASE_URL);
  
  try {
    console.log('\nCreating transporter...');
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    console.log('\nVerifying transporter...');
    const verification = await transporter.verify();
    console.log('Transporter verification:', verification ? 'SUCCESS' : 'FAILED');
    
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to self for testing
      subject: 'Test Email from SSP Management System',
      text: 'This is a test email to verify the email configuration is working correctly.'
    });
    
    console.log('Test email sent!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
    return true;
  } catch (error) {
    console.error('\nEmail test failed:');
    console.error(error);
    return false;
  }
}

testEmailConfig()
  .then(success => {
    console.log('\nTest completed:', success ? 'SUCCESS' : 'FAILED');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 