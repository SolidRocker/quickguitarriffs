import React, {Component} from 'react'
import {Platform} from 'react-native'
import {androidConfig} from './common';
import firebase from 'react-native-firebase'

export default class AdsRelated extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appState: null,
            receipt: '',
            bannerID: '',
            interID: '',
            isDebug: false
        };

        this.SetAdID();
        this.state.appState = firebase.initializeApp(androidConfig,"QuickGuitarRiffs");
    };

    SetAdID() {
        if(this.state.isDebug) {
            this.state.bannerID = 'ca-app-pub-3940256099942544/6300978111';
            this.state.interID = 'ca-app-pub-3940256099942544/1033173712';
        }
        else {

            if(Platform.OS === 'ios') {
                this.state.bannerID = 'ca-app-pub-8431641625411729/7723291904';
                this.state.interID = 'ca-app-pub-8431641625411729/9531483001';
            }
            else {
                this.state.bannerID = 'ca-app-pub-8431641625411729/6880274713';
                this.state.interID = 'ca-app-pub-8431641625411729/5602002004';
            }
        }
    }

    DisplayBannerAd(shouldDisplay) {
        let disp = null;

        this.state.appState.onReady().then((app) => {

            if(shouldDisplay) {
                const Banner = firebase.admob.Banner;
                const AdRequest = firebase.admob.AdRequest;
                const request = new AdRequest();
    
                disp = 
                <Banner
                    unitId={this.state.bannerID}
                    size={'SMART_BANNER'}
                    request={request.build()}
                    onAdLoaded={() => {
                    }}
                />
            }
        });
        return disp;
    }

    DisplayInterstitialAd(shouldDisplay) {

        this.state.appState.onReady().then((app) => {
            if(shouldDisplay) {
                const advert = firebase.admob().interstitial(this.state.bannerID);
                const AdRequest = firebase.admob.AdRequest;
                const request = new AdRequest();
                advert.loadAd(request.build());

                advert.on('onAdLoaded', () => {
                    advert.show();
                });
            }
        });
    }
}