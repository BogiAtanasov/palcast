const express = require('express');
const pool = require("../../db");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// @route POST api/users
// @desc Register user

router.post('/', async (req,res) => {
  const {email,password, first_name, last_name} = req.body;

  //See if user exists
  let user_exists = await pool.query("SELECT email FROM users WHERE email = $1", [email]);

  if(user_exists.rows.length){
    // User exists
    return res.status(400).json({error: {msg:"This email is already in use", code: 'USER_EXISTS'}});
  }

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  let encrypted_password = await bcrypt.hash(password, salt);

  // Save the user
  let saved_user = await pool.query("INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *", [email,encrypted_password]);
  //saved_user.rows[0]

  //Create a new profile
  pool.query("INSERT INTO profiles (user_id, first_name, last_name) VALUES ($1, $2, $3)", [saved_user.rows[0].user_id, first_name, last_name]);

  const payload = {
    user: {
      id: saved_user.rows[0].user_id
    }
  }

  jwt.sign(
    payload,
    config.get('jwtSecret'),
    {expiresIn: 3600},
    (err, token) => {
      if(err)res.send(err);
      res.json({ token });
    }
  );

});


// @route GET api/users
// @desc Get all users

router.get('/', async (req,res) => {
  let all_users = await pool.query("SELECT * FROM users");

  console.log(all_users.rows);
});

module.exports = router;
