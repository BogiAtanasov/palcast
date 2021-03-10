const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const pool = require("../../db");

// @route GET api/profile/me
// @desc Get profile
router.get('/me', auth, async (req,res) => {

  try {
    const profile =  await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user.id]);

    res.json(profile.rows[0]);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

// @route POST api/profile
// @desc Update profile
router.post('/', auth, async (req,res) => {
  const {first_name, last_name} =  req.body;
  try {
    const profile =  await pool.query("UPDATE profiles SET (first_name, last_name) = ($1,$2) WHERE user_id = $3 RETURNING *", [first_name,last_name,req.user.id]);

    res.json(profile.rows[0]);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});


module.exports = router;
