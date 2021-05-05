import { MEDIA_UPDATE } from '../actions/types';

const initialState = {
  loading: true,
  file: null
}


export default function(state = initialState, action){

  const {type, payload} = action;

  switch (type) {
    case MEDIA_UPDATE:
      return {...state, ...payload, loading: false};
    default:
      return state;

  }
}
