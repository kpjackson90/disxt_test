const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const { roleAuthorization } = require('../middleware/roleAuthorization');
const { requireAuth } = require('../middleware/requireAuth');
const { setUserInfo } = require('../middleware/setUserInfo');
const { passwordChecker } = require('../middleware/passwordChecker');

const router = express.Router();

/**Signup route */
router.post('/api/signup', async (req, res) => {
  const { username, password, role } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).send({ error: 'User already exists' });
  }

  if (!username) {
    return res.status(400).send({ error: 'Missing username' });
  }

  if (!password) {
    return res.status(400).send({ error: 'Please enter password' });
  }

  try {
    const user = new User({
      username,
      password,
      role,
    });

    if (passwordChecker(password)) {
      return res.status(400).send({ message: passwordChecker(password) });
    }

    await user.save();
    const userInfo = setUserInfo(user);
    const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: 10080,
    });

    res.status(200).send({ token, role, message: 'User successfully created' });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

/**Signin route */
router.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ error: 'Must provide username and password' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send({
      error:
        'Username not found, please create an account or verify your username address',
    });
  }

  try {
    await user.comparePassword(password);
    const userInfo = setUserInfo(user);
    const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: 10080,
    });
    return res.status(200).send({ token });
  } catch (err) {
    return res.status(400).send({ error: 'Invalid password or username' });
  }
});

/**return current user */
router.get(
  '/api/current-user',
  requireAuth,
  roleAuthorization(['admin', 'client']),
  async (req, res) => {
    try {
      const user = await User.findById({ _id: req.user._id }, { password: 0 });
      return res.status(200).send(user);
    } catch (err) {
      return res.status(400).send({ error: 'User not found' });
    }
  }
);

/**Update User information */
router.put(
  '/api/update-user',
  requireAuth,
  roleAuthorization(['admin', 'client']),
  async (req, res) => {
    try {
      const user = await User.findById({ _id: req.user._id });
      if (!user) {
        return res.status(400).send({ message: 'User does not exist' });
      }

      await User.updateOne({ _id: req.user._id }, req.body);
      return res.status(200).send({ message: 'User updated' });
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  }
);

module.exports = router;
