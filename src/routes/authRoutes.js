const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
router.post('/register', authController.register);
router.post('/signin', authController.signin);

module.exports = router;
