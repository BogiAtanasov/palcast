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
  // console.log(req.params.user);
  try {
    // console.log(likes.rows);
    let podcasts =  await pool.query("SELECT * FROM podcasts p WHERE p.user_id = $1", [req.params.user]);
    for (var pod of podcasts.rows) {
      let likes =  await pool.query("SELECT user_id FROM likes WHERE podcast_id = $1", [pod.podcast_id]);
      let comments =  await pool.query("SELECT * FROM comments c LEFT JOIN profiles p ON (p.user_id = c.user_id) WHERE podcast_id = $1", [pod.podcast_id]);
      pod.likes = likes.rows.map((elem) => {
        return elem.user_id;
      });
      pod.comments = comments.rows.map((elem) => {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let d = new Date(elem.date_added);
        elem.date_added = d.toLocaleDateString("en-US",options);
        return elem;
      });
    }
    // const podcasts =  await pool.query("SELECT * FROM podcasts");
    let podcasts_formated = podcasts.rows.map((elem)=>{
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let d = new Date(elem.date_added);
      elem.date_added = d.toLocaleDateString("en-US",options);
      return elem;
    });

    const followers =  await pool.query("SELECT * FROM follows f LEFT JOIN profiles p ON (f.user_id = p.user_id) WHERE f.follows_user_id = $1", [req.params.user]);
    const following =  await pool.query("SELECT * FROM follows f LEFT JOIN profiles p ON (f.user_id = p.user_id) WHERE f.user_id = $1", [req.params.user]);

    const profile =  await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.params.user]);

    let payload = {
      "podcasts" : podcasts_formated,
      "profile" : profile.rows[0],
      'followers' : followers.rows,
      'following' : followers.rows,
    }

    res.json(payload);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});



module.exports = router;
