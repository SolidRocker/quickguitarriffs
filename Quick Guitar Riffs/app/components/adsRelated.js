import React, {Component} from 'react';
import {Platform} from 'react-native';
import {AdMobBanner, AdMobInterstitial} from 'react-native-admob';

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
            disp = 
            <AdMobBanner
                adSize={Platform.OS === 'ios' ? 'smartBannerPortrait' : 'smartBanner'}
                adUnitID={this.state.bannerID}
                testDevices={[AdMobBanner.simulatorId]}
                onAdFailedToLoad={error => console.error(error)}
            />
        }
        return disp;
    }

    DisplayInterstitialAd(shouldDisplay) {

        if(shouldDisplay) {
            AdMobInterstitial.setAdUnitID(this.state.interID);
            AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
            AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
        }
    }
}