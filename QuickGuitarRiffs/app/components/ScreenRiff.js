import React, {Component} from 'react';
import {AppRegistry, Alert, BackHandler, Dimensions, View, Platform, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {WebView} from 'react-native-webview';
import {Header, Footer, FooterTab, Card, Body, Left, Right, Container, Button, Icon, Text} from 'native-base';
import {connect} from 'react-redux';

import commons, {styles} from './common';
import {DisplayInterstitialAd} from './adsRelated';

class ScreenRiff extends Component{
  constructor(props) {
    super(props);
    // Get value from previous screen passed in
    this.state = {
      cListDifficulty: this.props.route.params.rListDifficulty,
      cChoseSongID: this.props.route.params.rChoseSongID,  // Only used if user chose song instead of randoming one.
      cListType: this.props.route.params.rListType,
      isChoosingSong: false,

      cDifficulty: '',
      cRiffID: 1,
      cMaxCharsPerLine: 0,

      isConnected: true,
      isPlayingVid: false,
      renderVideo : 0,

      tabstringID : 0,
      maxSavedSet : 1,
      isLoading: false
    }

    this.GetDifficulty();
    this.GetRandomRiff();
    this.CalcMaxCharsPerLine();

    NetInfo.fetch().then(state => {
      this.state.isConnected = state.isConnected;
    });
  }

  GetDifficulty = () => {
    switch(this.state.cListDifficulty) {
      case 0:
        this.state.cDifficulty = "Beginner";
        break;
      case 1:
        this.state.cDifficulty = "Intermediate";
        break;
      case 2:
        this.state.cDifficulty = "Advanced";
        break;
      case 3:
        this.state.cDifficulty =  "All";
        break;
      case 99:
        this.state.cDifficulty = "Chosen"
        this.state.isChoosingSong = true;
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.BackToMainMenu);
    NetInfo.addEventListener(state => {this.state.isConnected = state.isConnected;});
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.BackToMainMenu);
    return true;
  }

  handleConnectivityChange = isConnected_ => {
    this.state.isConnected = isConnected_;
  };

  onLayout() {
    this.CalcMaxCharsPerLine();
    this.forceUpdate();
  }

  // Refreshes this page with another random riff.
  GetRandomRiff = () => {

    if(this.state.isChoosingSong) {
      this.state.cRiffID = this.state.cChoseSongID;
      this.state.cListDifficulty = 3;

      var songType = this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Type == 1 ? "Guitar" : "Bass";

      commons.LogAnalytics(this.state.cListType, songType,
                        this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Song,
                        this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Artist);
      //this.state.cRiffID = this.props.songs[this.state.cListDifficulty][this.state.cRiffID].RID;
    }
    else {
      var nMax = this.props.songs[this.state.cListDifficulty].length;
      
      if(this.state.cListType == 1 || this.state.cListType == 2) {
        do {
          this.state.cRiffID = Math.floor(Math.random() * nMax);
        }
        while(this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Type != this.state.cListType)
      }
      else {
        this.state.cRiffID = Math.floor(Math.random() * nMax);
      }
      
      //this.state.cRiffID = this.props.songs[this.state.cListDifficulty][arrayPos].RID;
    }
    //console.log("rID INDEX: ", this.state.cListDifficulty + ", " + this.state.cRiffID);
    //console.log("rID Riff Page: ", this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Song);
    //console.log("rID Riff ID: ", this.props.songs[this.state.cListDifficulty][this.state.cRiffID].RID);
  }

  BackToMainMenu = () => {

    // Go back to choosing songs if that's where user came from
    if(this.state.isChoosingSong) {
      this.props.navigation.goBack();
    }
    else {
      const chanceToShowAd = Math.floor(1 + Math.random() * 100) 
      console.log("chance ", chanceToShowAd);
      if(chanceToShowAd < 30) {
        DisplayInterstitialAd(this.props.hasAds);
      }
      this.props.navigation.navigate('ScreenMainMenu');
    }
    return true;
  }

  ShowUnconnectedText() {
    var disp = null;
    if(!this.state.isConnected) {
      disp = 
      <View>
        <Text style={styles.noConnection}>Cannot connect to the internet. Please check your connection!</Text>
      </View>
    }
    return disp;
  }

  ClickRandomAgain = () => {

    // Make sure the video does not continue playing after reload!
    this.state.isPlayingVid = false;
    this.state.isLoading = true;

    const chanceToShowAd = Math.floor(1 + Math.random() * 100) 
    console.log("chance ", chanceToShowAd);
    if(chanceToShowAd < 30) {
      console.log("AD: " + this.props.hasAds);
      DisplayInterstitialAd(this.props.hasAds);
    }
    
    this.forceUpdate();
    setTimeout(() => {
      this.props.navigation.push('ScreenRiff', {rListDifficulty : this.state.cListDifficulty, rListType: this.state.cListType, rPrevID: this.state.cPrevID});
    }, 1);
  }

  TogglePlayVid = () => {

    // Force updates calls render again, thereby updating the isPlayingVid HTML.
    this.state.isPlayingVid = !this.state.isPlayingVid;
    this.forceUpdate();
  }

  ToggleDispTab = () => {
    this.state.isPlayingVid = false;
    this.forceUpdate();
    this.props.navigation.push('ScreenFullTab', {rRiff: this.state.cRiffID, rSong: this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Song, rTabLink: this.props.songs[this.state.cListDifficulty][this.state.cRiffID].TabL});
  }

  PlayVidError = () => {
    let disp = null;
    disp = <View>
            <Text>Could not load video, please check your internet connection!</Text>
          </View>
    return disp;
  }

  // If the user chose a song instead of randoming, we dont have to show NextSong button.
  ShowNextSongButton() {
    let showbtn = null;
    if(!this.state.isChoosingSong)
    {
      showbtn = 
      <Button vertical>
        <TouchableOpacity onPress={()=>this.ClickRandomAgain()} >
          <Icon name="ios-skip-forward" style={styles.riffFooterIcon}/>
          <Text allowFontScaling={false} style={styles.footerButtonText}>Next Song</Text>
        </TouchableOpacity>
      </Button>
    }
    return showbtn;
  }

  DisplayNotes() {
    let disp = 
    <View>
      <Text allowFontScaling={false} style={styles.songTabNotes}>| /  slide </Text>
      <Text allowFontScaling={false} style={styles.songTabNotes}>| h  hammer-on </Text>
      <Text allowFontScaling={false} style={styles.songTabNotes}>| p  pull-off </Text>
      <Text allowFontScaling={false} style={styles.songTabNotes}>| ~  vibrato </Text>
      <Text allowFontScaling={false} style={styles.songTabNotes}>| +  harmonic </Text>
      <Text allowFontScaling={false} style={styles.songTabNotes}>| x  Mute note </Text>
      <Text allowFontScaling={false} style={styles.songTabNotes}> </Text>
      <Text allowFontScaling={false} style={styles.songTabNotes}>View the full tab from {this.props.songs[this.state.cListDifficulty][this.state.cRiffID].TabSrc} by clicking on the "FULL TAB" button!</Text>
      <Text allowFontScaling={false} style={styles.songTabNotes}> </Text>
    </View>
    return disp;
  }
  
  CalcMaxCharsPerLine() {

     /* For font size 15, the width 1 char takes up is 9.6.
        From there we get 1 size = 0.64.
        Why did they call it font size 15 then...
        (I rounded it up for some space for overestimation) */
    var magicNumber;
    if(commons.IsTablet())
      magicNumber = 10;
    else
      magicNumber = 8;

    var vScreenWidth = Dimensions.get('window').width;
    this.state.cMaxCharsPerLine = Math.floor(vScreenWidth / magicNumber);
  }

  // Basically a text-overflow function... but truncated text displays as a new set of tab, after 6 lines.
  DisplayTab() {
    var textString = this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Tab;
    var oString = [];
    var savedStrings = [];
    var savedStringsID = [];  // There is a chance that 1 line needs to be split in 3 or 4 parts. But all 6 strings have to be printed in sets! So ID keeps track of the sets to be pushed later.
    var charCount = 0;
    
    var currString = "";
    for(var i = 0; i < textString.length; ++i) { 

      // Reset charCount if we see \n, since it will become a newline
      if(textString[i] == '\n') {

        // If we see a \n\n, it means we should print the savedStrings before continuning.
        if(textString[i-1] == '\n') {

            oString.push("\n");

            for(var n = 1; n <= this.state.maxSavedSet; ++n) {
          
              // Push all with ID of currSavedSet first, before currSavedSet+1, currSavedSet+2 etc.
              for(var k = 0; k < savedStrings.length; ++k) {
                if(savedStringsID[k] == n)
                  oString.push(savedStrings[k]);   //shift = FIFO, instead of pop (LIFO)
              }

              if(savedStrings.length > 0) {
                oString.push("\n");
              }
            }

          charCount = 0;
          savedStrings = [];
        }
        else {
          // Print whatever we are holding on to now.
          charCount = 0;
          oString.push(currString);
          currString = "";
        }
      }

      // Line exceeded, save it for display later.
      else if(charCount > this.state.cMaxCharsPerLine) {

        // Push out the first part before handling the truncations
        oString.push(currString);
        currString = "";

        var currSavedSet = 1;
        var trucatedString = "";
        var j = i;
        charCount = 0;

        // Get all the truncated characters and store them in savedStrings
        // 6 of them should all have overflow to truncate, since 1 set is 6 lines.
        for(; textString[j] != '\n'; ++j) {
          trucatedString += textString[j];
          ++charCount;

          // Keep looping if 1 line breaks into many many pieces, with savedStringsID
          // and currSavedSet determing the order of printing out later.
          if(charCount > this.state.cMaxCharsPerLine) {
            savedStrings.push(trucatedString);
            savedStringsID.push(currSavedSet);

            currSavedSet++; 
            trucatedString = "";
            charCount = 0;
          }
        }

        savedStrings.push(trucatedString);
        savedStringsID.push(currSavedSet);

        this.state.maxSavedSet = currSavedSet;
        charCount = 0;
        i = j;
      }

      else {
        currString += textString[i];
        ++charCount;
      }
    }
    return oString.map(this.RenderTab);
  }

  RenderTab = (tabString)  => {
    return (
      <Text allowFontScaling={false} key={this.state.tabstringID++} selectable={true} style={styles.songTab}>{tabString}</Text>
    );
  }

  render(){

    // Detects if button is pressed on loads the video component
    var urlBeginning = 'https://www.youtube.com/watch?v=';
    if(Platform.OS === 'ios') {
      urlBeginning = "https://www.youtube.com/watch?v=";
    }

    urlBeginning += this.props.songs[this.state.cListDifficulty][this.state.cRiffID].YT;

    let renderVideo
    if(this.state.isPlayingVid) {
      renderVideo =  
        <View style={styles.videoView}>
        <WebView
          style={ styles.videoWebView }
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{uri: urlBeginning}}
          renderError={() => this.PlayVidError}
        />
      </View>
    }
    else {
      renderVideo = <View></View>;
    }

    let loadSpinner = <View></View>
    if(this.state.isLoading) {
      loadSpinner = 
        <View style={styles.overlaySpinner}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }

    return(
      <Container style={{width: "100%"}}>

        <Header style={styles.riffHeaderBG}>
          {commons.ChangeStatusBar()}
          <Left>
             <Button transparent title="">
             <TouchableOpacity onPress={()=>this.BackToMainMenu()}>
              <Icon name='arrow-back' style={styles.riffIcon}/>
             </TouchableOpacity>
             </Button>
          </Left>
          <Body>
            <Text allowFontScaling={false} style={styles.riffHeader}>{this.state.cDifficulty} Riffs</Text>
          </Body>
          <Right>
          </Right>
        </Header>

        <Body style={styles.riffContainer}>

          <View onLayout={e => this.onLayout(e)} style={styles.riffMainView}>
            {loadSpinner}

            <View style={styles.riffCardView}>
                {commons.GetDifficultyIconBody(this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Diff)}
                <Text style={styles.songTitle}>{this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Song}</Text>
                <Text style={styles.songArtist}>{this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Artist}</Text>     
                
                <View style={styles.songInfoTuningView}> 
                  <Text style={styles.songInfoTuningLeft}>Tuning:</Text>
                  <Text style={styles.songInfoTuning} >{this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Tune}</Text>
                </View>
                <View style={styles.songInfoKeyView}>
                  <Text style={styles.songInfoKeyLeft}>Key:</Text>
                  <Text style={styles.songInfoKey}>{this.props.songs[this.state.cListDifficulty][this.state.cRiffID].Key}</Text>
                </View>
            </View>

            <ScrollView maximumZoomScale={3} minimumZoomScale={1} style={styles.songContentScrollView}>
              <View>
                <Text style={styles.gapTab}></Text>
                {this.DisplayTab()}
                {this.DisplayNotes()}
              </View>
            </ScrollView>

            {this.ShowUnconnectedText()}
          </View>
        </Body>

        {renderVideo}
        
         <Footer style={styles.footerView}>
          <FooterTab style={styles.footerTab}>
            <Button vertical>
              <TouchableOpacity disabled={!this.state.isConnected} onPress={()=>this.TogglePlayVid()}>
                <Icon name="ios-play" style={ this.state.isConnected ? styles.riffFooterIcon : styles.riffIconDisabled}/>
                <Text allowFontScaling={false} style={styles.footerButtonText}>Listen</Text>
              </TouchableOpacity>
            </Button>

            <Button vertical>
              <TouchableOpacity disabled={!this.state.isConnected} onPress={()=>this.ToggleDispTab()} >
                <Icon name="ios-document" style={ this.state.isConnected ? styles.riffFooterIcon : styles.riffIconDisabled}/>
                <Text allowFontScaling={false} style={styles.footerButtonText}>Full Tab</Text>
              </TouchableOpacity>
            </Button>
            {this.ShowNextSongButton()}
          </FooterTab>
      </Footer>

    </Container>
    );
  }
}

const mapStateToProps = state => ({
  songs: state.songlist.songs,
  hasAds: state.songlist.hasAds
});

export default connect(mapStateToProps, {})(ScreenRiff);
AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenRiff);