import React, { useState, useEffect } from 'react';
import Input from './forms/Input';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { getCurrentProfile, updateProfile } from '../actions/profile';
import PropTypes from 'prop-types';
import { FaCog } from "react-icons/fa";
import Images from './Images';
import toast from 'react-simple-toasts';
import axios from 'axios';

import {Link} from 'react-router-dom';

const Profile = ({getCurrentProfile, updateProfile, auth, profile: {profile,loading}}) => {

  const[formData, setFormData] = useState({
      password: '',
      first_name: '',
      last_name: '',
      profile_id: '',
      profile_picture: null,
      cover_photo: null,
  });

  const[podcasts,setPodcasts] = useState([]);

  const getCatalog = async () => {
    try {
        const res = await axios.get('/api/profile/catalog');
        
        setPodcasts(res.data)

        console.log("podcats",podcasts);
    } catch (e) {

    }
  }

  const deletePodcast = async (id) => {
    try {
        // const res = await axios.get('/api/profile/catalog');
        
        console.log(id, podcasts);
        console.log(podcasts.filter((elem) => elem.podcast_id !== id));
        setPodcasts(prev => prev.filter((elem) => elem.podcast_id !== id))

        console.log("podcats",podcasts);
    } catch (e) {

    }
  }
  useEffect(()=>{
    getCurrentProfile();
    getCatalog();
    if(profile){
      setFormData({
        first_name: loading || !profile.first_name ? "" : profile.first_name,
        last_name: loading || !profile.last_name ? "" : profile.last_name,
        profile_id: loading || !profile.profile_id ? "" : profile.profile_id,
        profile_picture: loading || !profile.profile_picture ? "" : profile.profile_picture,
        cover_photo: loading || !profile.cover_photo ? "" : profile.cover_photo,
      });
    }

  }, [loading]);

  const submitForm = () => {
    updateProfile({first_name: formData.first_name, last_name:formData.last_name, profile_picture:formData.profile_picture, cover_photo: formData.cover_photo });
    toast('Profile updated!');
  };

  return (
    <div className="profile_page profile_page__container">
      <div className="profile_page__content">
        <h2>Account Settings</h2>

        <div className="profile__form" style={{marginBottom: "40px"}}>
        <div style={{}}>
          {/* <Input value={formData.password} onChange={(value)=>setFormData({...formData, password:value})} title="Password" description="Change your password"/> */}

          <Input value={formData.first_name} onChange={(value)=>setFormData({...formData, first_name:value})} title="First Name" description="Change your first name"/>

          <Input value={formData.last_name} onChange={(value)=>setFormData({...formData, last_name:value})} title="Last Name" description="Change your last name"/>

          <Input value={formData.profile_picture} type="file" onChange={(value)=>{
            setFormData({...formData, profile_picture:value});
          }} title="Upload File" description="Set the profile photo for your account" id="upload-profile-picture"/>

          <Input value={formData.cover_photo} type="file" onChange={(value)=>{
            setFormData({...formData, cover_photo:value});
          }} title="Upload File" description="Set the cover photo of your account" id="upload-cover-photo"/>

          <Button onClick={()=> submitForm() } primary text="Update Profile"></Button>
        </div>
        <img className="stream_image" src={Images.settings} alt=""/>

        </div>

        {podcasts.length > 0 && <h2>Uploaded Podcasts</h2>}

        <div>

          {podcasts.map((podcast) => {
            return(
              <div className="profile_catalog_episode_wrapper">
                <img className="navbar_episode_cover" src={`/uploads/images/${podcast.episode_cover}`} alt=""/>
                <div style={{flex: "0 0 500px", padding: "0px 20px"}}>
                  <div className="media_podcast_info_title" >{podcast.title}</div>
                  <div className="media_podcast_info_user">{podcast.description}</div>
                </div>
                <Button onClick={()=> deletePodcast(podcast.podcast_id) } style={{height: 'auto'}} primary text="Delete"></Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, updateProfile})(Profile);
