import { SET_PACK_1, SET_PACK_2, SET_SONGS, SET_CHOSE_LIST } from './types';
import { AllSongs } from '../data/T_DATA';

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

export const setSongs = (pack1, pack2) => dispatch => {

    console.log("Loading Songs");
    var sBeg = [];
    var sInt = [];
    var sAdv = [];
    var sAll = [];

    for(var i = 0; i < AllSongs.length; ++i) {
        if( AllSongs[i].Pack == 0 ||
            (AllSongs[i].Pack == 1 && pack1) ||
            (AllSongs[i].Pack == 2 && pack2) ) {

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
