import React, { useState, useEffect } from 'react';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { update_media } from '../actions/media';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Images from './Images';
import axios from 'axios';
import { MdChatBubbleOutline } from 'react-icons/md';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { BiLike, BiDislike, BiHeart, BiCommentDetail } from 'react-icons/bi';
const Wall = ({update_media, match, auth}) => {
  const [podcastLists, setPodcastLists] = useState([]);
  const [profileInfo, setProfileInfo] = useState({});
  const [postDropdowns, setPostDropdowns] = useState({});
  const [comment, setComment] = useState("");

  //
  // useEffect(()=>{
  // }, [podcastLists]);

  const getProfileWall = async () => {
    try {
        const res = await axios.get('/api/catalog/user/' + match.params.user);
        setPodcastLists(res.data.podcasts);
        setProfileInfo(res.data.profile);

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

  const follow = () =>{
      console.log(profileInfo)
      console.log(podcastLists)
  }

  const playMedia = (file) => {
    update_media(file);
  }

  useEffect(() => {
    getProfileWall();
  }, []);

  return (
    <div className="wall_page wall_page__container">
      <img className="wall_cover" src="https://cdn.searchenginejournal.com/wp-content/uploads/2020/02/7-tips-to-make-a-successful-podcast-5e3d9fa1ad735-760x400.png" alt=""/>
      <div className="wall_page__content">
        <div className="wall_left">
          <img className="profile_image" src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
          <Button className="follow_button" onClick={() => follow()} primary text="Follow"></Button>
          <div className="following_block">
            <div>
              <h4>Following</h4>
              <p>123</p>
            </div>
            <div>
              <h4>Followers</h4>
              <p>11</p>
            </div>
          </div>
          <div className="followers_block">
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt=""/>
          </div>
        </div>
        <div className="wall_right">
          <div style={{display: 'flex', alignItems: "center"}}>
            <h4 className="user_name" ><span>{profileInfo.first_name}</span> <span>{profileInfo.last_name}</span></h4>
            <div className="chatBubble">
              <MdChatBubbleOutline />
            </div>
          </div>
          <div className="feed">
            <div className="feed_navbar">

            </div>
            <div className="feed_content">
              {podcastLists.length > 0 && podcastLists.map((elem) => {
                return (
                  <div className="podcast_block">
                    <div className="podcast__left">

                      <div className="podcastHeaders">
                        <img className="profile_image" src={`/uploads/images/${elem.episode_cover}`} alt=""/>
                        <div style={{position: 'relative', width: "100%"}}>
                          <Link to={`/user/` + elem.user_id} ><h3>{elem.first_name} {elem.last_name}</h3></Link>
                          <h4>{elem.date_added}</h4>
                          <div onClick={()=>playMedia(elem)} className="play_button">
                            <FaPlay />
                          </div>
                        </div>

                      </div>
                      <div className="podcastDescription">
                        <h3>{elem.title}</h3>
                        <p>{elem.description}</p>

                      </div>

                      <img className="episode_cover" src={`/uploads/images/${elem.episode_cover}`} alt=""/>
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
                        <div style={{position: 'relative', width: "fit-content"}}>
                          <textarea rows="6" className="writeComment" primary value={comment} iconName='mail' onChange={(value)=>setComment(value.target.value)} placeholder="Write comment"/>
                          <div className="saveCommentButton">
                            <Button className="follow_button" onClick={() => follow()} primary text="Post comment"></Button>

                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Wall.propTypes = {
  update_media: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps, {update_media})(Wall);
