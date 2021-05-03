import React, { useState, Fragment, useEffect } from 'react';
import Button from '../forms/Button';
import {connect} from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';
import podcast from '../../assets/podcast/test.mp3'
import './layout.css';
import { FaBell, FaUserAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Navbar = ({logout, isAuthenticated}) => {


  if(!isAuthenticated)return(<Fragment></Fragment>);
  return (
    <div className="navbar">
      <div className="navbar_container">
        <ul>
          <li className="logo">Palcast</li>
          <Link to="/browse"><li>Browse</li></Link>
          <Link to="/studio"><li>Record</li></Link>
          <li>Support</li>
        </ul>

        <div className="navIcons" >
            <div><FaBell/></div>
            <Link to="/profile"><div><FaUserAlt /></div></Link>
        </div>
      </div>
    </div>
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {logout})(Navbar);
