import axios from 'axios';
import {setAlert} from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';

export const register = ({email, password, firstName, lastName}) => async dispatch => {
  const config = {
    headers:{
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({email, password, firstName, lastName});

  try {
    const res = await axios.post('/api/users',body,config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());

  } catch (e) {

    const error = e.response.data.error;
    dispatch(
      setAlert(error.msg, 'danger')
    );

    dispatch({
      type: REGISTER_FAIL,
    })
  }
}

export const login = ({email, password}) => async dispatch => {
  const config = {
    headers:{
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({email, password});

  try {
    const res = await axios.post('/api/auth',body,config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });


    dispatch(loadUser());
  } catch (e) {

    const error = e.response.data.error;
    dispatch(
      setAlert(error.msg, 'danger')
    );

    dispatch({
      type: LOGIN_FAIL,
    })
  }
}

export const loadUser = () => async dispatch => {
  if(localStorage.token){
    setAuthToken(localStorage.token);
  }

  try {

  const res = await axios.get('/api/auth');

  dispatch({
    type: USER_LOADED,
    payload: res.data
  });

  } catch (e) {

  dispatch({
    type: AUTH_FAIL
  });

  }

}

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
}
