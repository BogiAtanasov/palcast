const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const pool = require("../../db");

// @route GET api/catalog/category
// @desc Uploads mp3
router.get('/category/:category', auth, async (req,res) => {
  console.log(req.params.category);
  try {
    const podcasts =  await pool.query("SELECT * FROM podcasts as po LEFT JOIN profiles as pr ON (po.user_id = pr.user_id) WHERE category = $1", [req.params.category]);
    // const podcasts =  await pool.query("SELECT * FROM podcasts");
    res.json(podcasts.rows);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});



module.exports = router;
