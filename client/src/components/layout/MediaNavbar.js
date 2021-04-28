import React, { useState, Fragment, useEffect } from 'react';
import Button from '../forms/Button';
import {connect} from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';
import podcast from '../../assets/podcast/test.mp3'
import './layout.css';

const ProgressBar = ({progress}) => {
  return(
    <div className="progress_bar">
      <div style={{width: `${progress}%`}} className="currentProgress"></div>
    </div>
  )
}

const MediaNavbar = ({logout, isAuthenticated}) => {
  const media = new Audio ("http://localhost:3000/uploads/test.mp3");
  const [mediaProgress, setMediaProgressInput] = useState(0);

  useEffect(()=>{
    console.log("Consturcted MediaNavbar");
    //
    // const interval = setInterval(() => {
    //   console.log(media.currentTime);
    //   console.log(media.duration);
    //   setMediaProgressInput((media.currentTime / media.duration) * 100);
    // }, 1000);
    // return () => clearInterval(interval);
  }, []);




  if(!isAuthenticated)return(<Fragment></Fragment>);


  return (
    <div className="media_navbar">
      Playbar Test
      <button onClick={()=>{
        media.play();
      }}>Play</button>
      <button onClick={()=>{
        media.pause();
      }}>Pause</button>
      <button onClick={()=>{
        console.log(media.currentTime);
        console.log(media.duration);
      }}>currentTime</button>
      <button onClick={()=>{
        media.currentTime += 10;
      }}>+10</button>
      <ProgressBar progress={mediaProgress}/>
    </div>
  )
}

MediaNavbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {logout})(MediaNavbar);
