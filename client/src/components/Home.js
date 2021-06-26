import React, { useState,useEffect } from 'react';
import Button from './forms/Button';
import axios from 'axios';
import {connect} from 'react-redux';
import { logout } from '../actions/auth';
import { update_media } from '../actions/media';
import { getCurrentProfile } from '../actions/profile';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaStar, FaPlay, FaHeart } from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';

const Home = ({getCurrentProfile, logout, update_media, auth, profile: {profile,loading}}) => {
  const [podcastLists, setPodcastLists] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [livestreamList, setLivestreamList] = useState([]);
  const [postDropdowns, setPostDropdowns] = useState({});
  const [tabSelected, setTab] = useState("following");
  const [comment, setComment] = useState({});

  const getInitialFeed = async () => {
    try {
        const res = await axios.get('/api/catalog/feed');
        setPodcastLists(res.data.podcasts);
        setPopularList(res.data.popular);
        setLivestreamList(res.data.livestreams)
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

  useEffect(() => {
    getInitialFeed();
  }, []);

  useEffect(()=>{
    getCurrentProfile();

  }, [loading]);

  const playMedia = (file) => {
    update_media(file);
  }

  const handleKeyDown = (podcast_id) => (event) =>{
    if (event.key === 'Enter') {
      addComment(podcast_id);
    }
  }

  if(profile == null){
    return(
      <div>
        Loading
      </div>
    )
  }

  return (
    <div className="home_page home_page__container">
      <h1>Hey {profile.first_name}</h1>
      <div className="home_page__content">
        <div className="home_page__left">
            <nav>
              <h4>Popular Today</h4>
              <FaStar />
            </nav>
            {popularList.length > 0 && popularList.map((elem) => {
              return (
                <div className="podcast_block">
                  <div className="podcast__top">
                    <img src={`/uploads/images/${elem.episode_cover}`} alt=""/>
                  </div>
                  <div className="podcast__bottom">

                    <div style={{flex: "0 1 25%", alignItems: "center", transform: "translateY(-70px)"}} className="podcastHeaders">
                      <img className="profile_image" src={`/uploads/images/${elem.profile_picture}`} alt=""/>
                      <div>
                        <Link to={`/user/` + elem.user_id} ><h3>{elem.first_name} {elem.last_name}</h3></Link>
                        {/* <h4>{elem.date_added}</h4> */}
                      </div>
                    </div>
                    <div style={{flex: "0 1 50%"}} className="podcastDescription">
                      <h3>{elem.title}</h3>
                      <span style={{marginLeft:0}} className={`badge badge-${elem.category}`}>{elem.category}</span>

                      <p>{elem.description}</p>
                    </div>
                    <div onClick={()=>playMedia(elem)} className="play_button">
                      <FaPlay />
                    </div>
                  </div>


                </div>
              )
            })}
        </div>
        <div className="home_page__right">
          <div className="feed_navbar">
            <h4 onClick={()=>setTab("following")} className={`${tabSelected == "following" ? "selected" : ""}`}>Following</h4>
            <h4 onClick={()=>setTab("livestreams")} className={`${tabSelected == "livestreams" ? "selected" : ""}`}>Live Shows</h4>
          </div>
          <div className="feed_content">
            {(tabSelected === "following" && podcastLists.length > 0 ) && podcastLists.map((elem) => {
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
                      <div onClick={()=>playMedia(elem)} className="play_button">
                        <FaPlay />
                      </div>
                    </div>
                    <div className="podcast__right">
                      <img src={`/uploads/images/${elem.episode_cover}`} alt=""/>
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
                    {/* <div style={{position: 'relative', width: "fit-content"}}>
                      <textarea rows="6" className="writeComment" primary value={comment} iconName='mail' onChange={(value)=>setComment(value.target.value)} placeholder="Write comment"/>
                      <div className="saveCommentButton">
                        <Button className="follow_button" onClick={() => addComment(elem.podcast_id)} primary text="Post comment"></Button>
                      </div>
                    </div> */}
                  </div>
                  <div className="writeCommentB">
                    <img className="write_profile_picture" src={`/uploads/images/${profile.profile_picture ? profile.profile_picture : ""}`}/>
                    <input type="text" value={comment[elem.podcast_id]} onChange={(value)=>setComment({...comment, [elem.podcast_id]:value.target.value})} onKeyDown={handleKeyDown(elem.podcast_id)} placeholder="Write comment..." />
                  </div>
                </div>


              )
            })}

            {(tabSelected === "livestreams" && livestreamList.length > 0 ) && livestreamList.map((elem) => {
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
                      <Link to={`/stream?room=${elem.title}`}>
                        <div className="play_button">
                          <FaPlay />
                        </div>
                      </Link>
                    </div>
                    <div className="podcast__right">
                      <img src={`/uploads/images/${elem.episode_cover}`} alt=""/>
                    </div>

                  </div>



                </div>


              )
            })}

            {(tabSelected === "livestreams" && livestreamList.length === 0 ) &&
              <div style={{minHeight:500, display:'flex', justifyContent:'center'}} className="podcast_block__container">
                <h4 style={{fontWeight:400}}>There are no live podcasts</h4>
              </div>

              }


          </div>
        </div>
        {/* <Button onClick={()=> logout() } primary text="Logout"></Button> */}
      </div>
    </div>
  )
}

Home.propTypes = {
  logout: PropTypes.func.isRequired,
  update_media: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired

}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, {logout, update_media, getCurrentProfile})(Home);
