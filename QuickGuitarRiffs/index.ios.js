import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './app/redux/store';
import {AppRegistry} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Root from './app/components/router';

export default class QuickGuitarRiffs extends Component{
  render(){
    return(
      <Provider store={store}>
          <Root />
      </Provider>
    );
  }
}

AppRegistry.registerComponent("QuickGuitarRiffs", () => QuickGuitarRiffs);