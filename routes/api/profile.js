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


module.exports = router;
