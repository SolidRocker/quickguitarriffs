import React from 'react';
import {Platform, StatusBar, Alert, Dimensions, StyleSheet, View, Image} from 'react-native';
import {Right, Icon} from 'native-base';

var fontHeader = "GothamNarrow-Black";
var fontSubHeader = "Gotham-Medium";
var fontTextGotham = "Gotham-Book";
var fontTextRoboto = "roboto";

var mainWhite = '#F3F5FF';
var mainRed = '#EA4335';
var mainBlack = '#08090A';
var mainGrey = '#E4E6F0';

var subRed = '#F5AD73';
var mainDarkGrey = '#B3B5BD';

const commons = {
    ChangeStatusBar() {
        return <StatusBar backgroundColor="#151515" barStyle="light-content"/>
    },

    GetStatusBarBGColor() {
        return '#353535';
    },

    GetDifficultyIconHeader(diff_, type_) {

        let instrumentIcons;
        if(type_ == 1) {
            instrumentIcons = <Image source={require("../img/guitarheadgrey.png")} style={styles.instrTypeHeader} />
        }
        else if(type_ == 2) {
            instrumentIcons = <Image source={require("../img/bassheadgrey.png")} style={styles.instrTypeHeader} />
        }
        
        let starIcons;
        if(diff_ == 1) {
        starIcons =
        <Right style={styles.iconContainer}>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
            {instrumentIcons}
        </Right>
        }
        else if(diff_ == 2) {
        starIcons =
        <Right style={styles.iconContainer}>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
            {instrumentIcons}
        </Right>
        }
        else if(diff_ == 3) {
        starIcons =
        <Right style={styles.iconContainer}>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
            {instrumentIcons}
        </Right>
        }
        return starIcons;
    },

    GetDifficultyIconBody(diff_) {
        
        let starIcons;
        if(diff_ == 1) {
        starIcons =
        <View style={styles.iconContainer}>
            <Icon style={styles.diffStarsBodyFirst} name='ios-star'/>
        </View>
        }
        else if(diff_ == 2) {
        starIcons =
        <View style={styles.iconContainer}>
            <Icon style={styles.diffStarsBodyFirst} name='ios-star'/>
            <Icon style={styles.diffStarsBody} name='ios-star'/>
        </View>
        }
        else if(diff_ == 3) {
        starIcons =
        <View style={styles.iconContainer}>
            <Icon style={styles.diffStarsBodyFirst} name='ios-star'/>
            <Icon style={styles.diffStarsBody} name='ios-star'/>
            <Icon style={styles.diffStarsBody} name='ios-star'/>
        </View>
        }
        return starIcons;
    },

    GetDataFromStorage() {
        //var storageRef = firebase.storage.ref();
        //var dataRef = storageRef.child('data/EXTEND.js');
        //var gsReference = storage.refFromURL('gs://quickguitarriffs.appspot.com/T_EXTEND.js');
        //storageRef.child('images/stars.jpg').getDownloadURL().then(function(url) {
            // `url` is the download URL for 'images/stars.jpg'
    },

    IsPortrait() {
        return Dimensions.get('window').width < Dimensions.get('window').height;
    },

    IsTablet() {
    
        var sRatio;
        // Check ratio using bigger number / smaller number.
        if(this.IsPortrait())
            sRatio = Dimensions.get('window').height / Dimensions.get('window').width;
        else
            sRatio = Dimensions.get('window').width / Dimensions.get('window').height;
        
        // Tablets are mostly at 1.6 resolution
        if(sRatio > 1.6)
            return false;
        return true;
    },

    DebugShowScreenDimension() {
        console.log("W: " + Dimensions.get('window').width);
        console.log("H: " + Dimensions.get('window').height);
    },

    GetVideoWidth() {
        if(this.IsPortrait())
            return Dimensions.get('window').width * 0.75;
        return Dimensions.get('window').height * 0.75;
    },

    GetVideoHeight() {
        if(this.IsTablet()) {
            return this.GetVideoWidth() * 0.6;
        }
        return this.GetVideoWidth() * 0.8;
    },

    ShowConnectionErrorMsg() {
        Alert.alert("Connection Error", "Oops! Please check your internet connection!");
    }
}

export const styles = StyleSheet.create({

    buttonStyle: {
         alignSelf: 'center',
         backgroundColor: mainBlack,
         color: mainBlack
    },

    splash: {
        resizeMode:'contain',
        width:'100%',
        height:'100%'
    },

    pageColor: {
        backgroundColor: mainWhite
    },

    introPageContainer: {
        backgroundColor: mainBlack,
        width:'100%',
        height: '100%',
    },

    introPageFooter: {
        backgroundColor: mainBlack,
        width: '100%',
        marginBottom: 36
    },

    introEmpty: {
        width: '100%',
    },

    introPageEmptyTop: {
        flex: 4
    },

    introPageImages: {
        //backgroundColor: mainWhite,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 5,
    },

    introPageDots: {
        //backgroundColor: mainRed,
        justifyContent: 'flex-start',
        marginTop: 40,
        flex: 1
    },

    introPageText: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        flex: 3
    },

    introPageMainImgView: {
        zIndex: 5
    },

    introPageBGImgView: {
        marginBottom: '5%'
    },

    introCircle: {
        resizeMode: "center",
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 40,
    },

    introMainImg: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        resizeMode: 'contain',

        width: '22%',
        left: '4%',
        bottom : 0,
        marginBottom: '6%'
    },

    introBGImg: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        resizeMode: 'contain',

        width: '40%',
        left: '-16%',
        bottom : 0,
        marginBottom: '2%'
    },

    introText: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
        fontFamily: fontTextGotham,
        fontSize: 20,
        color: mainWhite
    },

    introButtonNormal: {
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: mainWhite,
        backgroundColor: mainBlack,
        justifyContent: "center",
        alignItems: "center",

        paddingTop: 15,
        paddingBottom: 15,
        width: '95%'
    },

    introButtonFinal: {
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: mainRed,
        backgroundColor: mainRed,
        justifyContent: "center",
        alignItems: "center",

        paddingTop: 15,
        paddingBottom: 15,
        width: '95%'
    },

    introButtonText: {
        fontFamily: fontHeader,
        fontSize: commons.IsTablet() ? 26 : 18,
        fontWeight: 'bold',
        color: mainWhite,
        textAlign: 'center',
        alignSelf: 'stretch',
    },

    mainMenuHeaderLeft: {
        color: mainRed,
    },

    mainMenuHeaderBody: {
        alignItems:'center',
        alignSelf: 'center',
        color: mainRed
    },

    quoteContent: {
        fontFamily: fontHeader,
        fontSize: 50,
        textAlign: 'left',
        paddingHorizontal: 8,
        paddingTop: 40,
        color: mainBlack
    },

    quotePerson: {
        fontFamily: fontSubHeader,
        fontSize: 20,
        textAlign: 'left',
        paddingHorizontal: 8,
        paddingTop: 5,
        color: mainRed
    },

    mainMenuInstr: {
        fontFamily: fontTextGotham,
        fontSize: 14,
        textAlign: 'left',
        paddingHorizontal: '5%',
        paddingTop: '6%',
        paddingBottom: '4%',
        color: '#808080'
    },

    mainMenuButtonTouch: {
        //textAlign: 'left',
        flex: 1,
        flexDirection: 'column'
    },

    mainMenuButtonContainer: {
        borderRadius: 8,
        backgroundColor: mainBlack,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: '5%',
        paddingTop: '4%',
        paddingBottom: '5%'
    },

    mainMenuSubContainer: {
        flexDirection: "column",
    },

    subMenuContainer: {
        backgroundColor: mainWhite
    },

    subMenuHeader: {
        fontFamily: fontHeader,
        fontSize: 40,
        textAlign: 'left',
        paddingHorizontal: '5%',
        paddingTop: '4%',
        marginBottom: '5%',
        color: mainBlack
    },

    mainMenuButtonTextTitle: {
        color: mainWhite,
        fontFamily: fontHeader,
        fontSize: 20,
        textAlign: 'left',
        alignSelf: 'stretch',
    },

    mainMenuButtonTextDesc: {
        color: mainWhite,
        fontFamily: fontTextGotham,
        fontSize: 11,
        textAlign: 'left',
        alignSelf: 'stretch',
        flexWrap: 'wrap',
    },

    mainMenuButtonIcon: {
        //backgroundColor: mainWhite,
        position: 'absolute',
        right: 0,
        width: '20%',
        height: '180%',
    },

    riffHeaderBG: {
        backgroundColor: mainWhite
    },

    riffHeader: {
        fontFamily: fontTextRoboto,
        fontSize: Platform.OS === 'ios' ? 14 : 16,
        textAlign: Platform.OS === 'ios' ? 'center' : 'left',
        alignSelf: 'stretch',
        color: mainBlack
    },

    menuListItem: {
        width:'100%',
        height: 'auto',
        resizeMode: 'contain',
        marginLeft:0,
        paddingLeft:10,
        marginRight:0,
        paddingRight:10,
        paddingTop:0,
        paddingBottom:0,
        marginBottom: 10
    },

    subMenuListItem: {
        width:'100%',
        height: 'auto',
        resizeMode: 'contain',
        marginLeft:0,
        paddingLeft:10,
        marginRight:0,
        paddingRight:10,
        paddingTop:0,
        paddingBottom:0,
        marginBottom: 15
    },

    riffMainView: {
        flex: 1,
        backgroundColor: mainWhite
    },

    riffCardView: {
        padding: 7,
    },

    riffCard: {
        backgroundColor: '#454545',
        borderRadius: 10
    },

    songTitle:{
        fontFamily: fontTextRoboto,
        fontWeight: 'bold',
        fontSize: 26,
        paddingTop: 10,
        paddingLeft: 12,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'white',
    },

    songArtist:{
        fontFamily: fontTextRoboto,
        fontSize: 14,
        paddingBottom: 8,
        paddingLeft: 12,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'white'
    },

    songInfoTuningView: {
        flex:1,
        flexDirection:'row',
        paddingLeft: 12,
        paddingTop:10
    },

    songInfoTuning: {
        fontFamily: fontTextRoboto,
        fontSize: 15,
        textAlign: 'left',
        color: 'white'
    },

    songInfoKeyView: {
        flex:1,
        flexDirection:'row',
        paddingLeft: 12,
        paddingBottom:12
    },

    songInfoKey: {
        fontFamily: fontTextRoboto,
        fontSize: 15,
        textAlign: 'left',
        color: 'white'
    },

    gapTab:{
        marginTop: -10
    },

    songTab:{
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: commons.IsTablet() ? 15 : 12,
        fontWeight: '400',
        paddingLeft: 12,
        textAlign: 'left',
        alignSelf: 'flex-start',
        color: 'black',
    },

    songTabNotes:{
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: commons.IsTablet() ? 13 : 11,
        fontWeight: '400',
        paddingTop: 2,
        paddingLeft: 12,
        paddingRight: 15,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'black',
    },

    videoView:{
        height: commons.GetVideoHeight(),
        width: commons.GetVideoWidth(),
        paddingLeft: 12,
        paddingBottom: 10,
        backgroundColor: mainWhite
    },

    videoWebView: {
        marginTop: (Platform.OS == 'ios') ? 20 : 0,
        width: commons.GetVideoWidth()
    },

    tabWebView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        marginTop: (Platform.OS) === 'ios' ? 20 : 0
    },

    chooselist_main: {
        backgroundColor: mainWhite
    },

    chooselist_artist: {
        backgroundColor: mainGrey,
        color: mainWhite,
        height: '130%'
    },

    chooselist_artistName: {
        fontFamily: fontTextRoboto,
        fontSize: Platform.OS === 'ios' ? 12 : 14,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'grey',
    },

    chooselist_songItem: {
        backgroundColor: mainWhite
    },

    chooselist_songName: {
        fontFamily: fontTextRoboto,
        fontSize: 14,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'black'
    },

    diffStarsHeader: {
        color: 'grey',
        fontSize: 14
    },

    instrTypeHeader: {
        width: 16,
        height: 16,
        marginLeft: 10,
        resizeMode: 'stretch'
    },

    diffStarsBodyFirst: {
        fontFamily: fontTextRoboto,
        fontSize: 14,
        paddingBottom: 15,
        paddingLeft: 12,
        alignSelf: 'flex-start',
        textAlign: 'left',
        color: 'white'
    },

    diffStarsBody: {
        fontFamily: fontTextRoboto,
        fontSize: 14,
        color: 'white'
    },

    riffIcon: {
        alignSelf: 'center',
        color: mainRed
    },

    riffIconDisabled: {
        alignSelf: 'center',
        color: '#808080'
    },

    footerTab: {
        backgroundColor: commons.GetStatusBarBGColor()
    },

    footerButtonText: {
        fontFamily: fontTextRoboto,
        fontSize: 11,
        color: 'white'
    },

    iconContainer: {
        flexDirection: 'row'
    },

    packMainContainer: {
        backgroundColor: mainWhite
    },

    packContainer: {
        marginTop: 20,
        backgroundColor: mainWhite
    },

    packButtonContainer: {
        borderRadius: 8,
        backgroundColor: mainBlack,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: '90%',
        paddingVertical: 12,
        marginBottom: 12
    },

    packDescView: {
        marginTop: 15,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },

    packDescText: {
        textAlign: 'center',
        fontFamily: fontTextRoboto,
        fontSize: 15,
        color: 'black'
    },

    packButton: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    packButtonBG: {
        flex:1,
        width:'100%',
        height:'100%'
    },

    packButtonIcon: {
        alignSelf: 'center',
    },

    packButtonTitle: {
        marginTop: 5,
        alignSelf: 'center',
        fontFamily: fontHeader,
        fontSize: commons.IsTablet() ? 50 : 25,
        color: mainWhite
    },

    packButtonText: {
        alignSelf: 'center',
        fontFamily: fontTextGotham,
        fontSize: commons.IsTablet() ? 22 : 12,
        color: '#E2E2E2',
        textAlign: 'center'
    },

    packButtonCost_NotBought: {
        alignSelf: 'center',
        fontSize: commons.IsTablet() ? 30 : 20,
        fontWeight: 'bold',
        color: mainGrey,
        textAlign: 'center'
    },

    packButtonCost_Bought: {
        alignSelf: 'center',
        fontSize: commons.IsTablet() ? 30 : 20,
        fontWeight: 'bold',
        color: subRed,
        textAlign: 'center'
    },

    packError: {
        alignSelf: 'center',
        padding: 30,
        textAlign: 'center'
    },

    libViewContainer: {
        backgroundColor: mainWhite,
        flex: 1
    },

    libViewButton: {
        borderRadius: 8,
        backgroundColor: mainRed,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 18,
        paddingBottom: 20,
        marginHorizontal: 20,
    },

    libViewButtonDisabled: {
        borderRadius: 8,
        backgroundColor: mainDarkGrey,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 18,
        paddingBottom: 20,
        marginHorizontal: 20,
    },

    libViewButtonText: {
        fontFamily: fontHeader,
        fontSize: Platform.OS === 'ios' ? 14 : 18,
        fontWeight: 'bold',
        color: mainWhite
    },

    libView: {
        flex: 1,
        flexDirection:'row',
        paddingLeft: 30,
        paddingRight: 30,
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    },

    libArtist: {
        fontFamily: fontTextRoboto,
        fontSize: Platform.OS === 'ios' ? 12 : 14,
        fontWeight: 'bold',
        
        textAlign: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        //color: '#EB9800',
        color: mainRed,

        paddingLeft: 5,
        paddingTop: 4,
        paddingBottom: 4,

        borderStyle: 'solid',
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: Platform.OS === 'ios' ? 0 : 1,
    },

    libSong: {
        fontFamily: fontTextRoboto,
        fontSize: Platform.OS === 'ios' ? 12 : 14,
        textAlign: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        color: 'black',

        paddingLeft: 5,
        paddingTop: 4,
        paddingBottom: 4,

        borderStyle: 'solid',
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: Platform.OS === 'ios' ? 0 : 1,
    },

    libDesc: {
        fontFamily: fontTextRoboto,
        fontSize: commons.IsTablet() ? 20 : 16,

        textAlign: 'center',
        alignSelf: 'stretch',
        color: mainBlack,

        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 20,
        //backgroundColor: '#454545'
    },

    countryPicker: {
        width: Dimensions.get('window').width-25,
        borderRadius: 8
    },

    countryPickerItem: {
        backgroundColor: mainWhite
    },

    suggestQuestions: {
        fontFamily: fontTextRoboto,
        fontSize: 15,
        paddingTop: 10,
        paddingLeft: 12,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'black',
    },

    suggestAnswers: {
        borderRadius: 8,
        paddingTop: 10,
        paddingBottom: 15,
        paddingLeft: 12,
        paddingRight: 12,
        alignSelf: 'stretch',
        overflow: 'hidden'
    },

    suggestConfirmView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: mainWhite
    },

    suggestConfirmHeader: {
        fontFamily: fontTextRoboto,
        fontSize: 40,
        textAlign: 'center',
        alignSelf: 'stretch',
        color: 'black'
    },

    suggestConfirm: {
        fontFamily: fontTextRoboto,
        fontSize: 15,
        paddingTop: 30,
        paddingBottom: 40,
        textAlign: 'center',
        alignSelf: 'stretch',
        color: 'black'
    },

    submitted: {
        fontFamily: fontTextRoboto,
        fontSize: 15,
        paddingTop: 3,
        paddingBottom: 14,
        paddingLeft: 12,
        textAlign: 'center',
        alignSelf: 'stretch',
        color: 'red'
    },

    sidebarText: {
        fontFamily: fontTextRoboto,
        fontSize: 14,
    },

    noConnection: {
        fontFamily: fontTextRoboto,
        fontSize: 12,
        textAlign: 'center',
        alignSelf: 'stretch',
        color: 'white',
        backgroundColor: 'red',
        paddingTop: 3,
        paddingBottom: 3
    },

    overlaySpinner: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default commons;