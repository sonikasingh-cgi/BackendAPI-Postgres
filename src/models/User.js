const pool = require('../database');
const bcrypt = require('bcrypt');

class User {
  async create(username, password,email,phone,address,image_path,profession) {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = `
      INSERT INTO users (username, password,email,phone,address,image_path,profession)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id, username
    `;

    if (email == undefined || username == undefined){
      return;
    }

    const values = [username, hashedPassword, email,phone,address,image_path,profession];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async updateOTP(userId, otp, otpExpiry) {

    const query = `
      UPDATE users
      SET otp_secret = $2,
          otp_expiry= $3
      WHERE id = $1
    `;

    const values = [userId, otp, otpExpiry];

    await pool.query(query, values);
  }

  async getOtp(userId){
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  async updatePassword(userID, newPassword) {
    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const query = `
      UPDATE users
      SET password = $1,
       otp_secret=null,
       otp_expiry=null
      WHERE id = $2
    `;

    const values = [hashedPassword, userID];
    await pool.query(query, values);
  }
}

module.exports = new User();
