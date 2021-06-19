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

    const podcast = await pool.query("SELECT * from podcasts WHERE podcast_id = $1", [podcast_id]);
    msg = 'has liked your podcast ' + podcast.rows[0].title;

    createNotification(req.user.id,podcast.rows[0].user_id, msg);



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

    //Notification
    const podcast = await pool.query("SELECT * from podcasts WHERE podcast_id = $1", [podcast_id]);
    msg = 'has commented on your podcast ' + podcast.rows[0].title;
    createNotification(req.user.id,podcast.rows[0].user_id, msg);

    res.json({comment: new_comment.rows[0]});
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

// @route POST api/interact/follow
// @desc Follow user
router.post('/follow', auth, async (req,res) => {
  const {user_id} =  req.body;
  console.log(user_id);
  try {
    let follow =  await pool.query("INSERT INTO follows (user_id, follows_user_id) VALUES ($1,$2) RETURNING *", [req.user.id,user_id]);

    //Notification
    msg = 'is now following you';
    createNotification(req.user.id,user_id, msg);

    res.json({"success": true});
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/interact/follow
// @desc Follow user
router.post('/unfollow', auth, async (req,res) => {
  const {user_id} =  req.body;
  try {
    let follow =  await pool.query("DELETE FROM follows WHERE user_id = $1 AND follows_user_id = $2 ", [req.user.id,user_id]);
    res.json({"success": true});
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/interact/sendMessage
// @desc Send direct message
router.post('/sendMessage', auth, async (req,res) => {
  const {receiver_user_id, message} =  req.body;
  try {
    let messages =  await pool.query("INSERT INTO inbox_messages (sender_user_id, reciever_user_id, message_text) VALUES ($1,$2,$3) RETURNING *", [req.user.id,receiver_user_id, message]);

    //Notification
    msg = 'just messaged you';
    createNotification(req.user.id,receiver_user_id, msg);

    res.json({"success": true});
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});


const createNotification = async (initiator_id, receiver_id, msg) => {
  //Get profile name and add to msg
  let initiator_profile = await pool.query("SELECT first_name, last_name FROM profiles WHERE user_id = $1", [initiator_id]);

  final_msg = initiator_profile.rows[0].first_name + " " + initiator_profile.rows[0].last_name + " " + msg;

  await pool.query("INSERT INTO notifications (initiator_id, receiver_id, msg) VALUES ($1,$2,$3)", [initiator_id, receiver_id, final_msg]);

}


module.exports = router;
