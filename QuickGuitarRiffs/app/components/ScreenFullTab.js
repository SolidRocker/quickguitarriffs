import React, {Component} from 'react';
import {AppRegistry, BackHandler, Dimensions, TouchableOpacity} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { WebView } from 'react-native-webview';
import {Text, Button, Icon, Container, Header, Left, Body, Right} from "native-base";
import commons, {styles} from './common';

export default class ScreenFullTab extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      cRiffID: this.props.route.params.rRiff,
      cSongName: this.props.route.params.rSong,
      cTabLink: this.props.route.params.rTabLink,
      isConnected: true,
      isPortrait: commons.IsPortrait()
    }

    Dimensions.addEventListener('change', () => {
      this.setState({isPortrait: commons.IsPortrait()});
    });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.BackToRiff);
    NetInfo.addEventListener(state => {this.state.isConnected = state.isConnected;});
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.BackToRiff);   
    return true;
  }

  BackToRiff = () => {
    this.props.navigation.pop();
    return true;
  }

  LoadTabError = () => {
    console.log("ERR FUNC");
    return <Text>ERROR</Text>
  }

  LoadTabError = () => {
    console.log("ERR FUNC2");
    return <Text>ERROR2</Text>
  }

  LoadFullTabs() {
    let disp = null;

    if(this.state.isPortrait) {
      disp =
        <WebView 
            style={styles.tabWebView} 
            source={{uri: this.state.cTabLink}} 
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onError={() => this.LoadTabError}
            renderError={() => this.LoadTabError2}
          />
    }
    else {
      disp =
        <WebView 
            style={styles.tabWebViewLandscape} 
            source={{uri: this.state.cTabLink}} 
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onError={() => this.LoadTabError}
            renderError={() => this.LoadTabError2}
          />

    }
    return disp;
  }

  render() {
    return (
        <Container>
             <Header style={styles.menuHeaderBG}>
                {commons.ChangeStatusBar()}
                <Left>
                <Button transparent title="">
                <TouchableOpacity onPress={()=>this.BackToRiff()}>
                    <Icon name='arrow-back' style={styles.mainMenuIcon}/>
               </TouchableOpacity>
                </Button>
                </Left>
                <Body>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={styles.subMenuTitleHeader}>{this.state.cSongName}</Text>
                </Body>
                <Right>
                </Right>
            </Header>

            {this.LoadFullTabs()}
        </Container>
    );
}
}

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenFullTab);
