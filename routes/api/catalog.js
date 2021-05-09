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
    let payload = podcasts.rows.map((elem)=>{
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let d = new Date(elem.date_added);
      elem.date_added = d.toLocaleDateString("en-US",options);
      return elem;
    });

    console.log(payload);
    res.json(payload);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

// @route GET api/catalog/user
// @desc Uploads mp3
router.get('/user/:user', auth, async (req,res) => {
  console.log(req.params.user);
  try {
    const podcasts =  await pool.query("SELECT * FROM podcasts WHERE user_id = $1", [req.params.user]);
    // const podcasts =  await pool.query("SELECT * FROM podcasts");
    let podcasts_formated = podcasts.rows.map((elem)=>{
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let d = new Date(elem.date_added);
      elem.date_added = d.toLocaleDateString("en-US",options);
      return elem;
    });

    const profile =  await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.params.user]);
    console.log("Profile", profile);
    let payload = {
      "podcasts" : podcasts_formated,
      "profile" : profile.rows[0]
    }

    res.json(payload);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});



module.exports = router;
