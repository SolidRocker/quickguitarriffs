import React, {Component} from 'react';
import {AppRegistry, Alert, StatusBar, AsyncStorage, BackHandler, AppState, Image, View, ScrollView, Platform, TouchableOpacity} from 'react-native';
import {Content, Drawer, List, ListItem, Header, Left, Body, Right, Container, Button, Icon, Text} from 'native-base';

import commons, {styles} from './common';
import SideBar from './SideBar';
import AdsRelated from './adsRelated';
import PushNotification from 'react-native-push-notification'
import * as RNIap from 'react-native-iap';
import { RiffList, RiffList_AllID } from '../data/T_DATA';

const itemSkus = Platform.select({
  ios: [
    'com.hugewall.quickguitarriffs.unlockall',
  ],
  android: [
    'com.hugewall.quickguitarriffs.unlockall',
  ],
});

export default class ScreenMainMenu extends Component{
  constructor(props) {
    super(props);

    // rAppUnlocked: 0 = noIAP, 1 = haveIAP
    this.state = {
     riffID: 0,
     productList : [],
     appUnlocked : (this.props.navigation.getParam('rAppUnlocked') == 1 ? true : false),
     AdsStuff: new AdsRelated(),
     notificationSeconds: 5,
     sideBarCoverRatio: 0.8,
     isDrawerOpen: false,
    };
    this.ChangeRatio();

    /* If user JUST unlocked songs, we need to forceUpdate.
    if(this.props.navigation.getParam('rAppUnlocked') == 3) {
      console.log("IS IS INZ");
      this.state.appUnlocked = true;
      this.TriggerUpdateAfterBuy();
    }*/
  }
  
  componentDidMount() {

    // Push notifications
    this.configure();
    AppState.addEventListener('change', this.handleAppStateChange);

    // IAP
    if(!this.state.appUnlocked) {
      this.IAP_Init();
      this.IAP_RestorePurchases();
    }

    BackHandler.addEventListener('hardwareBackPress', this.SysBackBtn);
  }

  componentWillUnmount() {
    // Push notifications
    AppState.removeEventListener('change', this.handleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.SysBackBtn);
    this.IAP_EndConnection();
  }

  SysBackBtn = () => {
    // close drawer if it is open
    if(this.state.isDrawerOpen) {
      this.CloseDrawer();
    }
    return true;
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

  async IAP_RestorePurchases(showAlert = false) {

      try {
          const purchases = await RNIap.getAvailablePurchases();
          purchases.forEach(purchase => {
              if (purchase.productId === 'com.hugewall.quickguitarriffs.unlockall') {
                  this.setState({appUnlocked : true});
                  this.forceUpdate();
              }
              else {
                this.setState( {appUnlocked : false});
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

  handleAppStateChange(appState) {
    if (appState === 'background') {

      /* DEBUG
      let datetemp = new Date(Date.now());
      console.log("NOW: " + datetemp);
      let date = new Date(Date.now() + (5 * 1000));
      console.log("LATER: " + date); 

      if (Platform.OS === 'ios') {
        date = date.toISOString();
      }*/

      var noofDays = Math.floor(1 + Math.random() * 2)  // 1 to 2 days
      var noofHours = (noofDays * 24) - 4;

      for(var i = 0; i < 2; ++i) {
        var msgType = Math.floor(1 + Math.random() * 4);
        var msg = 'Remember to practice your riffs!';     // Default msg in case switch case fails

        switch(msgType) {
          case 1:
            var randSong = Math.floor(Math.random() * RiffList_AllID[7].arr.length-1)
            msg = "Still remember how to play " + RiffList[randSong].Song + " by " + RiffList[randSong].Artist + "?";
            break;
          case 2:
            msg = "Remember to practice your riffs!"
            break;
          case 3:
            msg = "Need some inspiration? Check out the riffs in our library!"
            break;
          case 4:
            msg = "Don't forget to keep your fingers nimble!"
            break;
          default:
            break;
        }

        var timeInMilli = noofHours * 60 * 60 * 1000;
        
        // Cancel before making again
        PushNotification.cancelAllLocalNotifications();

        // First notification
        PushNotification.localNotificationSchedule({
          message: msg,
          date: new Date(Date.now() + (timeInMilli * (i+1)))
        });
      }
    }
    else {
      PushNotification.cancelAllLocalNotifications();
    }
  }

  configure() {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
      },
    });
  }

  AddMenuItem(item_) {
    let disp = null;

    // Title does not need TouchableOpacity
    if(item_ == 'Title') {
      disp =  <Image onPress={()=>this.IAP_TESTCHANGE()} source={this.GetImageString(item_)} style={{flex:1, aspectRatio:2.62}} />
    }
    else {
      disp =  <TouchableOpacity
                style={{flex:1, aspectRatio:4.8}}
                activeOpacity={0.6}
                onPress={()=>this.DoStuffOnClick(item_)}>
                  <Image source={this.GetImageString(item_)} style={{flex:1, aspectRatio:4.8}} />
              </TouchableOpacity>
    }
    return disp;
  }

  // Callback function for child (SideBar) to pass data back to MainMenu
  TriggerUpdateAfterBuy = () => {
    this.state.appUnlocked = true;
    AsyncStorage.setItem('localPurc', "1");
    this.forceUpdate();
  }

  DoStuffOnClick = (btnName) => {
    switch(btnName) {
      case 'Beginner':
      if(!this.state.appUnlocked)
        this.GoToRiffs(0);
      else
        this.GoToRiffs(4);
        break;

      case 'Intermediate':
        if(!this.state.appUnlocked)
          this.GoToRiffs(1);
        else
          this.GoToRiffs(5);
        break;

      case 'Advanced':
        if(!this.state.appUnlocked)
          this.GoToRiffs(2);
        else
          this.GoToRiffs(6);
        break;

      case 'All':
        if(!this.state.appUnlocked)
          this.GoToRiffs(3);
        else
          this.GoToRiffs(7);
        break;

      case 'ChooseRiff':
        this.props.navigation.navigate('ScreenChooseList', {rAppUnlocked : this.state.appUnlocked});
        break;

      case 'SuggestSongs':
        this.props.navigation.navigate('ScreenSuggestSongs', {rAppUnlocked : this.state.appUnlocked});
        break;

      case 'ViewLibrary':
        this.props.navigation.navigate('ScreenViewLibrary', {rAppUnlocked : this.state.appUnlocked, rUpdateBuy: this.TriggerUpdateAfterBuy});
        break;

      default:
        break;
  }}

  GoToRiffs(listType) {

    this.props.navigation.navigate('ScreenRiff',
      { rListType : listType,
        rChoseSongID : 1,
        rUnlocked : this.state.appUnlocked,
        rRefresh: this.IAP_RestorePurchases,
        rigTest : -1,
      });
  }

  // Helper function to load image path
  GetImageString(imgName) {
    switch(imgName) {
      case 'Title':         return require('../img/Title.jpg');
      case 'Beginner':      return require('../img/Beginner.jpg');
      case 'Intermediate':  return require('../img/Intermediate.jpg');
      case 'Advanced':      return require('../img/Advanced.jpg');
      case 'All':           return require('../img/All.jpg');
      case 'ChooseRiff':    return require('../img/ChooseRiff.jpg');
      case 'SuggestSongs':  return require('../img/SuggestSongs.jpg');
      case 'ViewLibrary':   return require('../img/View.jpg');
      default:              return;
    }
    return;
  }

  CloseDrawer() {
    this.drawer._root.close();
    this.state.isDrawerOpen = false;
  }

  OpenDrawer() {
    this.drawer._root.open();
    this.state.isDrawerOpen = true;
  }

  ChangeRatio = () => {
    if(commons.IsTablet())
      this.state.sideBarCoverRatio = 0.5;
    else
      this.state.sideBarCoverRatio = 0.8;
  }

  onLayout = () => {
    /*if(!this.state.isDrawerOpen) {
      console.log("IS CLOSED");
      this.ChangeRatio();
    }
    this.forceUpdate();*/
  }

  render() {

    // List of buttons in MainMenu
    var menuItems = [
      'Title',
      'Beginner',
      'Intermediate',
      'Advanced',
      'All',
      'ChooseRiff',
      'SuggestSongs',
      'ViewLibrary'
    ];

    return(
        <Container onLayout={e => this.onLayout(e)}>

        <Drawer
          ref={(ref) => { this.drawer = ref; }}
          content={<SideBar navigator={this.navigator}
                            rUnlocked={this.state.appUnlocked}
                            coverRatio={this.state.sideBarCoverRatio}
                            rUpdateBuy={this.TriggerUpdateAfterBuy}
                            rGoToPage={this.props.navigation.navigate}/>}
          openDrawerOffset={1-this.state.sideBarCoverRatio}
          panCloseMask={1-this.state.sideBarCoverRatio}
          onClose={() => this.CloseDrawer()} >

        <Container>
          <Header style={styles.riffHeaderBG}>
            {commons.ChangeStatusBar()}
            <Left>
              <Button transparent>
              <TouchableOpacity title={""} onPress={()=>this.OpenDrawer()}>
                <Icon name={Platform.OS === 'ios' ? 'ios-menu' : 'menu'} style={styles.riffIcon}/>
              </TouchableOpacity>
              </Button>
            </Left>
            <Body>
              <Text allowFontScaling={false} style={styles.riffHeader}>Quick Guitar Riffs</Text>
            </Body>
            <Right>
            </Right>
          </Header>

          <Content>
            <ScrollView>
            <List dataArray={menuItems}
              renderRow={(item) =>
                <ListItem
                style={styles.menuListItem}
                title={item}>
                  {this.AddMenuItem(item)}
                </ListItem>
              }>
            </List>
          </ScrollView>
        
        </Content>

        {this.state.AdsStuff.DisplayBannerAd(!this.state.appUnlocked)}
        {this.configure()}

      </Container>
      </Drawer>
      </Container>
    );
  }
}

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenMainMenu);