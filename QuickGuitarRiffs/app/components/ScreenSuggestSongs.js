import React, { Component } from 'react';
import { AppRegistry, Alert, Platform, Dimensions, AsyncStorage, BackHandler, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header, Left, Right, Body, Container, Button, Picker, Icon, Item, Text, Textarea } from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import commons, {styles, androidConfig} from './common';
import database from '@react-native-firebase/database';

export default class ScreenSuggestSongs extends Component {
    constructor(props) {
        super(props);
        this.timeOut = null;
        this.state = {
            countrySelected: '',
            countryID: 0,
            countryArray: [],
            cCount: 1,
            suggestedSongs: '',
            localID: '',
            isButtonClicked: false,
            isConnected: true,

            hasCountryInput: false,
            hasSongsInput: false
        }
        this.SetCountries();
        this.LoadLocalID();
        this.LoadCountry();

        NetInfo.fetch().then(state => {
            this.state.isConnected = state.isConnected;
        });
    }

    // Whole list of countries.
    SetCountries() {
        this.state.countryArray = ["Select Country", "United States", "United Kingdom", "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.BackToMainMenu);
        NetInfo.addEventListener(state => {this.state.isConnected = state.isConnected;});
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.BackToMainMenu);
        clearTimeout(this.timeOut);
        return true;
    }

    BackToMainMenu = () => {
        this.props.navigation.navigate('ScreenMainMenu');
        return true;
    }

    handleConnectivityChange = isConnected_ => {
        this.state.isConnected = isConnected_;
    };

    /* Every user will have a unique ID for the app, stored in their phone. So,
       when they submit songs, all their entries will be saved under the user. If
       it is the first time they submit songs, an ID will be generated for them. */
       async LoadLocalID() {

        try {
            this.state.localID = await AsyncStorage.getItem('localID');
        }
        catch(error) {
        }

        if(this.state.localID == null) {

            this.state.localID = '';
            var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
            for (var i = 10; i > 0; --i)
                this.state.localID += chars[Math.floor(Math.random() * chars.length)];
            AsyncStorage.setItem('localID', this.state.localID);
        }
    }

    /* After they do the first submission, their country will be saved so that they
       do not have to reset the Country setting from the second time onwards. Because
       I want to know where they are from, but I dont want a "First Time Settings" page. */
    async LoadCountry() {
        var country_;

        try {
            country_ = await AsyncStorage.getItem('localCountry');
        }
        catch(error) {
        }

        if(country_ != null) {
            //this.state.countrySelected = country_;
            //this.state.hasCountryInput = true;
            //this.forceUpdate();
        }
    }

    // Helper function to generate the random user ID.
    RandomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i)
            result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    PickerList = (cName) => {
        return <Picker.Item style={styles.countryPickerItem} key={this.state.cCount++} label={cName} value={cName} />
    }

    CheckCountryInput(sVal) {
        this.state.countrySelected = sVal;
        if (this.state.countrySelected === "Select Country")
            this.state.hasCountryInput = false;
        else
            this.state.hasCountryInput = true;
        this.forceUpdate();
    }

    CheckSongsInput(sVal) {
        this.state.suggestedSongs = sVal;
        if (sVal.length > 0)
            this.state.hasSongsInput = true;
        else
            this.state.hasSongsInput = false;
        this.forceUpdate();
    }

    IsButtonDisabled() {
        if(this.state.isButtonClicked)
            return true;
        return (!this.state.hasCountryInput || !this.state.hasSongsInput);
    }

    SubmitSongs = () => {

        if(!this.state.isConnected) {
            commons.ShowConnectionErrorMsg();
            return;
        }

        this.state.isButtonClicked = true;
        this.forceUpdate();

        // Set a timeout in case internet has issues. (Clear after insertion, and componentWillUnmount)
        this.timeOut = setTimeout(() => {
            commons.ShowConnectionErrorMsg();
            this.state.isButtonClicked = false;
            this.forceUpdate();
            return;
        }, 9000);

        // INSERT
        var currDate = new Date();

        const newSuggestion = database().ref('/users/' + this.state.localID).push();
        newSuggestion.set ({
            date: currDate,
            country: this.state.countrySelected,
            //platform: Platform.OS === 'ios' ? "iOS" : "Android",
            suggestion: this.state.suggestedSongs
        }).then(() => {
            this.state.isButtonClicked = false;
            clearTimeout(this.timeOut);
            AsyncStorage.setItem('localCountry', this.state.countrySelected);
            this.props.navigation.navigate('ScreenSuggestConfirm');
        }).catch((error) => {
            console.log(error);
        });
    }

    ShowSpinner() {
        disp = null;

        if(this.state.isButtonClicked) {
            disp =  <View style={{paddingTop:10}}>
                        <ActivityIndicator size="small" color="#0000ff" />
                    </View>
        }
        return disp;
    }

    render() {
        return (
            <Container style={styles.pageColor}>
               <Header style={styles.menuHeaderBG}>
                    {commons.ChangeStatusBar()}
                    <Left>
                        <Button transparent title="back">
                        <TouchableOpacity onPress={() => this.BackToMainMenu()}>
                            <Icon name='arrow-back' style={styles.mainMenuIcon}/>
                        </TouchableOpacity>
                        </Button>
                    </Left>
                    <Body>
                        <Text allowFontScaling={false} style={styles.riffHeader}>Suggest Songs</Text>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Container style={styles.pageColor}>
                    <ScrollView>

                        <Text style={{ paddingTop: 5 }}></Text>

                        <Text style={styles.suggestQuestions} allowFontScaling={false} selectable={true}>Where are you from?</Text>

                        <View style={styles.suggestAnswers}>
                            <Item regular style={{borderRadius: 8}}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline"/>}
                                    placeholder={this.state.countrySelected == '' ? "Country" : this.state.countrySelected}
                                    placeholderStyle={{ color: "#BFC6EA" }}
                                    placeholderIconColor="#007AFF"
                                    style={styles.countryPicker}
                                    onValueChange={this.CheckCountryInput.bind(this)}
                                    selectedValue={this.state.countrySelected}
                                >
                                    {this.state.countryArray.map(this.PickerList)}
                                </Picker>
                            </Item>
                        </View>

                        <Text style={styles.suggestQuestions} allowFontScaling={false} selectable={true}>What artists/songs would you like to see more in Quick Guitar Riffs?</Text>

                        <View style={styles.suggestAnswers}>
                            <Textarea style={styles.suggestAnswers} maxLength={250} onChangeText={val => { this.CheckSongsInput(val) }} rowSpan={4} bordered placeholder="Songs/Artists" />
                        </View>

                        <Button dark style={styles.suggestSubmit} title="submit" disabled={this.IsButtonDisabled()} onPress={() => this.SubmitSongs()}>
                            <Text allowFontScaling={false}>Submit</Text>
                        </Button>

                        {this.ShowSpinner()}

                        </ScrollView>
                </Container>
            </Container>
        );
    }
};

AppRegistry.registerComponent('QuickGuitarRiffs', () => ScreenSuggestSongs);