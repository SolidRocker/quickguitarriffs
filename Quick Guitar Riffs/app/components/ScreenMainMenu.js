import React, {Component} from 'react';
import {AppRegistry, Alert, StatusBar, AsyncStorage, BackHandler, AppState, Image, View, ScrollView, Platform, TouchableOpacity} from 'react-native';
import {Content, Drawer, List, ListItem, Header, Left, Body, Right, Container, Button, Icon, Text} from 'native-base';
import { setPack1, setPack2, setSongs } from '../redux/songlistActions';
import { connect } from 'react-redux';

import commons, {styles} from './common';
import SideBar from './SideBar';
import AdsRelated from './adsRelated';
import PushNotification from 'react-native-push-notification'
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
  ios: [
    'com.hugewall.quickguitarriffs.unlockall',
  ],
  android: [
    'com.hugewall.quickguitarriffs.unlockall',    // Pack 1
    'com.hugewall.quickguitarriffs.pack2',        // Pack 2
  ],
});

class ScreenMainMenu extends Component{
  constructor(props) {
    super(props);

    this.state = {
     riffID: 0,
     productList : [],
     AdsStuff: new AdsRelated(),
     notificationSeconds: 5,
     sideBarCoverRatio: 0.8,
     isDrawerOpen: false,
    };
    this.ChangeRatio();
  }
  
  componentDidMount() {

    // Load data
    this.LoadSongList();

    // Push notifications
    this.configure();
    AppState.addEventListener('change', this.handleAppStateChange);

    // IAP
    if(!this.props.checked_pack1 || !this.props.checked_pack2) {
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

      // Cancel before making again
      PushNotification.cancelAllLocalNotifications();

      //var noofDays = 1 //Math.floor(1 + Math.random() * 2)  // 1 to 2 days
      var noofHours = 20;// = (noofDays * 24) - 4;

      for(var i = 0; i < 4; ++i) {
        var msgType = Math.floor(1 + Math.random() * 3);
        var msg = 'Remember to practice your riffs!';     // Default msg in case switch case fails

        switch(msgType) {
          case 1:
            msg = "Remember to practice your riffs!"
            break;
          case 2:
            msg = "Need some inspiration? Check out the riffs in our library!"
            break;
          case 3:
            msg = "Don't forget to keep your fingers nimble!"
            break;
          default:
            break;
        }

        if(i == 1) {
          noofHours = 20;
        }
        if(i == 2) {
          noofHours = 70;
        }
        if(i == 3) {
          noofHours = 116;
        }
        if(i == 4) {
          noofHours = 185;
        }

        var timeInMilli = noofHours * 60 * 60 * 1000;
    
        // Notification
        PushNotification.localNotificationSchedule({
          message: msg,
          date: new Date(Date.now() + timeInMilli)
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

  async LoadSongList() {

    if(this.props.checked_pack1 && this.props.checked_pack2) {
      this.props.setSongs(this.props.pack1, this.props.pack2);
    }
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

  DoStuffOnClick = (btnName) => {
    switch(btnName) {
      case 'Beginner':
        this.GoToRiffs(0);
        break;

      case 'Intermediate':
        this.GoToRiffs(1);
        break;

      case 'Advanced':
        this.GoToRiffs(2);
        break;

      case 'All':
        this.GoToRiffs(3);
        break;

      case 'ChooseRiff':
        this.props.navigation.navigate('ScreenChooseList');
        break;

      case 'SuggestSongs':
        this.props.navigation.navigate('ScreenSuggestSongs');
        break;

      case 'ViewLibrary':
        this.props.navigation.navigate('ScreenViewLibraryPacks');
        break;

      default:
        break;
  }}

  GoToRiffs(listType) {

    this.props.navigation.navigate('ScreenRiff',
      { rListType : listType,
        rChoseSongID : 1,
        rRefresh: this.IAP_RestorePurchases,
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

        {this.state.AdsStuff.DisplayBannerAd(!this.props.pack1 && !this.props.pack2)}
        {this.configure()}

      </Container>
      </Drawer>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  songs: state.songlist.songs,
  pack1: state.songlist.pack1,
  pack2: state.songlist.pack2,
  checked_pack1: state.songlist.checked_pack1,
  checked_pack2: state.songlist.checked_pack2
});

export default connect(mapStateToProps, {setPack1, setPack2, setSongs})(ScreenMainMenu);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenMainMenu);