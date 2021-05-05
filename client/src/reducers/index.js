import{ combineReducers } from 'redux';
import alert from './alert'
import auth from './auth'
import profile from './profile'
import media from './media'
export default combineReducers({
  alert, auth, profile, media
});
