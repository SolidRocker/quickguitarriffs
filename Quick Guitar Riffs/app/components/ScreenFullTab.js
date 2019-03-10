import React, {Component} from 'react';
import {AppRegistry, NetInfo, BackHandler, WebView, TouchableOpacity} from "react-native";
import {Text, Button, Icon, Container, Header, Left, Body, Right} from "native-base";
import commons, {styles} from './common';

export default class ScreenFullTab extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      cRiffID: this.props.navigation.getParam('rRiff'),
      cSongName: this.props.navigation.getParam('rSong'),
      cTabLink: this.props.navigation.getParam('rTabLink'),
      isConnected: true,
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.BackToRiff);
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.BackToRiff);
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    return true;
  }

  handleConnectivityChange = (isConnected) => {
    this.state.isConnected = isConnected;
    console.log("CHECKCONN");
  };

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

      disp = <Container>
            <WebView 
                style={styles.tabWebView} 
                source={{uri: this.state.cTabLink}} 
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                onError={() => this.LoadTabError}
                renderError={() => this.LoadTabError2}
              />
              </Container>
    return disp;
  }

  render() {
    return (
        <Container>
             <Header style={styles.riffHeaderBG}>
                {commons.ChangeStatusBar()}
                <Left>
                <Button transparent title="">
                <TouchableOpacity onPress={()=>this.BackToRiff()}>
                    <Icon name='arrow-back' style={styles.riffIcon}/>
               </TouchableOpacity>
                </Button>
                </Left>
                <Body>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={styles.riffHeader}>{this.state.cSongName}</Text>
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
