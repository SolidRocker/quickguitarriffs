import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import { Root } from './app/components/router';

export default class QuickGuitarRiffs extends Component{
  render(){
    return(
        <Root/>
    );
  }
}

AppRegistry.registerComponent("QuickGuitarRiffs", () => QuickGuitarRiffs);