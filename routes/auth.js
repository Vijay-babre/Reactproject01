const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { register, login } = require('../controllers/auth');
const validate = require('../middleware/validate');

const authSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

router.post('/register', validate(authSchema), register);
router.post('/login', validate(authSchema), login);

module.exports = router;