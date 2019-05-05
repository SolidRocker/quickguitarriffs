import {
    SET_SONGS,
    SET_PACK_1,
    SET_PACK_2,
    SET_CHOSE_LIST
 } from './types';
    
const songlist = {
    songs: [],
    pack1: false,
    pack2: false,

    checked_pack1: false,
    checked_pack2: false,
    songs_loaded: false,
    choselist: null
}

export default function(state = songlist, action) {
    switch(action.type) {
        case SET_SONGS:
            return {
                ...state,
                songs: action.payload,
                songs_loaded: true
            }
        case SET_PACK_1:
            return {
                ...state,
                pack1: action.payload,
                checked_pack1: true
            }
        case SET_PACK_2:
            return {
                ...state,
                pack2: action.payload,
                checked_pack2: true
            }
        case SET_CHOSE_LIST:
        return {
            ...state,
            choselist: action.payload
        }
        default:
            return state;
    }
}
