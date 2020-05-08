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
                <Image source={this.GetImageString(item_)} style={{flex:1, aspectRatio:4.8}} />
            </TouchableOpacity>
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {})(ScreenSubMenu);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenSubMenu);