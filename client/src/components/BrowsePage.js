import React, { useState } from 'react';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { update_media } from '../actions/media';
import { logout } from '../actions/auth';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Images from './Images';
import axios from 'axios';
import { FaStar, FaPlay, FaHeart } from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';

const BrowsePage = ({update_media,auth, profile: {profile,loading}}) => {

  const [searchInput, setInput] = useState('');
  const [podcastLists, setPodcastLists] = useState([]);
  const [comment, setComment] = useState({});
  const [postDropdowns, setPostDropdowns] = useState({});

  const updateSearch = async (val) => {

    setInput(val);
    if(val === ""){
      setPodcastLists([]);
      return;
    }


    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({search: val});

    const res = await axios.post('/api/catalog/search', body, config);

    if(res.data.length > 0){
      setPodcastLists(res.data);
    }else{
      setPodcastLists([]);
    }

  }

  const likePost = async (podcast_id) => {

    let podcast_index = podcastLists.findIndex(x => x.podcast_id == podcast_id);
    podcastLists[podcast_index].likes = [...podcastLists[podcast_index].likes, auth.user.user_id];

    setPodcastLists([...podcastLists]);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({podcast_id: podcast_id});

    const res = await axios.post('/api/interact/like', body, config);

  }

  const unlikePost = async (podcast_id) => {

    let podcast_index = podcastLists.findIndex(x => x.podcast_id == podcast_id);
    let user_index = podcastLists[podcast_index].likes.indexOf(auth.user.user_id);
    if(user_index > -1){
      podcastLists[podcast_index].likes.splice(user_index,1);
    }

    setPodcastLists([...podcastLists]);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({podcast_id: podcast_id});

    const res = await axios.post('/api/interact/unlike', body, config);


  }

  const addComment = async (podcast_id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    setComment({...comment, [podcast_id]: ""});

    const body = JSON.stringify({podcast_id: podcast_id, text:comment[podcast_id]});

    const res = await axios.post('/api/interact/comment', body, config);
    let podcast_index = podcastLists.findIndex(x => x.podcast_id == podcast_id);
    podcastLists[podcast_index].comments = [...podcastLists[podcast_index].comments, {...res.data.comment, profile_picture: profile.profile_picture, first_name: profile.first_name, last_name: profile.last_name}];
    setPodcastLists([...podcastLists]);

  }

  const handleKeyDown = (podcast_id) => (event) =>{
    if (event.key === 'Enter') {
      addComment(podcast_id);
    }
  }

  const playMedia = (file) => {
    update_media(file);
  }

  return (
    <div className="browse_page browse_page__container">
      <div className="browse_page__content">
        <h1>Explore</h1>
        <div className="explore_input">
          <input value={searchInput} onChange={(val)=>updateSearch(val.target.value)} type="text"/>
        </div>
        <div style={{overflow:'hidden', maxHeight: `${podcastLists.length === 0 ? '1000px' : "0px"}`}} className="categoriesBlock">
          <div className="category">
            <Link to="/category/science">
              <img src={Images.cat1} alt=""/>
              <h4>Science Podcasts</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum sunt culpa debitis consequuntur</p>
            </Link>
          </div>
          <div className="category">
            <Link to="/category/comedy">
              <img src={Images.cat2} alt=""/>
              <h4>Comdey Podcasts</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum sunt culpa debitis consequuntur</p>
            </Link>
          </div>
          <div className="category">
            <Link to="/category/chill">
              <img src={Images.cat3} alt=""/>
              <h4>Chill Podcasts</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum sunt culpa debitis consequuntur</p>
            </Link>
          </div>
          <div className="category">
            <Link to="/category/health">
              <img src={Images.cat4} alt=""/>
              <h4>Health Podcasts</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum sunt culpa debitis consequuntur</p>
            </Link>
          </div>
        </div>
        <div style={{maxWidth: 1000}} className="feed">
          {podcastLists.length > 0 && podcastLists.map((elem) => {
            if(elem.suggested === undefined){
            return (
              <div className="podcast_block__container">
                <div className="podcast_block">
                  <div className="podcast__left">

                    <div className="podcastHeaders">
                      <img className="profile_image" src={`/uploads/images/${elem.profile_picture}`} alt=""/>
                      <div>
                        <Link to={`/user/` + elem.user_id} ><h3>{elem.first_name} {elem.last_name}</h3></Link>
                        <h4>{elem.date_added}</h4>
                      </div>
                    </div>
                    <div className="podcastDescription">
                      <h3 style={{display: 'flex', alignItems: 'center'}}>{elem.title}<span className={`badge badge-${elem.category}`}>{elem.category}</span></h3>
                      <p>{elem.description}</p>
                    </div>

                  </div>
                  <div className="podcast__right">
                    <img src={`/uploads/images/${elem.episode_cover}`} alt=""/>
                    <div onClick={()=>playMedia(elem)} className="play_button_container">
                      <div className="play_button">
                        <FaPlay />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="interactionBlock">
                  <div className="likes">
                    { auth.user && elem.likes.includes(auth.user.user_id) ?
                      <div onClick={() => unlikePost(elem.podcast_id)} className="unlike"><FaHeart />{elem.likes.length}</div> :
                      <div onClick={() => likePost(elem.podcast_id)} className="like"><FaHeart />{elem.likes.length}</div>
                    }
                  </div>
                  <div onClick={()=> setPostDropdowns({...postDropdowns, [elem.podcast_id]: !postDropdowns[elem.podcast_id]})} className="comments"><BiCommentDetail/> {elem.comments.length}</div>

                </div>

                <div className="commentDropdown" style={{maxHeight: `${postDropdowns[elem.podcast_id] ? "1000px" : "0px"}`}}>
                  <p>{elem.comments.length} Comments</p>
                  <div className="comment_list">
                    {elem.comments.length > 0 && elem.comments.map((item) => {
                      return(
                        <div className="comment__block">
                          <div style={{display: 'flex'}}>
                            <img style={{width:45, height: 45, objectFit: 'cover', borderRadius: "100%"}} src={`/uploads/images/${item.profile_picture}`} alt=""/>
                            <div>
                              <p className="comment__date_added">{item.date_added}</p>
                              <p className="comment__user"><span>{item.first_name}</span> <span>{item.last_name}</span></p>
                            </div>
                          </div>
                          <p className="comment__text">{item.comment_text}</p>
                        </div>
                      )
                    })}
                  </div>

                </div>
                <div className="writeCommentB">
                  <img className="write_profile_picture" src={`/uploads/images/${profile.profile_picture ? profile.profile_picture : ""}`}/>
                  <input type="text" value={comment[elem.podcast_id]} onChange={(value)=>setComment({...comment, [elem.podcast_id]:value.target.value})} onKeyDown={handleKeyDown(elem.podcast_id)} placeholder="Write comment..." />
                </div>
              </div>


            )}
          })}
        </div>
      </div>
    </div>
  )
}

BrowsePage.propTypes = {
  update_media: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, {update_media})(BrowsePage);
