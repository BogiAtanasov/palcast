import React, { useState, useEffect } from 'react';
import Input from './forms/Input';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { getCurrentProfile, updateProfile } from '../actions/profile';
import PropTypes from 'prop-types';
import { FaCog } from "react-icons/fa";
import {Link} from 'react-router-dom';
import axios from 'axios';
import FormData from 'form-data';


const UploadStream = ({auth}) => {

  const[formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      mp3: null,
      episode_cover: null,
  });

  const[selectedTab, setTab] = useState("upload");

  const submitForm = async e => {

      let info = JSON.stringify({
        title: formData.title,
        description: formData.description,
        category: formData.category,
      })
      const body = new FormData();
      body.append("payload", info);
      body.append("uploadFiles", formData.mp3);
      body.append("uploadFiles", formData.episode_cover);

      const res = await axios.post('api/studio', body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
      });
  };

  const addLiveStream = () => {

    let info = JSON.stringify({
      title: formData.title,
      description: formData.description,
      category: formData.category,
    });

    const body = new FormData();
    body.append("payload", info);
    body.append("uploadFiles", formData.episode_cover);

    axios.post('api/studio/livestream', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }


  return (
    <div className="uploadstream_page uploadstream_page__container">
      <div className="uploadstream_page__content">
        <div className="studio_tabs">
          <h1 onClick={()=>setTab("upload")} className={`${selectedTab == "upload" ? "selected" : ""}`}>Upload Podcast</h1>
          <h1 onClick={()=>setTab("stream")} className={`${selectedTab == "stream" ? "selected" : ""}`}>Stream Podcast</h1>
        </div>

        {selectedTab == "upload" &&
        <div className="profile__form">

          <Input value={formData.mp3} type="file" onChange={(value)=>setFormData({...formData, mp3:value})} title="Upload File" description="the file must be mp3 or wav format" id="upload-mp3"/>
          <Input value={formData.title} onChange={(value)=>setFormData({...formData, title:value})} title="Title" description="Set the title of the podcast"/>
          <Input value={formData.description} onChange={(value)=>setFormData({...formData, description:value})} title="Description" description="Set the description of the podcast"/>
          <Input value={formData.category} onChange={(value)=>setFormData({...formData, category:value})} title="Category" description="Set the category of the podcast"/>
          <Input value={formData.episode_cover} type="file" onChange={(value)=>setFormData({...formData, episode_cover:value})} title="Upload File" description="Set the cover photo for this episode" id="upload-episode-cover"/>
          <Button onClick={()=> submitForm() } primary text="Publish"></Button>

        </div>
        }

        {selectedTab == "stream" &&
        <div className="profile__form">
          <Input value={formData.title} onChange={(value)=>setFormData({...formData, title:value})} title="Name" description="Set the title of the podcast"/>
          <Input value={formData.category} onChange={(value)=>setFormData({...formData, category:value})} title="Category" description="Set the category of the podcast"/>
          <Input value={formData.description} onChange={(value)=>setFormData({...formData, description:value})} title="Description" description="Set the description of the podcast"/>
          <Input value={formData.episode_cover} type="file" onChange={(value)=>setFormData({...formData, episode_cover:value})} title="Upload File" description="Set the cover photo for this episode" id="upload-episode-cover"/>

          <Link to={`/stream?room=${formData.title}`}>
            <Button primary onClick={()=>addLiveStream()} text="Start Live Broadcast"></Button>
          </Link>
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

export default connect(mapStateToProps,null)(UploadStream);
