const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const createToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const authController = {
  async register(req, res) {
    try {
      console.log('POST /register request received');
      const { username, password,email,phone,address,image_path,profession } = req.body;
      const user = await User.create(username, password,email,phone,address,image_path,profession);
      if(user == undefined){
        res.status(400).json({ 'message':'either username or email is missing' });
        return;
      }
      const token = createToken(user);
      console.log('registeration for user is successful');
      res.status(201).json({ token });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async signin(req, res) {
    try {
      console.log('POST /signin request received')
      const { email, password } = req.body;
      const user = await User.findByEmail(email);

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = createToken(user);
      console.log('signing attempt successful');
      res.status(200).json({ 
        "username": user.username,
        token
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = authController;
