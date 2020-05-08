import React, {Component} from 'react';
import {AppRegistry, Alert, AsyncStorage, Dimensions, Image, Platform, Share, Linking} from "react-native";
import {Text, Container, List, ListItem, Content} from "native-base";
import commons, {styles} from './common';
import * as RNIap from 'react-native-iap';

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isUnlocked: this.props.rUnlocked,
      screenCoverRatio: this.props.coverRatio,
      screenCoverWidth: 500,
      screenCoverHeight: 500
    }
    this.ChangeCoverRatio();
  }

  componentDidMount() {
    RNIap.initConnection();
  }

  componentWillUnmount() {
    this.IAP_EndConnection();
  }
  
  PressRateUs = () => {
    if(Platform.OS === 'ios') {
      Linking.openURL("itms://itunes.apple.com/us/app/quick-guitar-riffs/id1436431815?mt=8");
    }
    else {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.HugeWall.QuickGuitarRiffs');
    }
  }

  PressShare = () => {
    // Default link is android
    var appLink = "https://play.google.com/store/apps/details?id=com.HugeWall.QuickGuitarRiffs";
    if(Platform.OS === 'ios') {
      appLink = "https://itunes.apple.com/us/app/quick-guitar-riffs/id1436431815?mt=8";
    }

    var appMsg = "Get Quick Guitar Riffs on Google Play Store now! " + appLink;
    if(Platform.OS === 'ios') {
      appMsg = "Get Quick Guitar Riffs on the App Store now! ";
    }

    Share.share({
      message: appMsg,
      url: appLink,
      title: "Get Quick Guitar Riffs!"
      },
      {
        dialogTitle: "Share Quick Guitar Riffs"  //Android only
      })
  }

  // Only display the buy button if the user haven't purchased.
  ShowBuyBtn() {

    // Refresh the lock
    this.state.isUnlocked = this.props.rUnlocked;
    let disp = null;

    if(!this.state.isUnlocked) {
      disp = 
        <ListItem onPress={()=>{this.IAP_BuyItem()}}>
          <Text style={styles.sidebarText} allowFontScaling={false} selectable={true}>Remove Ads + Get 130 More Songs!</Text>
        </ListItem>
    }
    return disp;
  }

  async IAP_BuyItem() {
    try {
        RNIap.initConnection();
        const purchase = await RNIap.buyProduct('com.hugewall.quickguitarriffs.unlockall');
        this.setState({ receipt: purchase.transactionReceipt }, () => this.props.rUpdateBuy());
        this.props.rGoToPage('ScreenAfterBuy');
        this.forceUpdate();
    } catch (err) {
        console.warn(err.code, err.message);
        Alert.alert(err.message);
    }
  }

  async IAP_RestorePurchases() {

    try {
        const purchases = await RNIap.getAvailablePurchases();
        purchases.forEach(purchase => {
            if (purchase.productId === 'com.hugewall.quickguitarriffs.unlockall') {
              this.setState({appUnlocked : true});
              this.forceUpdate();

              Alert.alert("Purchases Restored!", "Your purchases are restored successfully!");
            }
            else {
              this.setState( {appUnlocked : false});
              this.forceUpdate();

              Alert.alert("No Purchase To Restore", "There are no purchases to restore.");
            }
        })
    } catch(err) {
        console.warn(err); // standardized err.code and err.message available
        //Alert.alert(err.message);
        Alert.alert("Restore Unsuccessful", "Please try again later!");
    }
    this.forceUpdate();
}

  IAP_EndConnection() {
    RNIap.endConnectionAndroid();
  }

  ChangeCoverRatio() {
    if(commons.IsTablet())
      this.state.screenCoverRatio = 0.5;
    else
      this.state.screenCoverRatio = 0.8;

    this.state.screenCoverWidth = Dimensions.get('window').width * this.state.screenCoverRatio;
    this.state.screenCoverHeight = this.state.screenCoverWidth * 0.5;
  }

  onLayout = () => {
    //this.ChangeCoverRatio();
    //this.forceUpdate();
  }

  render() {
    return (
      <Container onLayout={e => this.onLayout(e)} style={{backgroundColor:'white'}} >
        <Content>
        <Image style={{flex:1,
                      resizeMode:'cover',
                      height:this.state.screenCoverHeight,
                      width:this.state.screenCoverWidth}}
                      source={require('../img/SideBar.jpg')} />        
          <List>
            <ListItem onPress={()=>{this.PressRateUs()}}>
              <Text style={styles.sidebarText} allowFontScaling={false} selectable={true}>Rate Us</Text>
            </ListItem>
            <ListItem onPress={()=>{this.PressShare()}}>
              <Text style={styles.sidebarText} allowFontScaling={false} selectable={true}>Share</Text>
            </ListItem>
            {/*<ListItem onPress={()=>{this.IAP_RestorePurchases()}}>
              <Text style={styles.sidebarText} allowFontScaling={false} selectable={true}>Restore</Text>
            </ListItem>*/}
            {/*this.ShowBuyBtn()*/}
            {/*<ListItem onPress={()=>{this.IAP_ConsumeProds()}}>
              <Text style={styles.sidebarText} allowFontScaling={false} selectable={true}>Consume (TEST PURPOSE)</Text>
          </ListItem>*/}
          </List>
        </Content>
      </Container>
    );
  }
}

AppRegistry.registerComponent('QuickGuitarRiffs', () => SideBar);
