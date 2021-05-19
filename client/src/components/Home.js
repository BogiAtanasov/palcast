import React, { useState,useEffect } from 'react';
import Button from './forms/Button';
import axios from 'axios';
import {connect} from 'react-redux';
import { logout } from '../actions/auth';
import { update_media } from '../actions/media';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaStar, FaPlay } from 'react-icons/fa';
const Home = ({logout, update_media}) => {
  const [podcastLists, setPodcastLists] = useState([]);
  const [popularList, setPopularList] = useState([]);

  const getInitialFeed = async () => {
    try {
        const res = await axios.get('/api/catalog/feed');
        setPodcastLists(res.data.podcasts);
        setPopularList(res.data.popular);
    } catch (e) {

    }
  }

  useEffect(() => {
    getInitialFeed();
  }, []);

  const playMedia = (file) => {
    update_media(file);
  }

  return (
    <div className="home_page home_page__container">
      <h1>Hey Jack</h1>
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
            <h4>Following</h4>
            <h4>Live Shows</h4>
          </div>
          <div className="feed_content">
            {podcastLists.length > 0 && podcastLists.map((elem) => {
              return (
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
                      <h3>{elem.title}</h3>
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
              )
            })}
          </div>
        </div>
        {/* <Button onClick={()=> logout() } primary text="Logout"></Button> */}
      </div>
    </div>
  )
}

Home.propTypes = {
  logout: PropTypes.func.isRequired,
  update_media: PropTypes.func.isRequired
}

export default connect(null, {logout, update_media})(Home);
