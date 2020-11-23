import React, {Component} from 'react';
import {AppRegistry, Alert, StatusBar, BackHandler, AppState, Image, View, ScrollView, Platform, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Content, Drawer, List, ListItem, Header, Left, Body, Right, Container, Button, Icon, Text} from 'native-base';
import { setPack1, setPack2, setPack3, setSongs, setProducts, setQuotes } from '../redux/songlistActions';
import { connect } from 'react-redux';

import commons, {styles} from './common';
import SideBar from './SideBar';
import {DisplayBannerAd} from './adsRelated';
import PushNotification from 'react-native-push-notification'
import * as RNIap from 'react-native-iap';
import GestureRecognizer from 'react-native-swipe-gestures';

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

const BUTTONS = Object.freeze({
  'Title': 1,
  'GuitarRiffs': 2,
  'BassRiffs': 3,
  'AllRiffs': 4,
  'SuggestSongs': 5,
  'ViewLibrary': 6
})

class ScreenMainMenu extends Component{
  constructor(props) {
    super(props);

    this.state = {
     riffID: 0,
     notificationSeconds: 5,
     sideBarCoverRatio: 0.8,
     isDrawerOpen: false,
     isRefreshing: false,

     hasLoadedQuote: false,
     currQuote: 0,
     isPressedDown: [false, false, false, false, false]
    };
    this.ChangeRatio();
  }
  
  componentDidMount() {

    // Load data
    this.LoadSongList();
    this.LoadQuotes();

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

  async LoadSongList() {

    if(this.props.checked_pack1 && this.props.checked_pack2 && this.props.checked_pack3) {
      this.props.setSongs(this.props.pack1, this.props.pack2, this.props.pack3);
    }
  }

  async LoadQuotes() {
      this.props.setQuotes();
  }

  GetTitleString(index) {
    switch(index) {
      case BUTTONS.Title: return 'Title';
      case BUTTONS.GuitarRiffs: return 'GuitarRiffs';
      case BUTTONS.BassRiffs: return 'BassRiffs';
      case BUTTONS.AllRiffs: return 'AllRiffs';
      case BUTTONS.SuggestSongs: return 'SuggestSongs';
      case BUTTONS.ViewLibrary: return 'ViewLibrary';
      default: return '';
    }
  }

  GetImageString(imgName) {

    switch(imgName) {
      case BUTTONS.GuitarRiffs:
        if(!this.state.isPressedDown[0]) {
          return require("../img/Icons/guitar-riffs.png");
        }
        else {
          return require("../img/Icons/guitar-riffs-pressed.png");
        }
      case BUTTONS.BassRiffs:
        if(!this.state.isPressedDown[1]) {
          return require("../img/Icons/bass-riffs.png");
        }
        else {
          return require("../img/Icons/bass-riffs-pressed.png");
        }
      case BUTTONS.AllRiffs:
        if(!this.state.isPressedDown[2]) {
          return require("../img/Icons/guitar-and-bass-riffs.png");
        }
        else {
          return require("../img/Icons/guitar-and-bass-riffs-pressed.png");
        }
      case BUTTONS.SuggestSongs:
        if(!this.state.isPressedDown[3]) {
          return require("../img/Icons/suggest-songs.png");
        }
        else {
          return require("../img/Icons/suggest-songs-pressed.png");
        }
      case BUTTONS.ViewLibrary:
        if(!this.state.isPressedDown[4]) {
          return require("../img/Icons/view-additional-riffs.png");
        }
        else {
          return require("../img/Icons/view-additional-riffs-pressed.png");
        }
      default:
        return;
    }
  }

  GetButtonContent(item_) {

    let header = "";
    let desc = "";
    let imgName = "";

    if(item_ == BUTTONS.GuitarRiffs) {
      header = "Guitar Riffs";
      desc = "All the classic guitar riff to play!";
    }
    else if(item_ == BUTTONS.BassRiffs) {
      header = "Bass Riffs";
      desc = "All the groovy basslines to jam on!";
    }
    else if(item_ == BUTTONS.AllRiffs) {
      header = "Guitar and Bass Riffs";
      desc = "Everything mixed together for maximum fun!";
    }
    else if(item_ == BUTTONS.SuggestSongs) {
      header = "Suggest Songs";
      desc = "Share your favorite riffs with us!";
    }
    else if(item_ == BUTTONS.ViewLibrary) {
      header = "View Additional Riffs";
      desc = "Packs and packs of extra riffs!";
    }

    let disp =  <View style={styles.mainMenuButtonContainer}>
                  <View style={styles.mainMenuSubContainer}>
                    <Text style={styles.mainMenuButtonTextTitle}>{header}</Text>
                    <Text style={styles.mainMenuButtonTextDesc}>{desc}</Text>
                  </View>
                  <Image source={this.GetImageString(item_)} style={styles.mainMenuButtonIcon} />
                </View>
    return disp;
  }

  OnTouchButton(item_, isPressedDown_) {

    let cIndex = item_ - 2;
    if(cIndex < 1) {
      cIndex = 0;
    }
    let items = [...this.state.isPressedDown];
    items[cIndex] = isPressedDown_;
    this.setState({isPressedDown: items});
  }

  AddMenuItem(item_) {
    let disp = null;

    // Title does not need TouchableOpacity
    if(item_ != BUTTONS.Title) {

      disp = <TouchableOpacity
                style={styles.mainMenuButtonTouch}
                activeOpacity={0.6}
                onPress={()=>this.DoStuffOnClick(item_)}
                onPressIn={()=>this.OnTouchButton(item_, true)}
                onPressOut={()=>this.OnTouchButton(item_, false)}
                >
                  {this.GetButtonContent(item_)}
              </TouchableOpacity>
    }
    return disp;
  }

  DoStuffOnClick = (btnName) => {
    switch(btnName) {

      case BUTTONS.GuitarRiffs:
        this.GoToSubMenu(1);
        break;

      case BUTTONS.BassRiffs:
        this.GoToSubMenu(2);
        break;
      
      case BUTTONS.AllRiffs:
        this.GoToSubMenu(3);
        break;

      case BUTTONS.SuggestSongs:
        this.props.navigation.navigate('ScreenSuggestSongs');
        break;

      case BUTTONS.ViewLibrary:
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
    if(this.props.quotes && this.props.quotes.length > 0) {
      let qMax = this.props.quotes.length;
      
      if(!this.state.hasLoadedQuote) {
        this.setState({
          hasLoadedQuote: true,
          currQuote: Math.floor(Math.random() * qMax)
        });
      }
      
      let disp =
      <View>
        <Text style={styles.quoteContent}>{this.props.quotes[this.state.currQuote].quote}</Text>
        <Text style={styles.quotePerson}>- {this.props.quotes[this.state.currQuote].artist}</Text>
      </View>
      return disp;
    }
    return null;
  }

  onSwipeLeft(gestureState) {
    this.setState({isRefreshing: true});

    setTimeout(() => {
      this.setState({
        hasLoadedQuote: false,
        isRefreshing: false
      });
    }, 500);
  }

  ShowSpinner() {
    let disp = null;

    if(this.state.isRefreshing) {
        disp =  <View style={{marginTop:"10%"}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
    }
    return disp;
  }

  render() {

    // List of buttons in MainMenu
    var menuItems = [
      BUTTONS.Title,
      BUTTONS.GuitarRiffs,
      BUTTONS.BassRiffs,
      BUTTONS.AllRiffs,
      BUTTONS.SuggestSongs,
      BUTTONS.ViewLibrary
    ];



    return(
        <Container
          onLayout={e => this.onLayout(e)}
        >

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
          {<Header style={styles.menuHeaderBG}>
            {commons.ChangeStatusBar()}
            <Left style={{flex:1}}>
              <Button transparent>
              <TouchableOpacity title={""} onPress={()=>this.OpenDrawer()} >
                <Icon name={Platform.OS === 'ios' ? 'ios-menu' : 'menu'} style={styles.mainMenuHeaderLeft}/>
              </TouchableOpacity>
              </Button>
            </Left>
            <Body style={{flex:1}} >
              <Image source={require("../img/Logo/logo-transparent.png")} style={styles.mainMenuHeaderBody}/>
            </Body>
            <Right style={{flex:1}}>
            </Right>
            </Header>}

          <Content>
            <GestureRecognizer
                  onSwipeDown={(state) => this.onSwipeLeft(state)}
            >
              <ScrollView>
              {this.ShowSpinner()}
              {this.GetQuote()}
              <Text style={styles.mainMenuInstr}>Pick a category to get started!</Text>
              <List dataArray={menuItems}
                renderRow={(item) =>
                  <ListItem icon
                  style={styles.menuListItem}
                  title={this.GetTitleString(item)}>
                    {this.AddMenuItem(item)}
                  </ListItem>
                }>
              </List>
            </ScrollView>
          </GestureRecognizer>
        </Content>

        {DisplayBannerAd(this.props.hasAds)}

      </Container>
      </Drawer>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  songs: state.songlist.songs,
  quotes: state.songlist.quotes,
  pack1: state.songlist.pack1,
  pack2: state.songlist.pack2,
  pack3: state.songlist.pack3,
  hasAds: state.songlist.hasAds,
  checked_pack1: state.songlist.checked_pack1,
  checked_pack2: state.songlist.checked_pack2,
  checked_pack3: state.songlist.checked_pack3,
  productsLoaded: state.songlist.products_loaded
});

export default connect(mapStateToProps, {setPack1, setPack2, setPack3, setSongs, setProducts, setQuotes})(ScreenMainMenu);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenMainMenu);