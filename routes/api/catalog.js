const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const pool = require("../../db");
const axios = require('axios');

// @route GET api/catalog/category
// @desc Uploads mp3
router.get('/category/:category', auth, async (req,res) => {

  try {
    const podcasts =  await pool.query("SELECT * FROM podcasts as po LEFT JOIN profiles as pr ON (po.user_id = pr.user_id) WHERE category = $1", [req.params.category]);
    // const podcasts =  await pool.query("SELECT * FROM podcasts");
    let payload = podcasts.rows.map((elem)=>{
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let d = new Date(elem.date_added);
      elem.date_added = d.toLocaleDateString("en-US",options);
      return elem;
    });


    res.json(payload);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});

// @route GET api/catalog/feed
// @desc Gets the feed for the home page of a user
router.get('/feed', auth, async (req,res) => {
  try {
    const popular_podcasts_query = await pool.query(`SELECT count(like_id),podcast_id from likes GROUP BY podcast_id ORDER BY count(like_id) DESC`);
    var popular_podcasts = [];
    for(let ind in popular_podcasts_query.rows){
      if(ind > 1)break;

      popular_podcasts.push(popular_podcasts_query.rows[ind].podcast_id);
    }
    var podcasts =  await pool.query(
      `SELECT DISTINCT p.podcast_id, p.date_added, p.description, p.file_path, p.episode_cover, p.title, p.category, p.user_id, pr.first_name, pr.last_name, pr.profile_picture
       FROM podcasts as p
       LEFT JOIN follows as f ON (p.user_id = f.follows_user_id)
       LEFT JOIN profiles as pr ON (p.user_id = pr.user_id)
       WHERE f.user_id = $1
       ORDER BY p.date_added DESC`, [req.user.id]);
    const popular = await pool.query(
      `SELECT DISTINCT p.podcast_id, p.date_added, p.description, p.file_path, p.episode_cover, p.title, p.user_id,p.category, pr.first_name, pr.last_name, pr.profile_picture
       FROM podcasts as p LEFT JOIN profiles as pr ON (p.user_id = pr.user_id)
       WHERE p.podcast_id in (`+ popular_podcasts.join(",") +`)`
    )

    const livestreams = await pool.query(
      'SELECT * FROM livestreams l LEFT JOIN profiles p ON (l.user_id = p.user_id)'
    )

    //Get more podcasts if the feed query returns less than 10
    if(podcasts.rows.length < 10){

      let podcast_ids = podcasts.rows.map((elem) => {
        return elem.podcast_id;
      });

      if(podcast_ids.length === 0){
        var suggested_podcasts  = await pool.query(
          `SELECT DISTINCT p.podcast_id, p.date_added, p.description, p.file_path, p.episode_cover, p.title, p.category, p.user_id, pr.first_name, pr.last_name, pr.profile_picture
           FROM podcasts as p
           LEFT JOIN follows as f ON (p.user_id = f.follows_user_id)
           LEFT JOIN profiles as pr ON (p.user_id = pr.user_id)
           ORDER BY p.date_added DESC
           LIMIT $1`, [10-podcasts.rows.length]);
      }else{
        var suggested_podcasts  = await pool.query(
          `SELECT DISTINCT p.podcast_id, p.date_added, p.description, p.file_path, p.episode_cover, p.title, p.category, p.user_id, pr.first_name, pr.last_name, pr.profile_picture
           FROM podcasts as p
           LEFT JOIN follows as f ON (p.user_id = f.follows_user_id)
           LEFT JOIN profiles as pr ON (p.user_id = pr.user_id)` +
           `WHERE p.podcast_id not in (`+ podcast_ids.join(",") + `) ` +
           `ORDER BY p.date_added DESC
           LIMIT $1`, [10-podcasts.rows.length]);
      }



      for(let pod of suggested_podcasts.rows){
        pod['suggested'] = true;
      }
        console.log("Test4");
      podcasts.rows = [...podcasts.rows, ...suggested_podcasts.rows];

    }

    let payload = {
      podcasts: [],
      popular: [],
      livestreams: []
    }
    payload.podcasts = podcasts.rows.map((elem)=>{
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let d = new Date(elem.date_added);
      elem.date_added = d.toLocaleDateString("en-US",options);

      return elem;
    });

    payload.livestreams = livestreams.rows.map((elem)=>{
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let d = new Date(elem.date_added);
      elem.date_added = d.toLocaleDateString("en-US",options);
      return elem;
    });


    for(let pod of payload.podcasts){

      let likes =  await pool.query("SELECT user_id FROM likes WHERE podcast_id = $1", [pod.podcast_id]);
      pod.likes = likes.rows.map((elem) => {
        return elem.user_id;
      });

      let comments = await pool.query("SELECT * FROM comments c LEFT JOIN profiles p ON (p.user_id = c.user_id) WHERE podcast_id = $1", [pod.podcast_id]);
      pod.comments = comments.rows.map((elem) => {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let d = new Date(elem.date_added);
        elem.date_added = d.toLocaleDateString("en-US",options);
        return elem;
      });

    }

    payload.popular = popular.rows;

    for(let pod of payload.popular){

      let likes =  await pool.query("SELECT user_id FROM likes WHERE podcast_id = $1", [pod.podcast_id]);
      pod.likes = likes.rows.map((elem) => {
        return elem.user_id;
      });

      let comments = await pool.query("SELECT * FROM comments c LEFT JOIN profiles p ON (p.user_id = c.user_id) WHERE podcast_id = $1", [pod.podcast_id]);
      pod.comments = comments.rows.map((elem) => {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let d = new Date(elem.date_added);
        elem.date_added = d.toLocaleDateString("en-US",options);
        return elem;
      });

    }

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

// @route POST api/catalog/suggestions
// @desc Gets suggestions from newsapi.org
router.post('/suggestions', auth, async (req,res) => {
  const {category} =  req.body;
  try {
    const news_result = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=d5143f3e263544a38035daaefb2e2b05&category=' + category);
    let news = news_result.data;

    res.json(news);

  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }

});



module.exports = router;
