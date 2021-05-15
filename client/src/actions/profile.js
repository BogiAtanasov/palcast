import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from './types';

export const getCurrentProfile = () => async dispatch => {
  try {
      const res = await axios.get('/api/profile/me');

      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })

  } catch (e) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: e.response.statusText, status: e.response.status }
      })
  }
}

export const updateProfile = ({first_name, last_name, profile_picture}) => async dispatch => {

  let info = JSON.stringify({
    first_name: first_name,
    last_name: last_name,
  })
  const body = new FormData();
  body.append("payload", info);
  body.append("uploadFiles", profile_picture);

  const config = {
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  }
  
  try {

      const res = await axios.post('/api/profile', body, config);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      })

  } catch (e) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {msg: e.response.statusText, status: e.response.status }
      })
  }
}
