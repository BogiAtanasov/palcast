const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const pool = require("../../db");
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.mimetype == "audio/mpeg"){
      cb(null, 'client/public/uploads/podcasts');
    }else{
      cb(null, 'client/public/uploads/images');
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})
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
router.post('/', [auth,upload.array('uploadFiles', 2)], async (req,res) => {
  const {first_name, last_name} =  JSON.parse(req.body.payload);
  try {
    let profile =  await pool.query("UPDATE profiles SET (first_name, last_name, profile_picture) = ($1,$2,$4) WHERE user_id = $3 RETURNING *", [first_name,last_name,req.user.id,req.files[0].originalname]);
    if(profile.rowCount === 0){
      profile = await pool.query("INSERT INTO profiles (user_id, first_name, last_name, profile_picture) VALUES ($1,$2,$3,$4) RETURNING *", [req.user.id,first_name,last_name,req.files[0].originalname]);
    }
    res.json(profile.rows[0]);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

// @route GET api/profile/user/:user_id
// @desc Get profile by user_id
router.get('/user/:user_id', auth, async (req,res) => {
  try {
    const profile =  await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.params.user_id]);

    res.json(profile.rows[0]);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});


// @route GET api/profile/messageHistory
// @desc Get profile
router.post('/messageHistory', auth, async (req,res) => {
  const {user_id} =  req.body;
  try {
    const messages =  await pool.query("SELECT * FROM inbox_messages WHERE (reciever_user_id = $1 AND sender_user_id = $2) OR (reciever_user_id = $2 AND sender_user_id = $1)", [user_id,req.user.id]);

    res.json(messages.rows);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

// @route GET api/profile/notifications
// @desc Gets last 10 notifications
router.get('/notifications', auth, async (req,res) => {

  try {
    const notifications =  await pool.query("SELECT * FROM notifications n LEFT JOIN profiles p ON (p.user_id = n.initiator_id) WHERE receiver_id = $1 ORDER BY date_added DESC LIMIT 10", [req.user.id]);
    console.log(notifications.rows);
    for(let notif of notifications.rows){
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let d = new Date(notif.date_added);
      notif.date_added = d.toLocaleDateString("en-US",options);
    }

    res.json(notifications.rows);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

// @route GET api/profile/updateNotifications
// @desc Updates the sent notifications as seen
router.post('/updateNotifications', auth, (req,res) => {
  const notificationList =  req.body.notificationList.join(',');
  try {

    pool.query("UPDATE notifications SET seen=true WHERE notification_id in ("+ notificationList +")", []);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});


module.exports = router;
