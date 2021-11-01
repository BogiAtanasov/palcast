import React, { useState, useRef, Fragment, useEffect } from 'react';
import Button from '../forms/Button';
import {connect} from 'react-redux';
import { logout } from '../../actions/auth';
import PropTypes from 'prop-types';
import podcast from '../../assets/podcast/test.mp3'
import './layout.css';
import { FaPlay, FaStepForward, FaStepBackward, FaForward, FaBackward, FaPause } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { update_media } from '../../actions/media';
import axios from 'axios';

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

const MediaNavbar = ({match, logout, isAuthenticated, media, update_media}) => {
  // const routerlocation = useLocation();
  const [mediaProgress, setMediaProgressInput] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState();
  const [trackIndex, setTrackIndex] = useState();
  const [updateHistory, setUpdateHistory] = useState(true);
  const [currentProgress, setCurrentProgress] = useState();
  const [history, setHistory] = useState([]);
  const [test, setTest] = useState(1);
  const [buttonClicks, setButtonClicks] = useState(0)
  let interval = useRef(null); // setInterval
  let podcast_media = useRef();

  useEffect(()=>{
    if(media.file != null){
      podcast_media.current = new Audio("http://palcast.net/uploads/podcasts/" + media.file.file_path);
      if(buttonClicks > 0){
        playAudio();
      }

      if(updateHistory){
        window.localStorage.setItem("playingHistory", JSON.stringify([...history, media]))
        setTrackIndex(history.length);
        setHistory([...history, media]);
        setUpdateHistory(true);
      }
    }

  }, [media]);

  useEffect(() => {
    if(media.file != null){
      return () => {
        pauseAudio();
      };
    }
  }, [media]);

  useEffect(() => {
    if(media.file === null){
      var localHistory = window.localStorage.getItem("playingHistory");
      if(localHistory != null){
        localHistory = JSON.parse(localHistory);
        setHistory(localHistory);
        let lastItem = localHistory[localHistory.length-1];
        setTrackIndex(localHistory.length-1);
        update_media(lastItem.file);
      }
    }
  }, []);

  const playAudio = () => {

    if(podcast_media.current === undefined){
      getNewPodcast();
      return;
    }

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

  const getNewPodcast = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    console.log(history);
    const body = JSON.stringify({history: history.map((elem) => {
      return(elem.file.podcast_id);
    })});

    const res = await axios.post('/api/studio/getNewPodcast', body, config);
    if(res.data === "")return;

    update_media(res.data);
  }

  if(!isAuthenticated)return(<Fragment></Fragment>);
  // if(window.location.pathname==="/" || window.location.pathname==="/login" || window.location.pathname==="/register")return(<Fragment></Fragment>);


  return (
    <div className="media_navbar">
      <div className="media_navbar_buttons">
        <button onClick={()=>{
          if(trackIndex > 0){
            setTrackIndex(trackIndex-1);
            setUpdateHistory(false);
            update_media(history[trackIndex-1].file);
          }

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
            setButtonClicks(buttonClicks+1);
          }}><FaPlay /></button>
        }
        <button onClick={()=>{
          podcast_media.current.currentTime += 10;
        }}><FaForward /></button>
        <button onClick={()=>{
          if(trackIndex < history.length - 1){
            setTrackIndex(trackIndex+1);
            setUpdateHistory(false);
            update_media(history[trackIndex+1].file);
          }else{
            //Get new podcast
            getNewPodcast();
          }
        }}><FaStepForward /></button>
      </div>

      {media.file &&
      <div className="media_podcast_info">
        <img className="navbar_episode_cover" src={`/uploads/images/${media.file.episode_cover}`} alt=""/>
        <div>
          <div className="media_podcast_info_title" >{media.file.title}</div>
          <div className="media_podcast_info_user">{media.file.first_name}<span> </span>{media.file.last_name}</div>
        </div>
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
  isAuthenticated: PropTypes.bool,
  update_media: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  media: state.media
})

export default connect(mapStateToProps, {logout, update_media})(MediaNavbar);
