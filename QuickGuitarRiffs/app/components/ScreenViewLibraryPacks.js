import React, { Component } from 'react';
import { AppRegistry, BackHandler, ImageBackground, Dimensions, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import { Content, Header, Left, Right, Body, Container, Button, Icon, Text } from 'native-base';
import { setPack1, setPack2, setPack3, setHasAds, setSongs, setProducts } from '../redux/songlistActions';
import commons, {styles} from './common';
import { connect } from 'react-redux';
import * as RNIap from 'react-native-iap';
import GestureRecognizer from 'react-native-swipe-gestures';
import AsyncStorage from '@react-native-async-storage/async-storage';

const itemSkus = Platform.select({
    ios: [
      'com.hugewall.quickguitarriffs.unlockall',
    ],
    android: [
      'com.hugewall.quickguitarriffs.unlockall',    // Pack 1
      'com.hugewall.quickguitarriffs.pack2',        // Pack 2
      'com.hugewall.quickguitarriffs.pack3',        // Pack 3
    ],
});

class ScreenViewLibraryPacks extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            checkingProducts: false,
            isLoaded: false,
            isRefreshing: false,
            isPortrait: commons.IsPortrait()
        }

        Dimensions.addEventListener('change', () => {
            this.setState({isPortrait: commons.IsPortrait()});
        });
      }

    componentDidMount() {
        RNIap.initConnection();
        BackHandler.addEventListener('hardwareBackPress', this.BackToMainMenu);

        if(!this.props.productsLoaded) {
            this.IAP_Init();
            this.IAP_RestorePurchases();
            this.state.checkingProducts = true;
        }
        else {
            this.state.isLoaded = true;
        }
        return true;
    }

    componentWillUnmount() {
        this.IAP_EndConnection();
        BackHandler.removeEventListener('hardwareBackPress', this.BackToMainMenu);
        return true;
    }

    async IAP_Init() {
        
        try {
            const products = await RNIap.getProducts(itemSkus);
            //console.log('Products', products);
            this.props.setProducts(products);
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }
      }
    
      async IAP_RestorePurchases() {

        try {
            const purchases = await RNIap.getAvailablePurchases();

            if(purchases) {
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

                    if (purchase.productId === 'com.hugewall.quickguitarriffs.pack3') {
                        this.state.rPack3 = 1;
                        this.props.setPack3(true);
                        AsyncStorage.setItem('bPack3', "1");
                    }
                });

                if(this.state.rPack1 == 0 && this.state.rPack2 == 0 & this.state.rPack3 == 0) {
                    this.props.setHasAds(true);
                }
                else {
                    this.props.setHasAds(false);
                }
                this.forceUpdate();
            }
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
            //Alert.alert(err.message);
        }
    }
    
    IAP_EndConnection() {
        RNIap.endConnectionAndroid();
    }

    BackToMainMenu = () => {
        this.props.navigation.navigate('ScreenMainMenu');
        return true;
    }

    GoToLib = (pack, type) => {
        this.props.navigation.navigate('ScreenViewLibrary', {rPackID: pack, rRiffType: type});
        return true;
    }

    SetCost(productID, hasBought) {

        var disp = null;

        this.props.products.forEach(prod => {

            if(prod.productId === productID) {

                if(hasBought) {
                    disp = <Text allowFontScaling={false} style={styles.packButtonCost_Bought}>PURCHASED!</Text>
                }
                else {
                    disp = <Text allowFontScaling={false} style={styles.packButtonCost_NotBought}>{prod.localizedPrice}</Text>
                }
            }
        }); 
        return disp;  
    }

    GetHeader() {    
        let headerText = "Click on any pack to check out more riffs to jam to!";
        if(this.state.isPortrait) {
        return <View>
                <Text style={styles.subMenuHeader}>{headerText}</Text>
               </View>
        }
        return <View>
                <Text style={styles.subMenuHeaderLandscape}>{headerText}</Text>
               </View>
      }

    RenderProductInfo() {
        disp = null;

        if(this.props.products.length == 0) {
            disp =
                <Container style={styles.packMainContainer}>
                    <Text allowFontScaling={false} style={styles.packError}>Couldn't load packs. Swipe down to refresh the library!</Text>
                </Container>
            return disp;
        }

        disp =
        <Content style={styles.packContainer}>
            <ScrollView>
                <TouchableOpacity
                    style={styles.packButton} 
                    activeOpacity={0.8}
                    onPress={()=>this.GoToLib(1, 1)}>
                        <View style={styles.packButtonContainer}>
                            <Text style={styles.packButtonTitle}>THE ESSENTIAL PACK</Text>
                            <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 130 Guitar Songs</Text>
                            {this.SetCost('com.hugewall.quickguitarriffs.unlockall', this.props.pack1)}
                        </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.packButton} 
                    activeOpacity={0.8}
                    onPress={()=>this.GoToLib(2, 1)}>
                        <View style={styles.packButtonContainer}>
                            <Text style={styles.packButtonTitle}>THE EXTENDED PACK</Text>
                            <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 60 Guitar Songs</Text>
                            {this.SetCost('com.hugewall.quickguitarriffs.pack2', this.props.pack2)}
                        </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.packButton} 
                activeOpacity={0.8}
                onPress={()=>this.GoToLib(3, 2)}>
                    <View style={styles.packButtonContainer}>
                        <Text style={styles.packButtonTitle}>THE BASS GROOVE PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 110 BASS Songs</Text>
                        {this.SetCost('com.hugewall.quickguitarriffs.pack3', this.props.pack3)}
                    </View>
            </TouchableOpacity>
            </ScrollView>
        </Content>

        return disp;
    }

    async onSwipeLeft(gestureState) {
        this.setState({isRefreshing: true});

        await this.IAP_Init();
        await this.IAP_RestorePurchases();
        this.setState({
            isRefreshing: false
        });
    }

    ShowSpinner() {
        let disp = null;
    
        if(this.state.isRefreshing) {
            disp =  <View style={{marginTop:"10%"}}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
        }
        return disp;
    }

    render() {

        if(!this.state.isLoaded)
        {
            this.state.isLoaded = true;
            let disp = 
                <View style={{paddingTop:20}}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text style={{alignSelf:'center', paddingTop:4}}>Loading...</Text>
                </View>

                setTimeout(() => {
                    this.forceUpdate();
                }, 100);

                return disp;
        }
        return (
            <Container>
               <Header style={styles.menuHeaderBG}>
                    {commons.ChangeStatusBar()}
                    <Left>
                        <Button transparent title="back">
                        <TouchableOpacity onPress={() => this.BackToMainMenu()}>
                            <Icon name='arrow-back' style={styles.mainMenuIcon}/>
                        </TouchableOpacity>
                        </Button>
                    </Left>
                    <Body>
                        <Text allowFontScaling={false} style={styles.subMenuTitleHeader}>View Library</Text>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Content style={styles.subMenuContainer}>
                    <GestureRecognizer
                        onSwipeDown={(state) => this.onSwipeLeft(state)}
                    >
                        {this.ShowSpinner()}
                        {this.GetHeader()}
                        {this.RenderProductInfo()}
                    </GestureRecognizer>
                </Content>
                
            </Container>
        );
    }
};

const mapStateToProps = state => ({
    products: state.songlist.products,
    productsLoaded: state.songlist.products_loaded,
    pack1: state.songlist.pack1,
    pack2: state.songlist.pack2,
    pack3: state.songlist.pack3,
  });
  
export default connect(mapStateToProps, {setPack1, setPack2, setPack3, setHasAds, setSongs, setProducts})(ScreenViewLibraryPacks);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenViewLibraryPacks);