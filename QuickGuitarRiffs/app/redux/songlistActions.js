import { SET_PACK_1, SET_PACK_2, SET_PACK_3, SET_HAS_ADS, SET_SONGS, SET_CHOSE_LIST, SET_FIREBASE, SET_PRODUCTS, SET_QUOTES } from './types';
import { AllSongs, AllQuotes } from '../data/T_DATA';
import firebase from '@react-native-firebase/app';

export const setPack1 = (hasBought) => dispatch => {
    dispatch({
        type: SET_PACK_1,
        payload: hasBought
    })
}

export const setPack2 = (hasBought) => dispatch => {
    dispatch({
        type: SET_PACK_2,
        payload: hasBought
    })
}

export const setPack3 = (hasBought) => dispatch => {
    dispatch({
        type: SET_PACK_3,
        payload: hasBought
    })
}

export const setHasAds = (hasAds) => dispatch => {
    dispatch({
        type: SET_HAS_ADS,
        payload: hasAds
    })
}

export const setSongs = (pack1, pack2, pack3) => dispatch => {

    console.log("Loading Songs");
    var sBeg = [];
    var sInt = [];
    var sAdv = [];
    var sAll = [];

    for(var i = 0; i < AllSongs.length; ++i) {
        if( AllSongs[i].Pack == 0 ||
            (AllSongs[i].Pack == 1 && pack1) ||
            (AllSongs[i].Pack == 2 && pack2) ||
            (AllSongs[i].Pack == 3 && pack3)) {

                sAll.push(AllSongs[i]);
                if(AllSongs[i].Diff == 1) {
                    sBeg.push(AllSongs[i]);
                }
                else if(AllSongs[i].Diff == 2) {
                    sInt.push(AllSongs[i]);
                }
                else if(AllSongs[i].Diff == 3) {
                    sAdv.push(AllSongs[i]);
                }
            }
    }

    var sMain = [];
    sMain.push(sBeg);
    sMain.push(sInt);
    sMain.push(sAdv);
    sMain.push(sAll);

    dispatch({
        type: SET_SONGS,
        payload: sMain
    })
}

export const setChooseList = (list) => dispatch => {
    dispatch({
        type: SET_CHOSE_LIST,
        payload: list
    })
}

const androidConfig = {
    clientId: "459661689591-4472u0sv0nigbac33n5d3kfae6urm4t4.apps.googleusercontent.com",
    appId: "1:459661689591:android:ff5dc3ad3841ec1b",
    apiKey: "AIzaSyCE_Q_joJlBfybpfk7dSzSjmVtgusuF8EU",
    databaseURL: "https://quickguitarriffs-9febc.firebaseio.com",
    storageBucket: "quickguitarriffs-9febc.appspot.com",
    messagingSenderId: "459661689591",
    projectId: "quickguitarriffs-9febc",

    // enable persistence by adding the below flag
    persistence: true,
};

export const initFirebase = () => dispatch => {

    var FBState = firebase.initializeApp(androidConfig,"QuickGuitarRiffs");
    dispatch({
        type: SET_FIREBASE,
        payload_bool: true
    });
}

export const setProducts = (products) => dispatch => {

    let prodlist = [];
    let prodlist_bool = false;

    for(var i = 0; i < products.length; ++i) {

        let newProd = {
            productId: products[i].productId,
            title: products[i].title,
            description: products[i].description,
            price: products[i].price,
            localizedPrice: products[i].localizedPrice
        }
        prodlist.push(newProd);
        prodlist_bool = true;
    }

    dispatch({
        type: SET_PRODUCTS,
        payload: prodlist,
        payload_bool: prodlist_bool
    });
}

export const setQuotes = () => dispatch => {

    let quoteList = [];

    for(var i = 0; i < AllQuotes.length; ++i) {

        let newQuote = {
            quote: AllQuotes[i].quote,
            artist: AllQuotes[i].artist
        }
        quoteList.push(newQuote);
    }

    dispatch({
        type: SET_QUOTES,
        payload: quoteList,
    });
}
