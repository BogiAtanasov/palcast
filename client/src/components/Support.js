import React, { useState, useEffect } from 'react';
import Input from './forms/Input';
import Button from './forms/Button';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Images from './Images';
import axios from 'axios';

const Support = ({auth, profile: {profile,loading}}) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');


  const sendEmail = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({subject: subject, content: content});

    setSubject("");
    setContent("");

    const res = await axios.post('/api/profile/sendSupportEmail', body, config);
  }

  return (
    <div className="support_page support_page__container">
      <div className="support_page__content">
        <img className="support_image" src={Images.support} alt=""/>
        <h1>Send us an email</h1>
        <div className="support_input">
          <p>Subject</p>
          <input primary value={subject} onChange={(value)=>setSubject(value.target.value)} placeholder=""/>
        </div>
        <div className="support_input">
          <p>Content</p>
          <textarea rows="10" primary value={content} onChange={(val)=>setContent(val.target.value)} placeholder=""/>
        </div>
        <Button onClick={()=>sendEmail()} primary text="Send"></Button>
      </div>
    </div>
  )
}

Support.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, null)(Support);
