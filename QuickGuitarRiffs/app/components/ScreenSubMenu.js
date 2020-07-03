import React, {Component} from 'react';
import {AppRegistry, Alert, StatusBar, AsyncStorage, BackHandler, AppState, Image, View, ScrollView, Platform, TouchableOpacity} from 'react-native';
import {Content, Drawer, List, ListItem, Header, Left, Body, Right, Container, Button, Icon, Text} from 'native-base';
import { connect } from 'react-redux';
import commons, {styles} from './common';

class ScreenSubMenu extends Component{
  constructor(props) {
    super(props);

    this.state = {
        menuType: this.props.route.params.rMenuType
    };
  }
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.BackToMainMenu);
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.BackToMainMenu);
    clearTimeout(this.timeOut);
    return true;
  }

  BackToMainMenu = () => {
    this.props.navigation.navigate('ScreenMainMenu');
    return true;
  }

  AddMenuItem(item_) {
    let disp = null;
    
    disp =  <TouchableOpacity
            style={{flex:1, aspectRatio:4.8}}
            activeOpacity={0.6}
            onPress={()=>this.DoStuffOnClick(item_)}>
              {this.GetButtonContent(item_)}
            </TouchableOpacity>
    return disp;
  }

  GetButtonContent(item_) {

    console.log(item_);
    let header = "";
    let desc = "";
    let imgName = "";

    if(item_ == "Beginner") {
      header = "Beginner Riffs";
      desc = "Simple riffs to stretch your hands!";
    }
    else if(item_ == "Intermediate") {
      header = "Intermediate Riffs";
      desc = "More riffs to jam on!";
    }
    else if(item_ == "Advanced") {
      header = "Advanced Riffs";
      desc = "Time to go crazy!";
    }
    else if(item_ == "All") {
      header = "All Riffs";
      desc = "A mash up of all types of riffs!";
    }
    else if(item_ == "ChooseRiff") {
      header = "Choose A Riff";
      desc = "Find your favourite riffs, or discover new songs!";
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
      console.log(this.state.menuType);
        this.props.navigation.navigate('ScreenChooseList', {
          rListType: this.state.menuType
        });
        break;

      default:
        break;
  }}

  GoToRiffs(listDifficulty) {

    this.props.navigation.navigate('ScreenRiff',
      { rListDifficulty : listDifficulty,
        rListType: this.state.menuType,
        rChoseSongID : 1,
      });
  }

  // Helper function to load image path
  GetImageString(imgName) {
    switch(imgName) {
      case 'Beginner':      return require('../img/Beginner.jpg');
      case 'Intermediate':  return require('../img/Intermediate.jpg');
      case 'Advanced':      return require('../img/Advanced.jpg');
      case 'All':           return require('../img/All.jpg');
      case 'ChooseRiff':    return require('../img/ChooseRiff.jpg');
      default:              return;
    }
  }

  GetSubMenuTitle() {
    if(this.state.menuType == 1) {
        return "Guitar Riffs";
    }
    if(this.state.menuType == 2) {
        return "Bass Riffs";
    }
    return "All Riffs";
  }

  GetHeader() {
    let header = "How do you want to shred today?";
    if(this.state.menuType == 2) {
      header = "How do you want to groove today?";
    }
    else if(this.state.menuType == 3) {
      header = "How do you want to jam today?"
    }

    let disp =
    <View>
      <Text style={styles.subMenuHeader}>{header}</Text>
    </View>
    return disp;
  }

  render() {

    // List of buttons in MainMenu
    var menuItems = [
      'Beginner',
      'Intermediate',
      'Advanced',
      'All',
      'ChooseRiff'
    ];

    return(

        <Container>
          <Header style={styles.riffHeaderBG}>
            {commons.ChangeStatusBar()}
            <Left>
              <Button transparent>
              <TouchableOpacity onPress={()=>this.BackToMainMenu()}>
                    <Icon name='arrow-back' style={styles.riffIcon}/>
               </TouchableOpacity>
              </Button>
            </Left>
            <Body>
              <Text allowFontScaling={false} style={styles.riffHeader}>{this.GetSubMenuTitle()}</Text>
            </Body>
            <Right>
            </Right>
          </Header>

          <Content style={styles.subMenuContainer}>
          {this.GetHeader()}
            <ScrollView>
            <List dataArray={menuItems}
              renderRow={(item) =>
                <ListItem
                  style={styles.subMenuListItem}
                  title={item}>
                  {this.AddMenuItem(item)}
                </ListItem>
              }>
            </List>
          </ScrollView>
        
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {})(ScreenSubMenu);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenSubMenu);