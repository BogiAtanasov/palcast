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



module.exports = router;
