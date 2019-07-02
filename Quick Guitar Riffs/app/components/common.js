import React from 'react';
import {Platform, StatusBar, Alert, Dimensions, StyleSheet, View} from 'react-native';
import {Right, Icon} from 'native-base';

const commons = {
    ChangeStatusBar() {
        return <StatusBar backgroundColor="#151515" barStyle="light-content"/>
    },

    GetStatusBarBGColor() {
        return '#353535';
    },

    GetDifficultyIconHeader(diff_) {
        
        let starIcons;
        if(diff_ == 1) {
        starIcons =
        <Right style={styles.iconContainer}>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
        </Right>
        }
        else if(diff_ == 2) {
        starIcons =
        <Right style={styles.iconContainer}>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
        </Right>
        }
        else if(diff_ == 3) {
        starIcons =
        <Right style={styles.iconContainer}>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
            <Icon style={styles.diffStarsHeader} name='ios-star'/>
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
    splash: {
        resizeMode:'contain',
        width:'100%',
        height:'100%'
    },

    riffHeaderBG: {
        backgroundColor: commons.GetStatusBarBGColor()
    },

    riffHeader: {
        fontFamily: "Roboto",
        fontSize: Platform.OS === 'ios' ? 14 : 16,
        textAlign: Platform.OS === 'ios' ? 'center' : 'left',
        alignSelf: 'stretch',
        color: 'white'
    },

    menuListItem: {
        width:'100%',
        marginLeft:0,
        paddingLeft:0,
        marginRight:0,
        paddingRight:0,
        paddingTop:0,
        paddingBottom:0
    },

    riffCardView: {
        padding: 7,
    },

    riffCard: {
        backgroundColor: '#454545',
    },

    songTitle:{
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontSize: 26,
        paddingTop: 10,
        paddingLeft: 12,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'white',
    },

    songArtist:{
        fontFamily: 'Roboto',
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
        fontFamily: 'Roboto',
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
        fontFamily: 'Roboto',
        fontSize: 15,
        textAlign: 'left',
        color: 'white'
    },

    gapTab:{
        paddingTop: 10
    },

    songTab:{
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: commons.IsTablet() ? 15 : 12,
        fontWeight: '400',
        paddingTop: 2,
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

    chooselist_artistName: {
        fontFamily: "Roboto",
        fontSize: Platform.OS === 'ios' ? 12 : 14,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'grey'
    },

    chooselist_songName: {
        fontFamily: "Roboto",
        fontSize: 14,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'black'
    },

    diffStarsHeader: {
        color: 'grey',
        fontSize: 14
    },

    diffStarsBodyFirst: {
        fontFamily: 'Roboto',
        fontSize: 14,
        paddingBottom: 15,
        paddingLeft: 12,
        alignSelf: 'flex-start',
        textAlign: 'left',
        color: 'white'
    },

    diffStarsBody: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: 'white'
    },

    riffIcon: {
        alignSelf: 'center',
        color: '#EB9800'
    },

    riffIconDisabled: {
        alignSelf: 'center',
        color: '#808080'
    },

    footerTab: {
        backgroundColor: commons.GetStatusBarBGColor()
    },

    footerButtonText: {
        fontFamily: 'Roboto',
        fontSize: 11,
        color: 'white'
    },

    iconContainer: {
        flexDirection: 'row'
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
        fontFamily: 'Roboto',
        fontSize: 15,
        color: 'black'
    },

    packButton: {
        height: '50%',
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
        fontFamily: 'Roboto',
        fontSize: 30,
        color: 'white'
    },

    packButtonText: {
        alignSelf: 'center',
        fontSize: 14,
        color: '#E2E2E2',
        textAlign: 'center'
        
    },

    packButtonCost_NotBought: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E2E2E2',
        textAlign: 'center'
    },

    packButtonCost_Bought: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFC33D',
        textAlign: 'center'
    },

    packError: {
        alignSelf: 'center',
        padding: 30,
        textAlign: 'center'
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
        fontFamily: "Roboto",
        fontSize: Platform.OS === 'ios' ? 12 : 14,
        fontWeight: 'bold',
        
        textAlign: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        color: '#EB9800',

        paddingLeft: 5,
        paddingTop: 4,
        paddingBottom: 4,

        borderStyle: 'solid',
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: Platform.OS === 'ios' ? 0 : 1,
    },

    libSong: {
        fontFamily: "Roboto",
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
        fontFamily: "Roboto",
        fontSize: commons.IsTablet() ? 20 : 16,

        textAlign: 'center',
        alignSelf: 'stretch',
        color: 'black',

        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 20,
        //backgroundColor: '#454545'
    },

    suggestQuestions: {
        fontFamily: 'Roboto',
        fontSize: 15,
        paddingTop: 10,
        paddingLeft: 12,
        textAlign: 'left',
        alignSelf: 'stretch',
        color: 'black'
    },

    suggestAnswers: {
        paddingTop: 10,
        paddingBottom: 15,
        paddingLeft: 12,
        paddingRight: 12,
        alignSelf: 'stretch',
    },

    suggestConfirmHeader: {
        fontFamily: 'Roboto',
        fontSize: 40,
        textAlign: 'center',
        alignSelf: 'stretch',
        color: 'black'
    },

    suggestConfirm: {
        fontFamily: 'Roboto',
        fontSize: 15,
        paddingTop: 30,
        paddingBottom: 40,
        textAlign: 'center',
        alignSelf: 'stretch',
        color: 'black'
    },

    submitted: {
        fontFamily: 'Roboto',
        fontSize: 15,
        paddingTop: 3,
        paddingBottom: 14,
        paddingLeft: 12,
        textAlign: 'center',
        alignSelf: 'stretch',
        color: 'red'
    },

    sidebarText: {
        fontFamily: 'Roboto',
        fontSize: 14,
    },

    noConnection: {
        fontFamily: 'Roboto',
        fontSize: 12,
        textAlign: 'center',
        alignSelf: 'stretch',
        color: 'white',
        backgroundColor: 'red',
        paddingTop: 3,
        paddingBottom: 3
    }
});

export default commons;