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


  const [currentPage, setCurrentPage] = useState("home");

  if(!isAuthenticated)return(<Fragment></Fragment>);
  return (
    <div className="navbar">
      <div className="navbar_container">
        <ul>
          <Link to="/home"><li className={`${currentPage == "home" ? 'active' : ""}`} onClick={()=>setCurrentPage("home")}>Home</li></Link>
          <Link to="/browse"><li className={`${currentPage == "browse" ? 'active' : ""}`} onClick={()=>setCurrentPage("browse")}>Browse</li></Link>
          <Link to="/studio"><li className={`${currentPage == "record" ? 'active' : ""}`} onClick={()=>setCurrentPage("record")}>Record</li></Link>
          <li className={`${currentPage == "support" ? 'active' : ""}`} onClick={()=>setCurrentPage("support")}>Support</li>
        </ul>

        <div className="navIcons" >
            <div className={`${currentPage == "notifications" ? 'active' : ""}`} onClick={()=>setCurrentPage("notifications")}><FaBell/></div>
            <Link to="/profile"><div className={`${currentPage == "profile" ? 'active' : ""}`} onClick={()=>setCurrentPage("profile")}><FaUserAlt /></div></Link>
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
