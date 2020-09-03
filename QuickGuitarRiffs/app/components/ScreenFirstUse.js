import React, {Component} from 'react';
import {AppRegistry, Image, Animated, TouchableOpacity, Dimensions} from 'react-native';
import commons, {styles} from './common';
import Dots from 'react-native-dots-pagination';
import { Container, View, Body, Footer, Text } from 'native-base';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

export default class ScreenFirstUse extends Component{

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            maxPage: 3,

            mainFadeValue: new Animated.Value(0.5),
            mainMoveValue: new Animated.Value(0),
            subFadeValue: new Animated.Value(0.5),
            subMoveValue: new Animated.Value(0),

            hasInit: false,
            isFadeIn: true,
            
            prevBGTrans: 0.0,
            prevMainTrans: 0.0,
            BGTrans: 0.0,
            mainTrans: 0.0
        }
    }

    InitAnim() {
        if(!this.state.hasInit) {
            this.setState({hasInit: true}, function() {
                this.ChangePage();
            });
        }
    }

    GetMainImg() {
        if(this.state.currentPage == 1) {
            return require('../img/IntroScreen/Intro_1_1.png');
        }
        else if(this.state.currentPage == 2) {
            return require('../img/IntroScreen/Intro_2_1.png');
        }
        return require('../img/IntroScreen/Intro_3_1.png');
    }

    GetBGImg() {
        if(this.state.currentPage == 1) {
            return require('../img/IntroScreen/Intro_1_2.png');
        }
        else if(this.state.currentPage == 2) {
            return require('../img/IntroScreen/Intro_2_2.png');
        }
        return require('../img/IntroScreen/Intro_3_2.png');
    }

    GetText() {
        if(this.state.currentPage == 1) {
            return "Learn and play the defining parts of your favorite songs";
        }
        if(this.state.currentPage == 2) {
            return "Enhance your warm-up routine with a wider variety of selections";
        }
        return "Discover new songs with killer riffs!";
    }

    GetButtonStyle() {
        if(this.state.currentPage == this.state.maxPage) {
            return styles.introButtonFinal;
        }
        return styles.introButtonNormal;
    }

    GetButtonText() {
        if(this.state.currentPage == this.state.maxPage) {
            return "Get Started";
        }
        return "Next";
    }

    onSwipeLeft(gestureState) {
        this.ChangePage();
    }

    ChangePage() {

        if(this.state.currentPage == this.state.maxPage && !this.state.isFadeIn) {
            this.props.navigation.navigate('ScreenMainMenu');
        }
        else {
            let mainTrans_ = Dimensions.get('window').width * -0.3;
            let BGTrans_ = Dimensions.get('window').width * -0.08;

            this.setState({
                prevBGTrans: this.state.BGTrans,
                prevMainTrans: this.state.mainTrans,
                BGTrans: BGTrans_,
                mainTrans: mainTrans_
            }, this.AnimateScreen());
        }
    }

    ShowScreen() {

        let disp = 
        <View style={styles.introPageImages}>
            <Image source={require('../img/IntroScreen/redCircle.png')} style={styles.introCircle}/>

            <Animated.View style={
                styles.introPageBGImgView,
                {opacity: this.state.subFadeValue,
                transform: [
                    {
                        translateX: this.state.subMoveValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, this.state.BGTrans]
                        })
                    }
                ]}}>
                <Image source={this.GetBGImg()} style={styles.introBGImg} />
            </Animated.View>

            <Animated.View style={
                styles.introPageMainImgView,
                {opacity: this.state.mainFadeValue,
                transform: [
                    {
                        translateX: this.state.mainMoveValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, this.state.mainTrans]
                        })
                    }
                ]}}>
                <Image source={this.GetMainImg()} style={styles.introMainImg} />
            </Animated.View>
        </View>

        return disp;
    }

    AnimateScreen = () => {

        var fadeToValue = this.state.isFadeIn ? 1 : 0;
        var moveToValue = this.state.isFadeIn ? 1 : 2;
        var AnimFadeDuration = this.state.isFadeIn ? 300 : 250;
        var AnimMoveDuration = this.state.isFadeIn ? 400 : 350;

        Animated.parallel([
            Animated.timing(this.state.mainFadeValue, {
                toValue: fadeToValue,
                duration: AnimFadeDuration,
                useNativeDriver: true
            }),
            Animated.timing(this.state.mainMoveValue, {
                toValue : moveToValue,
                duration : AnimMoveDuration,
                useNativeDriver: true
            }),
            Animated.timing(this.state.subFadeValue, {
                toValue: fadeToValue,
                duration: AnimFadeDuration,
                useNativeDriver: true
            }),
            Animated.timing(this.state.subMoveValue, {
                toValue : moveToValue,
                duration : AnimMoveDuration,
                useNativeDriver: true
            })
        ]).start(() => {
            if(this.state.isFadeIn) {
                this.setState({isFadeIn : false});
            }
            else if(this.state.hasInit && !this.state.isFadeIn) {
                this.state.subMoveValue.setValue(0);
                this.state.mainMoveValue.setValue(0);
                this.setState({
                    isFadeIn: true,
                    currentPage: this.state.currentPage + 1
                }, this.ChangePage);
            }
        });
    }

    render() {

        const swipeConfig = {
            velocityThreshold: 0.05,
            directionalOffsetThreshold: 80
        };

        return(
            <GestureRecognizer
                onSwipeUp={(state) => this.onSwipeLeft(state)}
                onSwipeDown={(state) => this.onSwipeLeft(state)}
                onSwipeLeft={(state) => this.onSwipeLeft(state)}
                config={swipeConfig}
                style={styles.introPageContainer}>

                <Body>
                    <View>
                        <View style={styles.introPageEmptyTop}>
                            <Text></Text>
                        </View>

                        {this.ShowScreen()}
                        
                        <View style={styles.introPageDots}>
                            <Dots length={3} active={this.state.currentPage-1} activeDotWidth={10} activeDotHeight={10} activeColor="#EA4335"/>
                        </View>

                        <View style={styles.introPageText}>   
                            <Text style={styles.introText}>{this.GetText()}</Text>
                        </View>
                    </View>
                </Body>
                
                <Footer style={styles.introPageFooter}>
                    <TouchableOpacity style={this.GetButtonStyle()} onPress={()=>this.ChangePage()}>
                        <Text style={styles.introButtonText}>{this.GetButtonText()}</Text>
                    </TouchableOpacity>
                </Footer>

                {this.InitAnim()}

            </GestureRecognizer>
        );
    }
};

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenFirstUse);