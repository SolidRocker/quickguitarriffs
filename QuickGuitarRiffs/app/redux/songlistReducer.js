import {
    SET_SONGS,
    SET_PACK_1,
    SET_PACK_2,
    SET_PACK_3,
    SET_CHOSE_LIST,
    SET_FIREBASE,
    SET_PRODUCTS,
    SET_QUOTES
 } from './types';
    
const songlist = {
    songs: [],
    pack1: false,
    pack2: false,
    pack3: false,

    checked_pack1: false,
    checked_pack2: false,
    checked_pack3: false,
    songs_loaded: false,
    choselist: null,

    isfbInit: false,
    is_first_use: false,

    products: [],
    products_loaded: false,

    quotes: []
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
        case SET_PACK_3:
            return {
                ...state,
                pack3: action.payload,
                checked_pack3: true
            }
        case SET_CHOSE_LIST:
        return {
            ...state,
            choselist: action.payload
        }
        case SET_FIREBASE:
        return {
            ...state,
            isfbInit: action.payload_bool
        }
        case SET_PRODUCTS:
        return {
            ...state,
            products: action.payload,
            products_loaded: action.payload_bool
        }
        case SET_QUOTES:
        return {
            ...state,
            quotes: action.payload,
        }
        default:
            return state;
    }
}
