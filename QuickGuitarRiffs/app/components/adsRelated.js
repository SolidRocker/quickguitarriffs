import React, {Component} from 'react'
import { InterstitialAd, BannerAd, TestIds, AdEventType } from '@react-native-firebase/admob';

var isDebug = false;
var bannerID = isDebug ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-8431641625411729/6880274713';
var interID = isDebug ? 'ca-app-pub-3940256099942544/1033173712' : 'ca-app-pub-8431641625411729/5602002004';

export function DisplayBannerAd (shouldDisplay) {
    let disp = null;
    //console.log("SD: " + shouldDisplay);

    if(shouldDisplay) {
        disp =
        <BannerAd
            unitId={bannerID}
            size={'SMART_BANNER'}
        />
    }
    return disp;
}

const interstitialAd = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

export function DisplayInterstitialAd(shouldDisplay) {

    if(shouldDisplay) {

        interstitialAd.load();

        interstitialAd.onAdEvent((type, error) => {
            if (type === AdEventType.LOADED) {
                interstitialAd.show();
            }
        });
    }
}