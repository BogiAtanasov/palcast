import React, { useState, useEffect } from 'react';
import Input from './forms/Input';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { getCurrentProfile, updateProfile } from '../actions/profile';
import PropTypes from 'prop-types';
import { FaCog } from "react-icons/fa";
import {Link} from 'react-router-dom';

const UploadStream = ({auth}) => {

  const[formData, setFormData] = useState({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      profile_id: ''
  });

  const[selectedTab, setTab] = useState("upload");

  const submitForm = () => {

  };
  const uploadFile = () => {

  };
  const uploadEpisodeCover = () => {

  };

  return (
    <div className="uploadstream_page uploadstream_page__container">
      <div className="uploadstream_page__content">
        <div className="studio_tabs">
          <h1 onClick={()=>setTab("upload")} className={`${selectedTab == "upload" ? "selected" : ""}`}>Upload Podcast</h1>
          <h1 onClick={()=>setTab("stream")} className={`${selectedTab == "stream" ? "selected" : ""}`}>Stream Podcast</h1>
        </div>

        {selectedTab == "upload" &&
        <div className="profile__form">
          <Button onClick={()=> uploadFile() }  text="Upload File" description="the file must be mp3 or wav format" title="Upload File"></Button>
          <Input value={formData.email} onChange={(value)=>setFormData({...formData, email:value})} title="Name" description="Set the title of the podcast"/>
          <Input value={formData.password} onChange={(value)=>setFormData({...formData, password:value})} title="Category" description="Set the category of the podcast"/>
          <Input value={formData.first_name} onChange={(value)=>setFormData({...formData, first_name:value})} title="First Name" description="Change your first name"/>
          <Input value={formData.last_name} onChange={(value)=>setFormData({...formData, last_name:value})} title="Last Name" description="Change your last name"/>
          <Button onClick={()=> uploadEpisodeCover() }  text="Upload File" description="Set the cover photo for this episode" title="Episode Photo"></Button>
          <Button onClick={()=> submitForm() } primary text="Publish"></Button>

        </div>
        }

        {selectedTab == "stream" &&
        <div className="profile__form">
          <Input value={formData.email} onChange={(value)=>setFormData({...formData, email:value})} title="Name" description="Set the title of the podcast"/>
          <Input value={formData.password} onChange={(value)=>setFormData({...formData, password:value})} title="Category" description="Set the category of the podcast"/>

          <Button onClick={()=> submitForm() } primary text="Update Profile"></Button>
        </div>
        }
      </div>
    </div>
  )
}

UploadStream.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(null)(UploadStream);
