import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './app/redux/store';
import {AppRegistry} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Root } from './app/components/router';

import ScreenSplash from './app/components/ScreenSplash';
import ScreenMainMenu from './app/components/ScreenMainMenu';
import ScreenSubMenu from './app/components/ScreenSubMenu';
import ScreenRiff from './app/components/ScreenRiff';
import ScreenChooseList from './app/components/ScreenChooseList';
import ScreenFullTab from './app/components/ScreenFullTab';
import ScreenViewLibraryPacks from './app/components/ScreenViewLibraryPacks';
import ScreenViewLibrary from './app/components/ScreenViewLibrary';
import ScreenSuggestSongs from './app/components/ScreenSuggestSongs';
import ScreenSuggestConfirm from './app/components/ScreenSuggestConfirm';
import ScreenAfterBuy from './app/components/ScreenAfterBuy';

const Stack = createStackNavigator();

export default class QuickGuitarRiffs extends Component{
  render() {
    return(
      <Provider store={store}>
        <NavigationContainer>
          {/*<Root/>*/}
          <Stack.Navigator
              mode='card'
              backgroundColor='transparent'
              headerMode='none'
              initialRouteName='ScreenSplash'
              //transitionConfig: NavigationConfig
          >
            <Stack.Screen name="ScreenSplash" component={ScreenSplash} />
            <Stack.Screen name="ScreenMainMenu" component={ScreenMainMenu} />
            <Stack.Screen name="ScreenSubMenu" component={ScreenSubMenu} />
            <Stack.Screen name="ScreenRiff" component={ScreenRiff} />
            <Stack.Screen name="ScreenChooseList" component={ScreenChooseList} />
            <Stack.Screen name="ScreenFullTab" component={ScreenFullTab} />
            <Stack.Screen name="ScreenViewLibraryPacks" component={ScreenViewLibraryPacks} />
            <Stack.Screen name="ScreenViewLibrary" component={ScreenViewLibrary} />
            <Stack.Screen name="ScreenSuggestSongs" component={ScreenSuggestSongs} />
            <Stack.Screen name="ScreenSuggestConfirm" component={ScreenSuggestConfirm} />
            <Stack.Screen name="ScreenAfterBuy" component={ScreenAfterBuy} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

AppRegistry.registerComponent("QuickGuitarRiffs", () => QuickGuitarRiffs);