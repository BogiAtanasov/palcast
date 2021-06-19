import React, { useState, Fragment, useEffect, useRef } from 'react';
import Button from '../forms/Button';
import {connect} from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';
import podcast from '../../assets/podcast/test.mp3'
import './layout.css';
import { FaBell, FaUserAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({logout, user, isAuthenticated}) => {

  const [currentPage, setCurrentPage] = useState("home");
  const [notifications, setNotifications] = useState([]);
  const [notificationDropdown, toggleNotifications] = useState(false);
  const [unread, setUnread] = useState(false);
  const dropdownRef = useRef(false);


  useEffect(()=>{
      getNotifications();
      const interval = setInterval(() => {
        getNotifications();
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
        //If open dropdown mark notifications as seen;
        if(notificationDropdown){
          let updateNotifications = [];
          for(let elem of notifications){
            if(!elem.seen){
              updateNotifications.push(elem.notification_id);
            }
          }

          if(updateNotifications.length > 0){
            const config = {
              headers: {
                'Content-Type': 'application/json'
              }
            }

            const body = JSON.stringify({notificationList: updateNotifications});

            const res = axios.post('/api/profile/updateNotifications', body, config);
          }
        }
  }, [notificationDropdown]);

  const getNotifications = async () => {
      const res = await axios.get('/api/profile/notifications');
      var counter = 0;
      for(let elem of res.data){
        if(!elem.seen){
          counter++;
        }
      }
      //If dropdown not opened
      if(!dropdownRef.current){
        setNotifications(res.data);
        setUnread(counter);
      }
  }

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
            <div className={`notificationBlock ${currentPage == "notifications" ? 'active' : ""}`} onClick={()=>{
              toggleNotifications(!notificationDropdown);
              setUnread(0);
              dropdownRef.current = !dropdownRef.current;
            }}>
            <FaBell/>
            {unread > 0 &&
            <div className="unread">
              {unread}
            </div>
            }
            {notificationDropdown &&
            <div className="notificationList">
              {(notifications.length > 0 && notificationDropdown ) && notifications.map((elem) => {
                return(
                  <div className="notificationRow">
                    {!elem.seen &&
                      <span className="newDot"></span>
                    }
                    <img className="notification_pp" src={`/uploads/images/${elem.profile_picture}`} alt=""/>
                    <div className="notification_info">
                      <p>{elem.date_added}</p>
                      <p>{elem.msg}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            }
            </div>
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
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
})

export default connect(mapStateToProps, {logout})(Navbar);
