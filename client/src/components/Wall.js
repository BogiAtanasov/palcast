import React, { useState, useEffect } from 'react';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { update_media } from '../actions/media';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Images from './Images';
import Inbox from './Inbox';
import axios from 'axios';
import { getCurrentProfile } from '../actions/profile';
import { MdChatBubbleOutline } from 'react-icons/md';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { BiCommentDetail } from 'react-icons/bi';
const Wall = ({getCurrentProfile,update_media, match, auth, profile: {profile,loading}}) => {
  const [podcastLists, setPodcastLists] = useState([]);
  const [profileInfo, setProfileInfo] = useState({});
  const [postDropdowns, setPostDropdowns] = useState({});
  const [comment, setComment] = useState({});
  const [followers, setFollowers] = useState([]);
  const [followers_ids, setFollowersIds] = useState([]);
  const [following, setFollowing] = useState([]);
  const [inboxOpened, openInbox] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(()=>{
    getCurrentProfile();

  }, [loading]);

  const getProfileWall = async () => {
    try {
        const res = await axios.get('/api/catalog/user/' + match.params.user);
        setPodcastLists(res.data.podcasts);
        setProfileInfo(res.data.profile);
        setFollowers(res.data.followers);
        setFollowing(res.data.following);

        let follower_ids  = res.data.followers.map((elem) => {
          return elem.user_id;
        });

        setFollowersIds([...follower_ids]);
        let dropdowns = {};
        res.data.podcasts.map((elem)=>{
          dropdowns[elem.podcast_id] = false;
        });
        console.log("dropdowns",dropdowns);
        setPostDropdowns([...dropdowns]);
    } catch (e) {

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

  const follow = async () =>{

  setFollowersIds([...followers_ids, auth.user.user_id]);

  setFollowers([...followers, {user_id: auth.user.user_id, profile_picture: profile.profile_picture}])


    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({user_id: match.params.user});

    const res = await axios.post('/api/interact/follow', body, config);


  }
  const unfollow = async () =>{

    let temp_followers = followers_ids;
    const index = temp_followers.indexOf(auth.user.user_id);
    if (index > -1) {
      temp_followers.splice(index, 1);
    }
    setFollowersIds([...temp_followers]);

    let follower_index = followers.findIndex(x => x.user_id == auth.user.user_id);
    console.log("followers",followers);
    console.log("followers",follower_index);
    if(follower_index > -1){
      followers.splice(follower_index,1);
    }

    setFollowers([...followers]);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({user_id: match.params.user});

    const res = await axios.post('/api/interact/unfollow', body, config);

  }

  const playMedia = (file) => {
    update_media(file);
  }

  useEffect(() => {
    getProfileWall();
  }, []);

  const handleKeyDown = (podcast_id) => (event) =>{
    if (event.key === 'Enter') {
      addComment(podcast_id);
    }
  }

  return (
    <div className="wall_page wall_page__container">
      <img className="wall_cover" src={`/uploads/images/${profileInfo.cover_photo}`} alt=""/>
      <div className="wall_page__content">
        <div className="wall_left">
          <img className="profile_image" src={`/uploads/images/${profileInfo.profile_picture}`} alt=""/>
          { auth.user && followers_ids.includes(auth.user.user_id) ?
            <Button className="unfollow_button" onClick={() => unfollow()} primary text="Unfollow"></Button> :
            <Button className="follow_button" onClick={() => follow()} primary text="Follow"></Button>
          }

          <div className="following_block">
            <div>
              <h4>Following</h4>
              <p>{following.length}</p>
            </div>
            <div>
              <h4>Followers</h4>
              <p>{followers_ids.length}</p>
            </div>
          </div>
          <div className="followers_block">
            {followers.map((elem) => {
              console.log(followers);
              return (
                <img src={`/uploads/images/${elem.profile_picture}`} alt=""/>
              )
            })}
            {/* <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/> */}
          </div>
        </div>
        <div className="wall_right">
          <div style={{display: 'flex', alignItems: "center"}}>
            <h4 className="user_name" ><span>{profileInfo.first_name}</span> <span>{profileInfo.last_name}</span></h4>
            <div onClick={()=>{openInbox(!inboxOpened)}} className="chatBubble" style={{background: `${inboxOpened ? "white" : "black"}`, color: `${inboxOpened ? "black" : "white"}`}}>
              <MdChatBubbleOutline />
            </div>
          </div>
          <div className="feed">

            <div className="feed_content">
              {podcastLists.length > 0 && podcastLists.map((elem) => {
                  return (
                    <div className="podcast_block">
                      <div className="podcast__left">

                        <div className="podcastHeaders">
                          <img className="profile_image" src={`/uploads/images/${profileInfo.profile_picture}`} alt=""/>
                          <div style={{position: 'relative', width: "100%"}}>
                            <Link to={`/user/` + elem.user_id} ><h3>{elem.first_name} {elem.last_name}</h3></Link>
                            <h4>{elem.date_added}</h4>
                            <div onClick={()=>playMedia(elem)} className="play_button">
                              <FaPlay />
                            </div>
                          </div>

                        </div>
                        <div className="podcastDescription">
                          <h3>{elem.title}<span className={`badge badge-${elem.category}`}>{elem.category}</span></h3>

                          <p>{elem.description}</p>

                        </div>

                        <img className="episode_cover" src={`/uploads/images/${elem.episode_cover}`} alt=""/>



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
                        <img className="write_profile_picture" src={`/uploads/images/${profile.profile_picture}`}/>
                        <input type="text" value={comment[elem.podcast_id]} onChange={(value)=>setComment({...comment, [elem.podcast_id]:value.target.value})} onKeyDown={handleKeyDown(elem.podcast_id)} placeholder="Write comment..." />
                      </div>
                    </div>
                  )
              })}
            </div>
            <div className="inbox" style={{overflow: 'hidden', maxWidth: `${inboxOpened ? "1000px" : "0px"}`}}>
              {console.log("User Profile Render", profileInfo)}
              {(profileInfo && profile) &&

                <Inbox messages={messages} userProfile={profileInfo} myProfile={profile} receiver={match.params.user}/>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Wall.propTypes = {
  update_media: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile,update_media})(Wall);
