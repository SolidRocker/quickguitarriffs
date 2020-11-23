import React, {Component} from 'react';
import {AppRegistry, Alert, StatusBar, BackHandler, AppState, Image, View, ScrollView, Platform, TouchableOpacity} from 'react-native';
import {Content, Drawer, List, ListItem, Header, Left, Body, Right, Container, Button, Icon, Text} from 'native-base';
import { connect } from 'react-redux';
import commons, {styles} from './common';

const BUTTONS = Object.freeze({
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
  'All': 4,
  'Choose': 5
})

class ScreenSubMenu extends Component{
  constructor(props) {
    super(props);

    this.state = {
        menuType: this.props.route.params.rMenuType,
        isPressedDown: [false, false, false, false, false]
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

  OnTouchButton(item_, isPressedDown_) {

    let cIndex = item_ - 1;
    if(cIndex < 1) {
      cIndex = 0;
    }
    let items = [...this.state.isPressedDown];
    items[cIndex] = isPressedDown_;
    this.setState({isPressedDown: items});
  }

  AddMenuItem(item_) {
    let disp = null;
    
    disp =  <TouchableOpacity
            style={{flex:1}}
            activeOpacity={0.6}
            onPress={()=>this.DoStuffOnClick(item_)}
            onPressIn={()=>this.OnTouchButton(item_, true)}
            onPressOut={()=>this.OnTouchButton(item_, false)}
            >
              {this.GetButtonContent(item_)}
            </TouchableOpacity>
    return disp;
  }

  GetImageString(imgName) {

    switch(imgName) {
      case BUTTONS.Beginner:
        if(!this.state.isPressedDown[0]) {
          return require("../img/Icons/beginner-riffs.png");
        }
        else {
          return require("../img/Icons/beginner-riffs-pressed.png");
        }
      case BUTTONS.Intermediate:
        if(!this.state.isPressedDown[1]) {
          return require("../img/Icons/intermediate-riffs.png");
        }
        else {
          return require("../img/Icons/intermediate-riffs-pressed.png");
        }
      case BUTTONS.Advanced:
        if(!this.state.isPressedDown[2]) {
          return require("../img/Icons/advanced-riffs.png");
        }
        else {
          return require("../img/Icons/advanced-riffs-pressed.png");
        }
      case BUTTONS.All:
        if(!this.state.isPressedDown[3]) {
          return require("../img/Icons/all-riffs.png");
        }
        else {
          return require("../img/Icons/all-riffs-pressed.png");
        }
      case BUTTONS.Choose:
        if(!this.state.isPressedDown[4]) {
          return require("../img/Icons/choose-a-riff.png");
        }
        else {
          return require("../img/Icons/choose-a-riff-pressed.png");
        }
      default:
        return;
    }
  }

  GetButtonContent(item_) {

    let header = "";
    let desc = "";
    let imgName = "";

    switch(item_) {
      case BUTTONS.Beginner:
        header = "Beginner Riffs";
        desc = "Simple riffs to stretch your hands!";
        break;

        case BUTTONS.Intermediate:
          header = "Intermediate Riffs";
          desc = "More riffs to jam on!";
          break;

        case BUTTONS.Advanced:
          header = "Advanced Riffs";
          desc = "Time to go crazy!";
          break;

        case BUTTONS.All:
          header = "All Riffs";
          desc = "A mash up of all types of riffs!";
          break;

        case BUTTONS.Choose:
          header = "Choose A Riff";
          desc = "Take your pick!";
          break;
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


  DoStuffOnClick = (btnName) => {
    switch(btnName) {
      case BUTTONS.Beginner:
        commons.LogAnalytics(this.state.menuType, "Beginner");
        this.GoToRiffs(0);
        break;

      case BUTTONS.Intermediate:
        commons.LogAnalytics(this.state.menuType, "Intermediate");
        this.GoToRiffs(1);
        break;

      case BUTTONS.Advanced:
        commons.LogAnalytics(this.state.menuType, "Advanced");
        this.GoToRiffs(2);
        break;

      case BUTTONS.All:
        commons.LogAnalytics(this.state.menuType, "All");
        this.GoToRiffs(3);
        break;

      case BUTTONS.Choose:
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
      BUTTONS.Beginner,
      BUTTONS.Intermediate,
      BUTTONS.Advanced,
      BUTTONS.All,
      BUTTONS.Choose
    ];

    return(

        <Container>
          <Header style={styles.menuHeaderBG}>
            {commons.ChangeStatusBar()}
            <Left>
              <Button transparent>
              <TouchableOpacity onPress={()=>this.BackToMainMenu()}>
                    <Icon name='arrow-back' style={styles.mainMenuIcon}/>
               </TouchableOpacity>
              </Button>
            </Left>
            <Body>
              <Text allowFontScaling={false} style={styles.subMenuTitleHeader}>{this.GetSubMenuTitle()}</Text>
            </Body>
            <Right>
            </Right>
          </Header>

          <Content style={styles.subMenuContainer}>
          {this.GetHeader()}
            <ScrollView>
            <List dataArray={menuItems}
              renderRow={(item) =>
                <ListItem icon
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