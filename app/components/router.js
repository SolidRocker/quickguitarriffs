import {StackNavigator, DrawerNavigator} from 'react-navigation';

import ScreenSplash from './ScreenSplash';
import ScreenMainMenu from './ScreenMainMenu';
import ScreenRiff from './ScreenRiff';
import ScreenChooseList from './ScreenChooseList';
import ScreenFullTab from './ScreenFullTab';
import ScreenViewLibrary from './ScreenViewLibrary';
import ScreenSuggestSongs from './ScreenSuggestSongs';
import ScreenSuggestConfirm from './ScreenSuggestConfirm';
import ScreenAfterBuy from './ScreenAfterBuy';

const RightTransition = (index, position, width) => {
  const sceneRange = [index-1, index, index+1];
  const outputWidth = [width, 0, 0];
  const transition = position.interpolate({
    inputRange: sceneRange,
    outputRange: outputWidth,
  });

  return {
    transform: [{translateX : transition}]
  }
}

const NavigationConfig = () => {
  return {
    screenInterpolator:(sceneProps) => {
      const position = sceneProps.position;
      const scene = sceneProps.scene;
      const index = scene.index;
      const width = sceneProps.layout.initWidth;

      return RightTransition(index, position, width);
    }
  }
}

export const Root = StackNavigator({
  ScreenSplash: {screen: ScreenSplash},
  ScreenMainMenu: {screen: ScreenMainMenu},
  ScreenRiff: {screen: ScreenRiff},
  ScreenChooseList: {screen: ScreenChooseList},
  ScreenFullTab: {screen: ScreenFullTab},
  ScreenViewLibrary: {screen: ScreenViewLibrary},
  ScreenSuggestSongs: {screen: ScreenSuggestSongs},
  ScreenSuggestConfirm: {screen: ScreenSuggestConfirm},
  ScreenAfterBuy: {screen: ScreenAfterBuy},
},
{
  mode: 'modal',
  headerMode: 'none',
  transitionConfig: NavigationConfig
}
);