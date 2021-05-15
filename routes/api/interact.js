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

// @route POST api/interact/comment
// @desc Update profile
router.post('/comment', auth, async (req,res) => {
  const {podcast_id, text} =  req.body;
  try {
    let new_comment =  await pool.query("INSERT INTO comments (user_id, podcast_id, comment_text) VALUES ($1,$2,$3) RETURNING *", [req.user.id,podcast_id,text]);

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let d = new Date(new_comment.rows[0].date_added);
    new_comment.rows[0].date_added = d.toLocaleDateString("en-US",options);

    res.json({comment: new_comment.rows[0]});
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});


module.exports = router;
