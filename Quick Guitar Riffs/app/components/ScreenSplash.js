import React, {Component} from 'react';
import {AppRegistry, Platform, AsyncStorage, Image, View} from 'react-native';
import commons, {styles} from './common';
import * as RNIap from 'react-native-iap';
import { setPack1, setPack2 } from '../redux/songlistActions';
import { connect } from 'react-redux';

const itemSkus = Platform.select({
    ios: [
      'com.hugewall.quickguitarriffs.unlockall',
    ],
    android: [
      'com.hugewall.quickguitarriffs.unlockall',    // Pack 1
      'com.hugewall.quickguitarriffs.pack2',        // Pack 2
    ],
});

class ScreenSplash extends Component{

    constructor(props) {
        super(props);
        this.state = {
            rPack1: 0,
            rPack2: 0,
            
            tmpCheck1: "0",
            tmpCheck2: "0"
        }
    }

    async LoadLocalPurchase() {

        try {
            this.state.tmpCheck1 = await AsyncStorage.getItem('bPack1');
        }
        catch(error) {
        }

        try {
            this.state.tmpCheck2 = await AsyncStorage.getItem('bPack2');
        }
        catch(error) {
        }

        if(this.state.tmpCheck1 == null) {
            this.state.rPack1 = 0;
            AsyncStorage.setItem('bPack1', "0");
        }

        if(this.state.tmpCheck2 == null) {
            this.state.rPack2 = 0;
            AsyncStorage.setItem('bPack2', "0");
        }
    }

    async IAP_Init() {
        
        try {
            const products = await RNIap.getProducts(itemSkus);
            console.log('Products', products);
            //this.setState({ productList: products });
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }
    }
    
    async IAP_RestorePurchases() {

        try {
            const purchases = await RNIap.getAvailablePurchases();
            purchases.forEach(purchase => {

                if (purchase.productId === 'com.hugewall.quickguitarriffs.unlockall') {
                    this.state.rPack1 = 1;
                    this.props.setPack1(true);
                    AsyncStorage.setItem('bPack1', "1");
                }

                if (purchase.productId === 'com.hugewall.quickguitarriffs.pack2') {
                    this.state.rPack2 = 1;
                    this.props.setPack2(true);
                    AsyncStorage.setItem('bPack2', "1");
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
        this.LoadLocalPurchase();

        // If everything is already marked as purchased in local, then no need to restore purchases.
        if(this.state.rPack1 != 1 || this.state.rPack2 != 1)
        {
            console.log("RESTORING PURCHASES");
            this.IAP_RestorePurchases();
        }

        setTimeout(() => {
            this.props.setPack1(this.state.rPack1);
            this.props.setPack2(this.state.rPack2);
            this.props.navigation.navigate('ScreenMainMenu');
        }, 3000);

        // Debug
        /* setTimeout(() => {
            this.props.setPack1(false);
            this.props.setPack2(true);
            this.props.navigation.navigate('ScreenMainMenu');
        }, 1000);*/

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

const mapStateToProps = state => ({
    checked_pack1: state.songlist.checked_pack1,
    checked_pack2: state.songlist.checked_pack2
});

export default connect(mapStateToProps, {setPack1, setPack2})(ScreenSplash);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenSplash);