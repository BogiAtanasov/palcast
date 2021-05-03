import React, { useState, useEffect } from 'react';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { logout } from '../actions/auth';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Images from './Images';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
const Category = ({logout, match}) => {
  const [podcastLists, setPodcastLists] = useState([]);

  const getCategory = async () => {
    try {
        const res = await axios.get('/api/catalog/category/' + match.params.category);
        setPodcastLists(res.data);
    } catch (e) {

    }
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
                  <img className="profile_image" src={`/uploads/images/${elem.episode_cover}`} alt=""/>
                  <h3>{elem.first_name} {elem.last_name}</h3>
                </div>
                <div className="podcastDescription">
                  <h3>{elem.title}</h3>
                  <p>{elem.description}</p>
                </div>
                <div className="play_button">
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
  logout: PropTypes.func.isRequired
}

export default connect(null, {logout})(Category);
