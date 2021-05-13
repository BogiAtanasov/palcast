const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const pool = require("../../db");

// @route POST api/interact/like
// @desc Update profile
router.post('/like', auth, async (req,res) => {
  const {podcast_id} =  req.body;
  try {
    const like =  await pool.query("INSERT INTO likes (user_id, podcast_id) VALUES ($1,$2) RETURNING *", [req.user.id,podcast_id,]);

    res.json({success: "true"});

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

// @route POST api/interact/unlike
// @desc Update profile
router.post('/unlike', auth, async (req,res) => {
  const {podcast_id} =  req.body;
  console.log(podcast_id);
  try {
    const unlike =  await pool.query("DELETE FROM likes WHERE user_id = $1 AND podcast_id = $2", [req.user.id,podcast_id]);

    res.json({success: "true"});

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});


module.exports = router;
