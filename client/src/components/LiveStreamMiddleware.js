import React, { useState, useEffect } from 'react';
import Input from './forms/Input';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { getCurrentProfile, updateProfile } from '../actions/profile';
import PropTypes from 'prop-types';
import { FaCog } from "react-icons/fa";
import {Link} from 'react-router-dom';
import axios from 'axios';
import LiveStream from './LiveStream';


const LiveStreamMiddleware =({auth, profile: {profile,loading}}) => {

  if(profile == null || profile == "undefined" || auth == null || auth.user == null){
    return (
      <div>
      Loading
      </div>
    )
  }

  console.log("PROFILE", profile);
  return (
    <div>
    <LiveStream />
    </div>
  )
}

LiveStreamMiddleware.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
})

export default connect(mapStateToProps,null)(LiveStreamMiddleware);
