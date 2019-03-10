import React, {Component} from 'react';
import {AppRegistry, View, BackHandler, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Header, Left, Right, Body, Container, Content, Separator, ListItem, Button, Icon, Text} from 'native-base';

import { RiffList, RiffList_Sort } from '../data/T_DATA';
import commons, {styles} from './common';

export default class ScreenChooseList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      artistCount : 0,
      appUnlocked : this.props.navigation.getParam('rAppUnlocked'),
      artistArrayID : 0,
      listLoadStage: 0
    };
    this.GetAppUnlocked();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.BackToMainMenu);
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.BackToMainMenu);
    return true;
  }

  // TODO: Read from IAP
  GetAppUnlocked = () => {
    this.state.artistArrayID = this.state.appUnlocked ? 1 : 0;
  }

  BackToMainMenu = () => {
    this.props.navigation.navigate('ScreenMainMenu');
    return true;
  }

  // Go to the song upon click.
  GoToSong = (songID) => {
    this.props.navigation.navigate('ScreenRiff', {rListType : 99, rChoseSongID : songID});
  }

  // Renders each song from the given block, which only contains songs from one artist.
  RenderSongList = (RID) => {
      return(
        <ListItem icon key={RID} title={RID} onPress={()=>this.GoToSong(RID)}>
          <Left>
          </Left>
          <Body>
            <Text style={styles.chooselist_songName} allowFontScaling={false}>{RiffList[RID-1].Song}</Text>
          </Body>
          {commons.GetDifficultyIconHeader(RiffList[RID-1].Diff)}
        </ListItem>
        );
  }

  // Renders all the artists' name sub-header, and maps the list of songs under the artist.
  RenderArtistSet = (artistBlock, index)  => {
    var artistName_ = RiffList[artistBlock[0]-1].Artist.toUpperCase();
    return (
        <View key={this.state.artistCount++}>
          <Separator bordered>
            <Text style={styles.chooselist_artistName} allowFontScaling={false} key={index}>{artistName_}</Text>
          </Separator>
            
          {artistBlock.map(this.RenderSongList)}
        </View>
    );
  }

  RenderCurrentContents() {
    let disp = null;

    // Show the spinner first, then load the list.
    if(this.state.listLoadStage == 0) {
      disp =  <View style={{paddingTop:20}}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
      this.state.listLoadStage = 1;
      setTimeout(() => {
          this.forceUpdate();
      }, 100);
    }
    else if(this.state.listLoadStage == 1) {
      disp = RiffList_Sort[this.state.artistArrayID].map(this.RenderArtistSet);
      this.state.listLoadStage = 2;
    }
    return disp;
  }

  render() {

    return(
      <Container>
        <Header style={styles.riffHeaderBG}>
          {commons.ChangeStatusBar()}
          <Left>
             <Button transparent title="back">
             <TouchableOpacity onPress={()=>this.BackToMainMenu()}>
              <Icon name='arrow-back' style={styles.riffIcon}/>
             </TouchableOpacity>
             </Button>
          </Left>
          <Body>
            <Text allowFontScaling={false} style={styles.riffHeader}>Choose A Riff</Text>
          </Body>
          <Right>
          </Right>
        </Header>
      
        <Content>
          {this.RenderCurrentContents()}
        </Content>
    </Container>
    );
  }
}

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenChooseList);