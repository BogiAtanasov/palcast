import React, { useState, useRef, Fragment, useEffect } from 'react';
import Button from '../forms/Button';
import {connect} from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';
import podcast from '../../assets/podcast/test.mp3'
import './layout.css';
import { FaPlay, FaStepForward, FaStepBackward, FaForward, FaBackward, FaPause } from 'react-icons/fa';

const ProgressBar = ({progress, timeleft, timepassed}) => {
  return(
    <div className="progress_bar">
      <div className="timepassed">
        {timepassed != 0 ?
           <span>
             {Math.floor(timepassed / 60) < 10 ?
              "0" + Math.floor(timepassed / 60) :
              Math.floor(timepassed / 60)
             }
              <span>:</span>
              {
                (timepassed-(Math.floor(timepassed / 60)*60)).toFixed(0) < 10 ?
                "0" + (timepassed-(Math.floor(timepassed / 60)*60)).toFixed(0) :
                (timepassed-(Math.floor(timepassed / 60)*60)).toFixed(0)
              }
           </span> : null}
      </div>
      <div className="timeleft">
        {timeleft != 0 ?
           <span>
             {Math.floor(timeleft / 60) < 10 ?
              "0" + Math.floor(timeleft / 60) :
              Math.floor(timeleft / 60)
             }
              <span>:</span>
              {
                (timeleft-(Math.floor(timeleft / 60)*60)).toFixed(0) < 10 ?
                "0" + (timeleft-(Math.floor(timeleft / 60)*60)).toFixed(0) :
                (timeleft-(Math.floor(timeleft / 60)*60)).toFixed(0)
              }
           </span> : null}
      </div>
      <div style={{width: `${progress}%`}} className="currentProgress"></div>
    </div>
  )
}

const MediaNavbar = ({logout, isAuthenticated, media}) => {
  const [mediaProgress, setMediaProgressInput] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState();
  const [currentProgress, setCurrentProgress] = useState();
  const [test, setTest] = useState(1);
  let interval = useRef(null); // setInterval
  let podcast_media = useRef();
  useEffect(()=>{
    if(media.file != null){
      podcast_media.current = new Audio("http://localhost:3000/uploads/podcasts/" + media.file.file_path);
      playAudio();
    }
    // const interval = setInterval(() => {
    //   console.log(media.currentTime);
    //   console.log(media.duration);
    //   setMediaProgressInput((media.currentTime / media.duration) * 100);
    // }, 1000);
    // return () => clearInterval(interval);
  }, [media]);

  useEffect(() => {
    if(media.file != null){
      return () => {
        pauseAudio();
      };
    }
  }, [media]);

  const playAudio = () => {
    podcast_media.current.play();
    setCurrentlyPlaying(true);
    interval.current = setInterval(() => {
      setCurrentTime(podcast_media.current.currentTime);
      setCurrentProgress(Math.ceil((podcast_media.current.currentTime / podcast_media.current.duration) * 100) / 100);
    }, 100);
  }
  const pauseAudio = () => {
    clearInterval(interval.current);
    podcast_media.current.pause();
    setCurrentlyPlaying(false);
  }

  if(!isAuthenticated)return(<Fragment></Fragment>);


  return (
    <div className="media_navbar">
      <div className="media_navbar_buttons">
        <button onClick={()=>{
          podcast_media.current.currentTime -= 10;
        }}><FaStepBackward /></button>
        <button onClick={()=>{
          podcast_media.current.currentTime -= 10;
        }}><FaBackward /></button>
        {currentlyPlaying ?
         <button className="button_pause" onClick={()=>{
            pauseAudio();
          }}><FaPause /></button>
          :
          <button className="button_play" onClick={()=>{
            playAudio();
          }}><FaPlay /></button>
        }
        <button onClick={()=>{
          podcast_media.current.currentTime += 10;
        }}><FaForward /></button>
        <button onClick={()=>{
          podcast_media.current.currentTime += 10;
        }}><FaStepForward /></button>
      </div>

      {media.file &&
      <div className="media_podcast_info">
        <div className="media_podcast_info_title" >{media.file.title}</div>
        <div className="media_podcast_info_user">{media.file.first_name}<span> </span>{media.file.last_name}</div>
      </div>
      }

      <ProgressBar
        timeleft={podcast_media.current ? podcast_media.current.duration - podcast_media.current.currentTime : 0}
        timepassed={podcast_media.current ? podcast_media.current.currentTime : 0}
        progress={podcast_media.current ? ((podcast_media.current.currentTime / podcast_media.current.duration) * 100) : 0}/>
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
