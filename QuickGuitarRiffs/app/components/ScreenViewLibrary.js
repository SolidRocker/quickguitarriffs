import React, { Component, Suspense } from 'react';
import { AppRegistry, Alert, AsyncStorage, BackHandler, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Left, Right, Body, Container, Button, Icon, Text } from 'native-base';
import { setPack1, setPack2, setPack3 } from '../redux/songlistActions';
import { connect } from 'react-redux';

import { Pack1_Song, Pack1_Artist, Pack2_Song, Pack2_Artist, Pack3_Song, Pack3_Artist } from '../data/T_DATA';
import commons, {styles} from './common';
import RNIap from 'react-native-iap';

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


class ScreenViewLibrary extends Component {
    constructor(props) {
        super(props);
        this.timeOut = null;
        this.state = {
            packID : this.props.route.params.rPackID,
            packName: '',
            packSize: 0,
            listLoadStage: 0
        }
    }

    async componentDidMount() {

        if(this.state.packID == 1) {
            this.state.packName = 'com.hugewall.quickguitarriffs.unlockall';
            this.state.packSize = Pack1_Song.length;
        }
        else if(this.state.packID == 2) {
            this.state.packName = 'com.hugewall.quickguitarriffs.pack2';
            this.state.packSize = Pack2_Song.length;
        }
        else if(this.state.packID == 3) {
            this.state.packName = 'com.hugewall.quickguitarriffs.pack3';
            this.state.packSize = Pack3_Song.length;
        }
        RNIap.initConnection();
        try {
            const products: Product[] = await RNIap.getProducts(itemSkus);
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }

        BackHandler.addEventListener('hardwareBackPress', this.BackToPackScreen);
        return true;
    }

    componentWillUnmount() {

        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }

        this.IAP_EndConnection();
        BackHandler.removeEventListener('hardwareBackPress', this.BackToPackScreen);
        return true;
    }

    async IAP_BuyItem() {

        try {
            RNIap.initConnection();
            const purchase = await RNIap.requestPurchase(this.state.packName);
            this.setState({ receipt: purchase.transactionReceipt});
            this.setPack1(true);
            this.props.navigation.state.params.rUpdateBuy();
            this.props.navigation.navigate('ScreenAfterBuy');
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert(err.message);
        }
    }
    
    IAP_EndConnection() {
        RNIap.endConnectionAndroid();
    }

    BackToPackScreen = () => {
        this.props.navigation.goBack();
        return true;
    }

    IsButtonDisabled = () => {
        if( (this.state.packID == 1 && this.props.pack1) ||
            (this.state.packID == 2 && this.props.pack2) ||
            (this.state.packID == 3 && this.props.pac32))
            return true;
    }

    GetPremiumButtonText = () => {
        if( (this.state.packID == 1 && this.props.pack1) || 
            (this.state.packID == 2 && this.props.pack2) ||
            (this.state.packID == 3 && this.props.pack3)) {
           return  "YOU ALREADY HAVE THESE RIFFS"
        }
        return "GET THESE SONGS NOW!"
    }

    RenderGetPremiumButton() {
        var disp = 
        <TouchableOpacity style={this.IsButtonDisabled() ? styles.libViewButtonDisabled : styles.libViewButton} disabled={this.IsButtonDisabled()} onPress={() => this.IAP_BuyItem()}>
            <Text style={styles.libViewButtonText} allowFontScaling={false}>{this.GetPremiumButtonText()}</Text>
        </TouchableOpacity>
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
                <View style={{marginBottom: 20}}></View>
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
        else if(this.state.packID == 3) {
            disp =
            <View>
                {Pack3_Artist.map(this.RenderArtist)}
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
        else if(this.state.packID == 3) {
            disp = 
            <View style={styles.libView} key={index_}>
                <Text style={styles.libArtist} allowFontScaling={false} selectable={true}>{Pack3_Artist[index_].toUpperCase()}</Text>
                <Text style={styles.libSong} allowFontScaling={false} selectable={true}>{Pack3_Song[index_]}</Text>
                <View />
            </View>
        }
        return disp;
    }

    render() {
        return (
            <Container>
               <Header style={styles.menuHeaderBG}>
                    {commons.ChangeStatusBar()}
                    <Left>
                        <Button transparent title="back">
                        <TouchableOpacity onPress={() => this.BackToPackScreen()}>
                            <Icon name='arrow-back' style={styles.mainMenuIcon}/>
                        </TouchableOpacity>
                        </Button>
                    </Left>
                    <Body>
                        <Text allowFontScaling={false} style={styles.riffHeader}>View Library</Text>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Container style={styles.libViewContainer}>
                   {this.RenderMainStuff()}
                </Container>
            </Container>
        );
    }
};

const mapStateToProps = state => ({
    pack1: state.songlist.pack1,
    pack2: state.songlist.pack2,
    pack3: state.songlist.pack3
});

export default connect(mapStateToProps, {setPack1, setPack2, setPack3})(ScreenViewLibrary);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenViewLibrary);