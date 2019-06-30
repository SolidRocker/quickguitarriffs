import React, { Component } from 'react';
import { AppRegistry, BackHandler, ImageBackground, TouchableOpacity, View } from 'react-native';
import { Header, Left, Right, Body, Container, Button, Icon, Text } from 'native-base';
import commons, {styles} from './common';
import { connect } from 'react-redux';
import * as RNIap from 'react-native-iap';

class ScreenViewLibraryPacks extends Component {

    componentDidMount() {
        RNIap.initConnection();
        BackHandler.addEventListener('hardwareBackPress', this.BackToMainMenu);
        return true;
    }

    componentWillUnmount() {
        this.IAP_EndConnection();
        BackHandler.removeEventListener('hardwareBackPress', this.BackToMainMenu);
        return true;
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

    RenderProductInfo() {
        disp = null;

        if(this.props.products.length == 0) {
            disp =
                <Container>
                        <Text allowFontScaling={false} style={styles.packError}>Couldn't load packs. Please check your internet connection and try again!</Text>
                </Container>
            return disp;
        }

        var pCost1 = "";
        var pCost2 = "";

        this.props.products.forEach(prod => {

            if(prod.productId === 'com.hugewall.quickguitarriffs.unlockall') {
                pCost1 = prod.localizedPrice;
            }
            else if(prod.productId === 'com.hugewall.quickguitarriffs.pack2') {
                pCost2 = prod.localizedPrice;
            }
        });

        disp =
        <Container>
            <View style={styles.packDescView}>
                <Text style={styles.packDescText}>Click on a pack to view the details of its song library!</Text>
            </View>
            
            <TouchableOpacity
                style={styles.packButton} 
                activeOpacity={0.8}
                onPress={()=>this.GoToLib(1)}>
                    <ImageBackground source={require('../img/PackEssential.jpg')} style={styles.packButtonBG}>
                        <Text style={styles.packButtonTitle}>THE ESSENTIAL PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 130 Songs</Text>
                        <Text allowFontScaling={false} style={styles.packButtonCost}>{pCost1}</Text>
                    </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.packButton} 
                activeOpacity={0.8}
                onPress={()=>this.GoToLib(2)}>
                    <ImageBackground source={require('../img/PackExtended.jpg')} style={styles.packButtonBG}>
                        <Text style={styles.packButtonTitle}>THE EXTENDED PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>Remove Ads + 60 Songs</Text>
                        <Text allowFontScaling={false} style={styles.packButtonCost}>{pCost2}</Text>
                    </ImageBackground>
              </TouchableOpacity>
        </Container>

        return disp;
    }

    render() {
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
    products: state.songlist.products
  });
  
export default connect(mapStateToProps, {})(ScreenViewLibraryPacks);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenViewLibraryPacks);