import React, { Component } from 'react';
import { AppRegistry, Alert, AsyncStorage, BackHandler, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Left, Right, Body, Container, Button, Icon, Text } from 'native-base';
import { setPack1, setPack2 } from '../redux/songlistActions';
import { connect } from 'react-redux';

import { Pack1_Song, Pack1_Artist, Pack2_Song, Pack2_Artist } from '../data/T_DATA';
import commons, {styles} from './common';
import * as RNIap from 'react-native-iap';

class ScreenViewLibrary extends Component {
    constructor(props) {
        super(props);
        this.timeOut = null;
        this.state = {
            packID : this.props.navigation.getParam('rPackID'),
            packSize: 0,
            listLoadStage: 0
        }
    }

    componentDidMount() {

        if(this.state.packID == 1) {
            this.state.packSize = Pack1_Song.length;
        }
        else if(this.state.packID == 2) {
            this.state.packSize = Pack2_Song.length;
        }
        RNIap.initConnection();
        BackHandler.addEventListener('hardwareBackPress', this.BackToPackScreen);
        return true;
    }

    componentWillUnmount() {
        this.IAP_EndConnection();
        BackHandler.removeEventListener('hardwareBackPress', this.BackToPackScreen);
        return true;
    }

    async IAP_BuyItem() {

        if(packID == 1) {

            try {
                RNIap.initConnection();
                const purchase = await RNIap.buyProduct('com.hugewall.quickguitarriffs.unlockall');
                this.setState({ receipt: purchase.transactionReceipt});
                this.setPack1(true);
                this.props.navigation.state.params.rUpdateBuy();
                this.props.navigation.navigate('ScreenAfterBuy');
            } catch (err) {
                console.warn(err.code, err.message);
                Alert.alert(err.message);
            }
        }
        if(packID == 2) {

            try {
                RNIap.initConnection();
                const purchase = await RNIap.buyProduct('com.hugewall.quickguitarriffs.pack2');
                this.setState({ receipt: purchase.transactionReceipt});
                this.setPack2(true);
                this.props.navigation.state.params.rUpdateBuy();
                this.props.navigation.navigate('ScreenAfterBuy');
            } catch (err) {
                console.warn(err.code, err.message);
                Alert.alert(err.message);
            }
        }
    }
    
    IAP_EndConnection() {
        RNIap.endConnection();
    }

    BackToPackScreen = () => {
        this.props.navigation.goBack();
        return true;
    }

    IsButtonDisabled = () => {
        if( (this.state.packID == 1 && this.props.pack1) ||
            (this.state.packID == 2 && this.props.pack2))
            return true;
    }

    GetPremiumButtonText = () => {
        if( (this.state.packID == 1 && this.props.pack1) || 
            (this.state.packID == 2 && this.props.pack2) ) {
           return  "You ALREADY HAVE THESE RIFFS"
        }
        return "GET THESE SONGS NOW!"
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
                <Text style={styles.libDesc}>This is the list of the {this.state.packSize} killer riffs you can add to your riffs library from this pack! Spanning across many genres, they're guaranteed to spice up your practice routine and get those fingers working!</Text>
                {this.RenderCurrentContents()}
                <Text style={styles.libDesc}>Add these {this.state.packSize} killer riffs into your collection!</Text>
                {this.RenderGetPremiumButton()}
            </ScrollView>
            
            this.state.listLoadStage = 2;
        }
        return disp;
    }

    RenderCurrentContents() {

        var disp = "";
        if(this.state.packID == 1) {
            disp =
            <View>
                {Pack1_Artist.map(this.RenderArtist)}
            </View>
        }
        else if(this.state.packID == 2) {
            disp =
            <View>
                {Pack2_Artist.map(this.RenderArtist)}
            </View>
        }
        return disp;
    }

    RenderArtist = (set_, index_) => {
        var disp = null;

        if(this.state.packID == 1) {
            disp = 
            <View style={styles.libView} key={index_}>
                <Text style={styles.libArtist} allowFontScaling={false} selectable={true}>{Pack1_Artist[index_].toUpperCase()}</Text>
                <Text style={styles.libSong} allowFontScaling={false} selectable={true}>{Pack1_Song[index_]}</Text>
                <View />
            </View>
        }
        else if(this.state.packID == 2) {
            disp = 
            <View style={styles.libView} key={index_}>
                <Text style={styles.libArtist} allowFontScaling={false} selectable={true}>{Pack2_Artist[index_].toUpperCase()}</Text>
                <Text style={styles.libSong} allowFontScaling={false} selectable={true}>{Pack2_Song[index_]}</Text>
                <View />
            </View>
        }
        return disp;
    }

    render() {
        return (
            <Container>
               <Header style={styles.riffHeaderBG}>
                    {commons.ChangeStatusBar()}
                    <Left>
                        <Button transparent title="back">
                        <TouchableOpacity onPress={() => this.BackToPackScreen()}>
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

const mapStateToProps = state => ({
    pack1: state.songlist.pack1,
    pack2: state.songlist.pack2
});

export default connect(mapStateToProps, {setPack1, setPack2})(ScreenViewLibrary);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenViewLibrary);