import React, { Component } from 'react';
import { AppRegistry, Alert, AsyncStorage, BackHandler, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Left, Right, Body, Container, Button, Icon, Text } from 'native-base';
import { PaidLib_Song, PaidLib_Artist } from '../data/T_DATA';
import commons, {styles} from './common';
import * as RNIap from 'react-native-iap';

export default class ScreenViewLibrary extends Component {
    constructor(props) {
        super(props);
        this.timeOut = null;
        this.state = {
            appUnlocked : this.props.navigation.getParam('rAppUnlocked'),
            listLoadStage: 0
        }
    }

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

    async IAP_BuyItem() {
       try {
            RNIap.initConnection();
            const purchase = await RNIap.buyProduct('com.hugewall.quickguitarriffs.unlockall');
            this.setState({ receipt: purchase.transactionReceipt});
            this.state.appUnlocked = true;
            this.props.navigation.state.params.rUpdateBuy();
            this.props.navigation.navigate('ScreenAfterBuy');
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert(err.message);
        }
      }
    
    IAP_EndConnection() {
        RNIap.endConnection();
    }

    BackToMainMenu = () => {
        this.props.navigation.navigate('ScreenMainMenu');
        return true;
    }

    IsButtonDisabled = () => {
        return this.state.appUnlocked;
    }

    GetPremiumButtonText = () => {
        if(this.state.appUnlocked) {
           return  "You ALREADY HAVE THESE RIFFS"
        }
        return "GET THESE 130 SONGS NOW!"
    }

    RenderGetPremiumButton() {
        var disp = 
        <Button block warning title="submit" disabled={this.IsButtonDisabled()} onPress={() => this.IAP_BuyItem()}>
            <Text allowFontScaling={false}>{this.GetPremiumButtonText()}</Text>
        </Button>
        return disp;
    }

    RenderMainStuff() {
        var disp = null;
         // Show the spinner first, then load the list.
         if(this.state.listLoadStage == 0) {
            disp =  <View style={{paddingTop:20}}>
                    <ActivityIndicator size="small" color="#0000ff" />
                    </View>
            this.state.listLoadStage = 1;
            setTimeout(() => {
                this.forceUpdate();
            }, 100);
        }
        else if(this.state.listLoadStage == 1) {
            disp =
            <ScrollView>
                {this.RenderGetPremiumButton()}
                <Text style={styles.libDesc}>This is the FULL list of the 130 killer riffs you can add to your riffs library! Spanning across many genres, they're guaranteed to spice up your practice routine and get those fingers working!</Text>
                {this.RenderCurrentContents()}
                <Text style={styles.libDesc}>Add all 130 killer riffs into your collection!</Text>
                {this.RenderGetPremiumButton()}
            </ScrollView>
            
            this.state.listLoadStage = 2;
        }
        return disp;
    }

    RenderCurrentContents() {
        var disp =
            <View>
                {PaidLib_Artist.map(this.RenderArtist)}
            </View>
        return disp;
    }

    RenderArtist = (set_, index_) => {
        var disp =
        <View style={styles.libView} key={index_}>
            <Text style={styles.libArtist} allowFontScaling={false} selectable={true}>{PaidLib_Artist[index_].toUpperCase()}</Text>
            <Text style={styles.libSong} allowFontScaling={false} selectable={true}>{PaidLib_Song[index_]}</Text>
            <View />
        </View>
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

                <Container>
                   {this.RenderMainStuff()}
                </Container>
            </Container>
        );
    }
};

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenViewLibrary);