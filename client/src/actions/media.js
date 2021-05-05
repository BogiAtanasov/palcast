import { MEDIA_UPDATE } from './types';

export const update_media = (file) => dispatch => {
  dispatch({
    type: MEDIA_UPDATE,
    payload: {file}
  });
}
