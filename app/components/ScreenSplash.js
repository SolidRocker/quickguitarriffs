import React, {Component} from 'react';
import {AppRegistry, Platform, AsyncStorage, Image, View} from 'react-native';
import commons, {styles} from './common';
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
    ios: [
      'com.hugewall.quickguitarriffs.unlockall',
    ],
    android: [
      'com.hugewall.quickguitarriffs.unlockall',
    ],
});

export default class ScreenSplash extends Component{

    constructor(props) {
        super(props);
        this.state = {
            hasUnlocked: false,
            loadPurc:"0",
        }
    }

    async LoadLocalPurchase() {

        try {
            this.state.loadPurc = await AsyncStorage.getItem('localPurc');
        }
        catch(error) {
        }

        if(this.state.loadPurc == null) {
            this.state.loadPurc = "0";
            AsyncStorage.setItem('localPurc', this.state.loadPurc);
        }
    }

    async IAP_Init() {
        
        try {
            const products = await RNIap.getProducts(itemSkus);
            console.log('Products', products);
            this.setState({ productList: products });
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }
    }
    
    async IAP_RestorePurchases() {

        try {
            const purchases = await RNIap.getAvailablePurchases();
            purchases.forEach(purchase => {
                if (purchase.productId === 'com.hugewall.quickguitarriffs.unlockall') {
                    this.state.hasUnlocked = true;
                    this.state.loadPurc = "1";
                    AsyncStorage.setItem('localPurc', this.state.loadPurc);
                    this.props.navigation.navigate('ScreenMainMenu', {rAppUnlocked : 1});
                }
                else {
                    this.state.hasUnlocked = false;
                    this.state.loadPurc = "0";
                    AsyncStorage.setItem('localPurc', this.state.loadPurc);
                    this.props.navigation.navigate('ScreenMainMenu', {rAppUnlocked : 0});
                }
            })
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
            //Alert.alert(err.message);
        }
    }
    
    IAP_EndConnection() {
        RNIap.endConnection();
    }

    // ================================ IAP STUFF ENDS =================================

    componentDidMount() {

        this.IAP_Init();
        this.IAP_RestorePurchases();
        this.LoadLocalPurchase();

        setTimeout(() => {
            var getPurc = this.state.loadPurc == "1" ? 1 : 0;
            this.props.navigation.navigate('ScreenMainMenu', {rAppUnlocked : getPurc});
        }, 3500);
    }

    componentWillUnmount() {
        this.IAP_EndConnection();
    }

    render() {
        return(
            <View style={{backgroundColor:'#cca25a'}}>
                {commons.ChangeStatusBar()}
                <Image source={require('../img/SplashBig.jpg')} style={styles.splash} />
            </View>
        );
    }
};

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenSplash);