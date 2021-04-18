import React, { useState, Fragment, useEffect } from 'react';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { logout } from '../actions/auth';
import PropTypes from 'prop-types';
import podcast from '../assets/podcast/test.mp3'

const MediaNavbar = ({logout, isAuthenticated}) => {
  useEffect(()=>{
    console.log("Consturcted MediaNavbar");

  }, []);


  if(!isAuthenticated)return(<Fragment></Fragment>);

  const test = new Audio (podcast);

  return (
    <div>
      Playbar Test
      <button onClick={()=>{
        test.play();
      }}>Play</button>
      <button onClick={()=>{
        test.pause();
      }}>Pause</button>
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
