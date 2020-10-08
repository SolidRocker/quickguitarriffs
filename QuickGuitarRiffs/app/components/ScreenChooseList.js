import React, {Component} from 'react';
import {AppRegistry, View, BackHandler, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Header, Left, Right, Body, Container, Content, Separator, ListItem, Button, Icon, Text} from 'native-base';
import { connect } from 'react-redux';
import { setChooseList } from '../redux/songlistActions';
import commons, {styles} from './common';
import { LazyloadScrollView, LazyloadView } from 'react-native-lazyload';

class ScreenChooseList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      appUnlocked : this.props.route.params.rAppUnlocked,
      listType : this.props.route.params.rListType,
      artistArrayID : 0,
      listLoadStage: 0,

      currArtist: "",
      currArtistSongCount: 0
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
    this.props.navigation.navigate('ScreenRiff', {rListDifficulty : 99, rListType: this.state.listType, rChoseSongID : songID});
  }

  // Renders each song from the given block, which only contains songs from one artist.
  RenderSong = (songBlock, index) => {

    if(this.state.listType == 3 || this.state.listType == songBlock.Type) {

      var songItem = 
      <LazyloadView key={index} host="lazyload-list">
        <ListItem icon key={index} title={index} onPress={()=>this.GoToSong(index)}>
          <Left>
          </Left>
          <Body>
            <Text style={styles.chooselist_songName} allowFontScaling={false}>{songBlock.Song}</Text>
          </Body>
          {commons.GetDifficultyIconHeader(songBlock.Diff, songBlock.Type)}
        </ListItem>
        </LazyloadView>

      if(this.state.currArtist != songBlock.Artist) {
        this.state.currArtist = songBlock.Artist;
        var finalItem =
          <LazyloadView key={index} host="lazyload-list">
              <Separator bordered style={styles.chooselist_artist}> 
                <Text style={styles.chooselist_artistName} allowFontScaling={false} key={index}>{this.state.currArtist}</Text>
              </Separator>

              {songItem}
          </LazyloadView>
      }
      else {
        finalItem = songItem;
      }
      return finalItem;
    }
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
      }, 10);
    }
    else if(this.state.listLoadStage == 1) {
      disp = this.props.songs[3].map(this.RenderSong);
      this.state.listLoadStage = 2;
    }
    return disp;
  }

  render() {

    return(
      <Container>
        <Header style={styles.menuHeaderBG}>
          {commons.ChangeStatusBar()}
          <Left>
             <Button transparent title="back">
             <TouchableOpacity onPress={()=>this.BackToMainMenu()}>
              <Icon name='arrow-back' style={styles.mainMenuIcon}/>
             </TouchableOpacity>
             </Button>
          </Left>
          <Body>
            <Text allowFontScaling={false} style={styles.riffHeader}>Choose A Riff</Text>
          </Body>
          <Right>
          </Right>
        </Header>
      
        <LazyloadScrollView style={styles.chooselist_main} contentContainerStyle={styles.content} name="lazyload-list">
          {this.RenderCurrentContents()}
        </LazyloadScrollView>
    </Container>
    );
  }
}

const mapStateToProps = state => ({
  songs: state.songlist.songs,
  choselist: state.songlist.choselist
});

export default connect(mapStateToProps, {setChooseList})(ScreenChooseList);