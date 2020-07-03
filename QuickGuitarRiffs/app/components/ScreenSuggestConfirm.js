import React, { Component } from 'react';
import { AppRegistry, BackHandler, View } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Text } from 'native-base';
import commons, { styles } from './common';

export default class ScreenSuggestConfirm extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.BackToMainMenu);
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.BackToMainMenu);
        return true;
    }

    BackToMainMenu = () => {
        this.props.navigation.navigate('ScreenMainMenu');
        return true;
    }

    render() {
        return (
            <Container>
                 <Header style={styles.riffHeaderBG}>
                    {commons.ChangeStatusBar()}
                </Header>

                <View style={styles.suggestConfirmView}>
                    <Text allowFontScaling={false} style={styles.suggestConfirmHeader}>SENT SUCCESSFULLY</Text>
                    <Text style={styles.suggestConfirm}>We've received your song suggestion! Thank you and hope you continue to enjoy Quick Guitar Riffs! Rock on \m/</Text>

                    <Button dark style={{ alignSelf: 'center', borderRadius: 10 }} title="submit" onPress={() => this.BackToMainMenu()}>
                        <Text allowFontScaling={false}>Back To Main Menu</Text>
                    </Button>
                </View>
            </Container>
        );
    }
};

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenSuggestConfirm);