import React, {Component} from 'react'
import {Platform} from 'react-native'
import firebase from 'react-native-firebase'

export default class AdsRelated extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receipt: '',
            bannerID: '',
            interID: '',
            isDebug: false
        };
        this.SetAdID();
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
        return disp;
    }

    DisplayInterstitialAd(shouldDisplay) {

        if(shouldDisplay) {
            const advert = firebase.admob().interstitial(this.state.interID);
            const AdRequest = firebase.admob.AdRequest;
            const request = new AdRequest();

            advert.loadAd(request.build());

            advert.on('onAdLoaded', () => {
                advert.show();
                console.log('Show inter');
            });
        }
    }
}