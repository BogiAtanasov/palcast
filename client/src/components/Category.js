import React, { useState, useEffect } from 'react';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { update_media } from '../actions/media';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Images from './Images';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
const Category = ({update_media, match}) => {
  const [podcastLists, setPodcastLists] = useState([]);

  const getCategory = async () => {
    try {
        const res = await axios.get('/api/catalog/category/' + match.params.category);
        setPodcastLists(res.data);
    } catch (e) {

    }
  }

  const playMedia = (file) => {
    update_media(file);
  }

  useEffect(() => {
    console.log("Constructing Category");
    getCategory();
  }, []);

  return (
    <div className="catalog_page catalog_page__container">
      <div className="catalog_page__content">

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
  )
}

Category.propTypes = {
  update_media: PropTypes.func.isRequired
}

export default connect(null, {update_media})(Category);
