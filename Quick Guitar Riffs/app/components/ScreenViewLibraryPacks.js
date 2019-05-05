import React, { Component } from 'react';
import { AppRegistry, Alert, BackHandler, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Left, Right, Body, Container, Button, Icon, Text } from 'native-base';
import commons, {styles} from './common';
import * as RNIap from 'react-native-iap';

export default class ScreenViewLibrary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pack1_price: "",
            pack2_price: "",
        }
    }

    componentDidMount() {
        RNIap.initConnection();
        BackHandler.addEventListener('hardwareBackPress', this.BackToMainMenu);
        return true;
    }

    componentWillUnmount() {
        this.IAP_EndConnection();
        BackHandler.removeEventListener('hardwareBackPress', this.BackToMainMenu);
        return true;
    }

    async IAP_GetProductCost() {

        try {
            const products = await RNIap.getProducts();
            products.forEach(product => {

                if (product.productId === 'com.hugewall.quickguitarriffs.unlockall') {
                    this.setState({pack1_price: product.localizedPrice});
                }
                if (product.productId === 'com.hugewall.quickguitarriffs.pack2') {
                    this.setState({pack2_price: product.localizedPrice});
                }
            })
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
            //Alert.alert(err.message);
        }
    }
    
    IAP_EndConnection() {
        RNIap.endConnection();
    }

    BackToMainMenu = () => {
        this.props.navigation.navigate('ScreenMainMenu');
        return true;
    }

    GoToLib = (pack) => {
        this.props.navigation.navigate('ScreenViewLibrary', {rPackID : pack});
        return true;
    }

    render() {
        return (
            <Container>
               <Header style={styles.riffHeaderBG}>
                    {commons.ChangeStatusBar()}
                    <Left>
                        <Button transparent title="back">
                        <TouchableOpacity onPress={() => this.BackToMainMenu()}>
                            <Icon name='arrow-back' style={styles.riffIcon}/>
                        </TouchableOpacity>
                        </Button>
                    </Left>
                    <Body>
                        <Text allowFontScaling={false} style={styles.riffHeader}>View Library</Text>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Container>
                    <Button style={[styles.packButton, {backgroundColor: '#EB9361'}]} onPress={()=>this.GoToLib(1)} vertical>
                        <Text style={styles.packButtonTitle}>THE ESSENTIAL PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>130 Songs</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>{this.state.pack1_price}</Text>
                    </Button>

                    <Button style={[styles.packButton, {backgroundColor: '#A0C3EE'}]}  onPress={()=>this.GoToLib(2)} vertical>
                        <Text style={styles.packButtonTitle}>EXTENDED PACK</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>60 Songs</Text>
                        <Text allowFontScaling={false} style={styles.packButtonText}>{this.state.pack2_price}</Text>
                    </Button>
                </Container>
            </Container>
        );
    }
};

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenViewLibraryPacks);