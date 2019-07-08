import React, { Component } from 'react';
import { AppRegistry, BackHandler, ImageBackground, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Header, Left, Right, Body, Container, Button, Icon, Text } from 'native-base';
import commons, {styles} from './common';
import { connect } from 'react-redux';
import * as RNIap from 'react-native-iap';

class ScreenViewLibraryPacks extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            checkingProducts: false
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
              })
          } catch(err) {
              console.warn(err); // standardized err.code and err.message available
              //Alert.alert(err.message);
          }
          this.forceUpdate();
      }
    
    IAP_EndConnection() {
        RNIap.endConnection();
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

    RenderProductInfo() {
        disp = null;

        if(this.props.products.length == 0) {
            disp =
                <Container>
                        <Text allowFontScaling={false} style={styles.packError}>Couldn't load packs. Please check your internet connection and try again!</Text>
                </Container>
            return disp;
        }

        disp =
        <Container>
            <TouchableOpacity
                style={styles.packButton} 
                activeOpacity={0.8}
                onPress={()=>this.GoToLib(1)}>
                    <ImageBackground source={require('../img/PackEssential.jpg')} style={styles.packButtonBG}>
                        <Text style={styles.packButtonTitle}>THE ESSENTIAL PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 130 Songs</Text>
                        {this.SetCost('com.hugewall.quickguitarriffs.unlockall', this.props.pack1)}
                    </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.packButton} 
                activeOpacity={0.8}
                onPress={()=>this.GoToLib(2)}>
                    <ImageBackground source={require('../img/PackExtended.jpg')} style={styles.packButtonBG}>
                        <Text style={styles.packButtonTitle}>THE EXTENDED PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 60 Songs</Text>
                        {this.SetCost('com.hugewall.quickguitarriffs.pack2', this.props.pack2)}
                    </ImageBackground>
              </TouchableOpacity>
        </Container>

        return disp;
    }

    render() {

        if(!this.props.productsLoaded)
        {
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

                {this.RenderProductInfo()}
            </Container>
        );
    }
};

const mapStateToProps = state => ({
    products: state.songlist.products,
    productsLoaded: state.songlist.products_loaded,
    pack1: state.songlist.pack1,
    pack2: state.songlist.pack2,
  });
  
export default connect(mapStateToProps, {})(ScreenViewLibraryPacks);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenViewLibraryPacks);