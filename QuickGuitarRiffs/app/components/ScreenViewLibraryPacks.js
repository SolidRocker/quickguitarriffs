import React, { Component } from 'react';
import { AppRegistry, BackHandler, ImageBackground, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import { Content, Header, Left, Right, Body, Container, Button, Icon, Text } from 'native-base';
import { setPack1, setPack2, setPack3, setSongs, setProducts } from '../redux/songlistActions';
import commons, {styles} from './common';
import { connect } from 'react-redux';
import * as RNIap from 'react-native-iap';

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
            isLoaded: false
        };
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
            console.log('Products', products);
            this.props.setProducts(products);
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }
      }
    
      async IAP_RestorePurchases(showAlert = false) {
    
          try {
              const purchases = await RNIap.getAvailablePurchases();
              purchases.forEach(purchase => {
                if (purchase.productId === 'com.hugewall.quickguitarriffs.unlockall') {
                    this.props.setPack1(true);
                    this.forceUpdate();
                }
                else {
                    this.props.setPack1(false);
                    this.forceUpdate();
                }
                if (purchase.productId === 'com.hugewall.quickguitarriffs.pack2') {
                    this.props.setPack2(true);
                    this.forceUpdate();
                }
                else {
                    this.props.setPack2(false);
                    this.forceUpdate();
                }
                if (purchase.productId === 'com.hugewall.quickguitarriffs.pack3') {
                    this.props.setPack3(true);
                    this.forceUpdate();
                }
                else {
                    this.props.setPack3(false);
                    this.forceUpdate();
                }
              })
          } catch(err) {
              console.warn(err); // standardized err.code and err.message available
              //Alert.alert(err.message);
          }
          this.forceUpdate();
      }
    
    IAP_EndConnection() {
        RNIap.endConnectionAndroid();
    }

    BackToMainMenu = () => {
        this.props.navigation.navigate('ScreenMainMenu');
        return true;
    }

    GoToLib = (pack) => {
        this.props.navigation.navigate('ScreenViewLibrary', {rPackID : pack});
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
        let disp =
        <View>
          <Text style={styles.subMenuHeader}>Click on any pack to check out more riffs to jam to!</Text>
        </View>
        return disp;
      }

    RenderProductInfo() {
        disp = null;

        if(this.props.products.length == 0) {
            disp =
                <Container style={styles.packMainContainer}>
                    <Text allowFontScaling={false} style={styles.packError}>Couldn't load packs. Please check your internet connection and try again!</Text>
                </Container>
            return disp;
        }

        disp =
        <Content style={styles.packContainer}>
            <ScrollView>
                <TouchableOpacity
                    style={styles.packButton} 
                    activeOpacity={0.8}
                    onPress={()=>this.GoToLib(1)}>
                        <View style={styles.packButtonContainer}>
                            <Text style={styles.packButtonTitle}>THE ESSENTIAL PACK</Text>
                            <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 130 Guitar Songs</Text>
                            {this.SetCost('com.hugewall.quickguitarriffs.unlockall', this.props.pack1)}
                        </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.packButton} 
                    activeOpacity={0.8}
                    onPress={()=>this.GoToLib(2)}>
                        <View style={styles.packButtonContainer}>
                            <Text style={styles.packButtonTitle}>THE EXTENDED PACK</Text>
                            <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 60 Guitar Songs</Text>
                            {this.SetCost('com.hugewall.quickguitarriffs.pack2', this.props.pack2)}
                        </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.packButton} 
                activeOpacity={0.8}
                onPress={()=>this.GoToLib(3)}>
                    <View style={styles.packButtonContainer}>
                        <Text style={styles.packButtonTitle}>THE BASS GROOVE PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 110 BASS Songs</Text>
                        {this.SetCost('com.hugewall.quickguitarriffs.pack3', this.props.pack3)}
                    </View>
            </TouchableOpacity>
            </ScrollView>
        </Content>

        /*disp =
        <Content>
        <ScrollView>
            <TouchableOpacity
                style={styles.packButton} 
                activeOpacity={0.8}
                onPress={()=>this.GoToLib(1)}>
                    <ImageBackground source={require('../img/PackEssential.jpg')} style={styles.packButtonBG}>
                        <Text style={styles.packButtonTitle}>THE ESSENTIAL PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 130 Guitar Songs</Text>
                        {this.SetCost('com.hugewall.quickguitarriffs.unlockall', this.props.pack1)}
                    </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.packButton}
                activeOpacity={0.8}
                onPress={()=>this.GoToLib(2)}>
                    <ImageBackground source={require('../img/PackExtended.jpg')} style={styles.packButtonBG}>
                        <Text style={styles.packButtonTitle}>THE EXTENDED PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 60 Guitar Songs</Text>
                        {this.SetCost('com.hugewall.quickguitarriffs.pack2', this.props.pack2)}
                    </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.packButton} 
                activeOpacity={0.8}
                onPress={()=>this.GoToLib(3)}>
                    <ImageBackground source={require('../img/PackEssential.jpg')} style={styles.packButtonBG}>
                        <Text style={styles.packButtonTitle}>THE BASS GROOVE PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 110 BASS Songs</Text>
                        {this.SetCost('com.hugewall.quickguitarriffs.pack3', this.props.pack3)}
                    </ImageBackground>
            </TouchableOpacity>
        </ScrollView>
        </Content>*/

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
               <Header style={styles.riffHeaderBG}>
                    {commons.ChangeStatusBar()}
                    <Left>
                        <Button transparent title="back">
                        <TouchableOpacity onPress={() => this.BackToMainMenu()}>
                            <Icon name='arrow-back' style={styles.riffIcon}/>
                        </TouchableOpacity>
                        </Button>
                    </Left>
                    <Body>
                        <Text allowFontScaling={false} style={styles.riffHeader}>View Library</Text>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Content style={styles.subMenuContainer}>
                    {this.GetHeader()}
                    {this.RenderProductInfo()}
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
  
export default connect(mapStateToProps, {setPack1, setPack2, setPack3, setSongs, setProducts})(ScreenViewLibraryPacks);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenViewLibraryPacks);