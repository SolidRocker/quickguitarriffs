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
                 <Header style={styles.menuHeaderBG}>
                    {commons.ChangeStatusBar()}
                    <Left>
                    </Left>
                    <Body>
                        <Text allowFontScaling={false} style={styles.riffHeader}>Quick Guitar Riffs</Text>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 30, paddingRight: 30}}>

                        <Text allowFontScaling={false} style={styles.suggestConfirmHeader}>PURCHASE SUCCESSFUL</Text>
                        <Text style={styles.suggestConfirm}>Thank you for supporting us! We hope you enjoy using Quick Guitar Riffs! Rock on \m/</Text>

                        <Button dark style={{ alignSelf: 'center' }} title="submit" onPress={() => this.BackToMainMenu()}>
                            <Text allowFontScaling={false}>Back To Main Menu</Text>
                        </Button>
                </View>
            </Container>
        );
    }
};

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenSuggestConfirm);