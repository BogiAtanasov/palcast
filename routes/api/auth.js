const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const pool = require("../../db");
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// @route GET api/auth
// @desc Get user
router.get('/', auth, async (req,res) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1",[req.user.id]);
    res.json(user.rows[0]);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});


// @route POST api/auth
// @desc Login user & get token
router.post('/', async (req,res) => {
  const {email,password} = req.body;

  if(!password){
    return res.status(400).json({error: {msg:"Password is required", code: 'PASSWORD_EMPTY'}});
  }
  if(!email){
    return res.status(400).json({error: {msg:"Email is required", code: 'EMAIL_EMPTY'}});
  }

  try {

    //See if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if(!user.rows.length){
      return res.status(400).json({error: {msg:"Invalid credentials", code: 'INVALID_CREDENTIALS'}});
    }

    const passMatch = await bcrypt.compare(password, user.rows[0].password);

    if(!passMatch){
      return res.status(400).json({error: {msg:"Invalid credentials", code: 'INVALID_CREDENTIALS'}});
    }

    const payload = {
      user: {
        id: user.rows[0].user_id
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

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }



});

module.exports = router;
