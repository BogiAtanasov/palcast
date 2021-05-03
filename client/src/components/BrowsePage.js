import React, { useState } from 'react';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { logout } from '../actions/auth';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Images from './Images';
const BrowsePage = ({logout}) => {

  return (
    <div className="browse_page browse_page__container">
      <div className="browse_page__content">
        <h1>Explore</h1>
        <div className="explore_input">
          <input type="text"/>
          <button>Search</button>
        </div>
        <div className="categoriesBlock">
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
              <h4>Science Podcasts</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum sunt culpa debitis consequuntur</p>
            </Link>
          </div>
          <div className="category">
            <Link to="/category/chill">
              <img src={Images.cat3} alt=""/>
              <h4>Science Podcasts</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum sunt culpa debitis consequuntur</p>
            </Link>
          </div>
          <div className="category">
            <Link to="/category/health">
              <img src={Images.cat4} alt=""/>
              <h4>Science Podcasts</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum sunt culpa debitis consequuntur</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

BrowsePage.propTypes = {
  logout: PropTypes.func.isRequired
}

export default connect(null, {logout})(BrowsePage);
