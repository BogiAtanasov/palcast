import React, { useState, useRef, Fragment, useEffect } from 'react';
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

const MediaNavbar = ({logout, isAuthenticated, media}) => {
  const [mediaProgress, setMediaProgressInput] = useState(0);
  let podcast_media = useRef();
  useEffect(()=>{
    podcast_media.current = new Audio("http://localhost:3000/uploads/podcasts/" + media.file);
    podcast_media.current.play()
    console.log("Consturcted MediaNavbar");
    //
    // const interval = setInterval(() => {
    //   console.log(media.currentTime);
    //   console.log(media.duration);
    //   setMediaProgressInput((media.currentTime / media.duration) * 100);
    // }, 1000);
    // return () => clearInterval(interval);
  }, [media]);

  useEffect(() => {
    return () => {
      podcast_media.current.pause()
    };
  }, [media]);



  if(!isAuthenticated)return(<Fragment></Fragment>);


  return (
    <div className="media_navbar">
      Playbar Test
      <button onClick={()=>{
        podcast_media.current.play();
      }}>Play</button>
      <button onClick={()=>{
        podcast_media.current.pause();
      }}>Pause</button>
      <button onClick={()=>{
        console.log(podcast_media.current.currentTime);
        console.log(podcast_media.current.duration);
      }}>currentTime</button>
      <button onClick={()=>{
        podcast_media.current.currentTime += 10;
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
  isAuthenticated: state.auth.isAuthenticated,
  media: state.media
})

export default connect(mapStateToProps, {logout})(MediaNavbar);
