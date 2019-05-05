import { combineReducers } from 'redux';
import songlistReducer from './songlistReducer';

export default combineReducers({
    songlist: songlistReducer,
})