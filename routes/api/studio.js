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
// @route POST api/studio
// @desc Uploads mp3
router.post('/', [auth,upload.array('uploadFiles', 2)], async (req,res) => {
  const {title, description, category} = JSON.parse(req.body.payload);
  try {
    let new_podcast = await pool.query("INSERT INTO podcasts (user_id,file_path,title,description,category,episode_cover) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *", [req.user.id, req.files[0].originalname,title,description,category,req.files[1].originalname]);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

// @route POST api/studio/livestream
// @desc Adds a podcast to the live rooms
router.post('/livestream', [auth,upload.array('uploadFiles', 1)], async (req,res) => {
  const {title, description, category} = JSON.parse(req.body.payload);

  try {
    let new_live = await pool.query("INSERT INTO livestreams (user_id,title,description,category, episode_cover) VALUES ($1,$2,$3,$4,$5)", [req.user.id, title,description,category, req.files[0].originalname]);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

router.post('/getNewPodcast', auth, async (req,res) => {
  const {history} = req.body;
  console.log(history);

  try {
    var newPodcast = [];
    if(history.length > 0){
      newPodcast = await pool.query(`SELECT DISTINCT p.podcast_id, p.date_added, p.description, p.file_path, p.episode_cover, p.title, p.category, p.user_id, pr.first_name, pr.last_name, pr.profile_picture FROM podcasts as p
        LEFT JOIN profiles as pr ON (p.user_id = pr.user_id)` + `WHERE p.podcast_id not in (`+ history.join(",") + `) ` + `ORDER BY p.date_added DESC LIMIT 1`);
    }else{
      newPodcast = await pool.query(`SELECT DISTINCT p.podcast_id, p.date_added, p.description, p.file_path, p.episode_cover, p.title, p.category, p.user_id, pr.first_name, pr.last_name, pr.profile_picture FROM podcasts as p
        LEFT JOIN profiles as pr ON (p.user_id = pr.user_id) ORDER BY p.date_added DESC LIMIT 1`);
    }

    res.json(newPodcast.rows[0]);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});



module.exports = router;
