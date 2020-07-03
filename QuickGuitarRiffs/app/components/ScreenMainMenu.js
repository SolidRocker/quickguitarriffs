import React, {Component} from 'react';
import {AppRegistry, Alert, StatusBar, AsyncStorage, BackHandler, AppState, Image, View, ScrollView, Platform, TouchableOpacity} from 'react-native';
import {Content, Drawer, List, ListItem, Header, Left, Body, Right, Container, Button, Icon, Text} from 'native-base';
import { setPack1, setPack2, setPack3, setSongs, setProducts } from '../redux/songlistActions';
import { connect } from 'react-redux';

import commons, {styles} from './common';
import SideBar from './SideBar';
import {DisplayBannerAd} from './adsRelated';
//import PushNotification from 'react-native-push-notification'
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

class ScreenMainMenu extends Component{
  constructor(props) {
    super(props);

    this.state = {
     riffID: 0,
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
    if(!this.props.productsLoaded) {
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
        this.props.setProducts(products);
    } catch(err) {
        console.warn(err); // standardized err.code and err.message available
    }
  }

  async IAP_RestorePurchases(showAlert = false) {

      try {
          const purchases = await RNIap.getAvailablePurchases();
          if(purchases) {
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
          }
      } catch(err) {
          console.warn(err); // standardized err.code and err.message available
          //Alert.alert(err.message);
      }
      this.forceUpdate();
  }

  IAP_EndConnection() {
      RNIap.endConnectionAndroid();
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
      //PushNotification.cancelAllLocalNotifications();

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

        if(i == 0) {
          noofHours = 20;
        }
        if(i == 1) {
          noofHours = 70;
        }
        if(i == 2) {
          noofHours = 116;
        }
        if(i == 3) {
          noofHours = 185;
        }

        var timeInMilli = noofHours * 60 * 60 * 1000;
        //var timeInMilli = noofHours * 50;
    
        // Notification
        /*PushNotification.localNotificationSchedule({
          message: msg,
          date: new Date(Date.now() + timeInMilli)
        });*/
      }
    }
    else {
      //PushNotification.cancelAllLocalNotifications();
    }
  }

  configure() {
    /*PushNotification.configure({
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
      },
    });*/
  }

  async LoadSongList() {

    if(this.props.checked_pack1 && this.props.checked_pack2) {
      this.props.setSongs(this.props.pack1, this.props.pack2);
    }
  }

  GetImageString(imgName) {

    return <Image source={require("../img/bassheadgrey.png")} style={styles.mainMenuButtonIcon} />

    switch(imgName) {
      case 'Title':         return require('../img/Title.jpg');
      //case 'Beginner':      return require('../img/Beginner.jpg');
      //case 'Intermediate':  return require('../img/Intermediate.jpg');
      //case 'Advanced':      return require('../img/Advanced.jpg');
      //case 'All':           return require('../img/All.jpg');
      //case 'ChooseRiff':    return require('../img/ChooseRiff.jpg');
      case 'GuitarRiffs':    return require('../img/GuitarRiffs.jpg');
      case 'BassRiffs':    return require('../img/BassRiffs.jpg');
      case 'AllRiffs':    return require('../img/AllRiffs.jpg');
      case 'SuggestSongs':  return require('../img/SuggestSongs.jpg');
      case 'ViewLibrary':   return require('../img/View.jpg');
      default:              return;
    }
    return;
  }

  GetButtonContent(item_) {

    let header = "";
    let desc = "";
    let imgName = "";

    if(item_ == "GuitarRiffs") {
      header = "Guitar Riffs";
      desc = "All the classic guitar riff to play!";
    }
    else if(item_ == "BassRiffs") {
      header = "Bass Riffs";
      desc = "All the groovy basslines to jam on!";
    }
    else if(item_ == "AllRiffs") {
      header = "Guitar and Bass Riffs";
      desc = "Everything mixed together for maximum fun!";
    }
    else if(item_ == "SuggestSongs") {
      header = "Suggest Songs";
      desc = "Have a favorite riff you want to share? Let us know!";
    }
    else if(item_ == "ViewLibrary") {
      header = "View Additional Riffs";
      desc = "A whole list of riffs you can add to your library!";
    }

    let disp =  <View style={styles.mainMenuButtonContainer}>
                  <View style={styles.mainMenuSubContainer}>
                    <Text style={styles.mainMenuButtonTextTitle}>{header}</Text>
                    <Text style={styles.mainMenuButtonTextDesc} numberOfLines={2}>{desc}</Text>
                  </View>
                  <Image source={require("../img/guitarheadgrey.png")} style={styles.mainMenuButtonIcon} />
                </View>
    return disp;
  }

  AddMenuItem(item_) {
    let disp = null;

    // Title does not need TouchableOpacity
    if(item_ == 'Title') {
      //disp =  <Image onPress={()=>this.IAP_TESTCHANGE()} source={this.GetImageString(item_)} style={{flex:1, aspectRatio:2.62}} />
    }
    else {
      disp = <TouchableOpacity
                style={styles.mainMenuButtonTouch}
                activeOpacity={0.6}
                onPress={()=>this.DoStuffOnClick(item_)}>
                  {this.GetButtonContent(item_)}
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

      case 'GuitarRiffs':
        this.GoToSubMenu(1);
        break;

      case 'BassRiffs':
        this.GoToSubMenu(2);
        break;
      
      case 'AllRiffs':
        this.GoToSubMenu(3);
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
      });
  }

  GoToSubMenu(menuType) {
    this.props.navigation.navigate('ScreenSubMenu',
      { rMenuType : menuType
      });
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

  GetQuote() {
    let disp =
    <View>
      <Text style={styles.quoteContent}>Grababrushandputonalilmakeup!</Text>
      <Text style={styles.quotePerson}>- Serj Tankian</Text>
    </View>
    return disp;
  }

  render() {

    // List of buttons in MainMenu
    var menuItems = [
      'Title',
      /*'Beginner',
      'Intermediate',
      'Advanced',
      'All',
      'ChooseRiff',*/
      'GuitarRiffs',
      'BassRiffs',
      'AllRiffs',
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

        <Container style={styles.pageColor}>
          {<Header style={styles.riffHeaderBG}>
            {commons.ChangeStatusBar()}
            <Left style={{flex:1}}>
              <Button transparent>
              <TouchableOpacity title={""} onPress={()=>this.OpenDrawer()} >
                <Icon name={Platform.OS === 'ios' ? 'ios-menu' : 'menu'} style={styles.mainMenuHeaderLeft}/>
              </TouchableOpacity>
              </Button>
            </Left>
            <Body style={{flex:1}} >
              <Icon name='ios-star' style={styles.mainMenuHeaderBody}/>
            </Body>
            <Right style={{flex:1}}>
            </Right>
            </Header>}

          <Content>
            {this.GetQuote()}
            <Text style={styles.mainMenuInstr}>Pick a category to get started!</Text>
            <ScrollView>
            <List dataArray={menuItems}
              renderRow={(item) =>
                <ListItem icon
                style={styles.menuListItem}
                title={item}>
                  {this.AddMenuItem(item)}
                </ListItem>
              }>
            </List>
          </ScrollView>
        </Content>

        {DisplayBannerAd(!this.props.pack1 && !this.props.pack2)}
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
  checked_pack2: state.songlist.checked_pack2,
  productsLoaded: state.songlist.products_loaded
});

export default connect(mapStateToProps, {setPack1, setPack2, setPack3, setSongs, setProducts})(ScreenMainMenu);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenMainMenu);