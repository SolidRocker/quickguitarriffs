import React, {Component} from 'react';
import {AppRegistry, View, BackHandler, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Header, Left, Right, Body, Container, Content, Separator, ListItem, Button, Icon, Text} from 'native-base';
import { setChooseList } from '../redux/songlistActions';
import { connect } from 'react-redux';

import commons, {styles} from './common';

class ScreenChooseList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      appUnlocked : this.props.navigation.getParam('rAppUnlocked'),
      artistArrayID : 0,
      listLoadStage: 0,

      currArtist: "",
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
  RenderSongList = (songBlock) => {
      return(
        <ListItem icon key={songBlock.RID} title={songBlock.RID} onPress={()=>this.GoToSong(songBlock.RID)}>
          <Left>
          </Left>
          <Body>
            <Text style={styles.chooselist_songName} allowFontScaling={false}>{songBlock.Song}</Text>
          </Body>
          {commons.GetDifficultyIconHeader(songBlock.Diff)}
        </ListItem>
        );
  }

  RenderSong = (songBlock, index) => {

    if(this.state.currArtist != songBlock.Artist) {
      this.state.currArtist = songBlock.Artist;
      return (
        <View key={index}>
        <Separator bordered>
          <Text style={styles.chooselist_artistName} allowFontScaling={false} key={index}>{this.state.currArtist}</Text>
        </Separator>

          <ListItem icon key={index} title={index} onPress={()=>this.GoToSong(index)}>
          <Left>
          </Left>
          <Body>
            <Text style={styles.chooselist_songName} allowFontScaling={false}>{songBlock.Song}</Text>
          </Body>
          {commons.GetDifficultyIconHeader(songBlock.Diff)}
        </ListItem>
      </View>
      )
    }
  
    return(
      <ListItem icon key={index} title={index} onPress={()=>this.GoToSong(index)}>
        <Left>
        </Left>
        <Body>
          <Text style={styles.chooselist_songName} allowFontScaling={false}>{songBlock.Song}</Text>
        </Body>
        {commons.GetDifficultyIconHeader(songBlock.Diff)}
      </ListItem>
    )
  }


  RenderCurrentContents() {
    let disp = null;

    // Show the spinner first, then load the list.
    if(this.state.listLoadStage == 0) {
      disp =  <View style={{paddingTop:20}}>
                <ActivityIndicator size="small" color="#0000ff" />
                <Text style={{alignSelf:'center', paddingTop:4}}>Loading...</Text>
              </View>
      this.state.listLoadStage = 1;
      setTimeout(() => {
          this.forceUpdate();
      }, 100);
    }
    else if(this.state.listLoadStage == 1) {

      console.log("TOTAL S: " + this.props.songs[3].length);
      disp = this.props.songs[3].map(this.RenderSong);
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

const mapStateToProps = state => ({
  songs: state.songlist.songs,
  choselist: state.songlist.choselist
});

export default connect(mapStateToProps, {setChooseList})(ScreenChooseList);