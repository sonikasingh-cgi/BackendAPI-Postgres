// src/controllers/passwordResetController.js
const otpGenerator = require('otp-generator');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const passwordResetController = {
  async requestReset(req, res) {
    console.log('request reset received')
    try {
      const { email } = req.body;
      if (!email){
        res.status(400).json({ message: 'no email provided' });
        return;
      }
      console.log(`request by: ${email}`)
      // Generate OTP and store it in Redis
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
      //console.log(otp);
      //update OTP in db
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds
      const user = await User.findByEmail(email);
      if(!user){
        res.status(400).json({ message: 'you are not registered with us' });
        return;
      }
      console.log(`found user with id=${user.id}`)
      await User.updateOTP(user.id, otp , otpExpiry);

      // Send the OTP via email
      const transporter = nodemailer.createTransport({
        service: 'Outlook', // Configure this based on your email provider
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;
  
        // Retrieve OTP and OTP expiry from the database for the user
        const user = await User.findByEmail(email);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        // Validate OTP
        const issuedOtp = await User.getOtp(user.id)
        if (otp !== issuedOtp.otp_secret) {
          return res.status(400).json({ error: 'Invalid OTP' });
        }
  
        // Check OTP expiry
        const currentTimestamp = new Date();
        if (currentTimestamp > issuedOtp.otp_expiry) {
          return res.status(400).json({ error: 'OTP has expired' });
        }
  
        // Update the user's password in the database
        await User.updatePassword(user.id, newPassword);
        res.status(200).json({ message: 'Password reset successful' });
            console.log('password reset successful');
  } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
  },
};

module.exports = passwordResetController;
