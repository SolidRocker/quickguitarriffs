import {createStackNavigator} from 'react-navigation-stack';

import ScreenSplash from './ScreenSplash';
import ScreenFirstUse from './ScreenFirstUse';
import ScreenMainMenu from './ScreenMainMenu';
import ScreenSubMenu from './ScreenSubMenu';
import ScreenRiff from './ScreenRiff';
//import ScreenChooseList from './ScreenChooseList';
import ScreenFullTab from './ScreenFullTab';
import ScreenViewLibraryPacks from './ScreenViewLibraryPacks';
import ScreenViewLibrary from './ScreenViewLibrary';
import ScreenSuggestSongs from './ScreenSuggestSongs';
import ScreenSuggestConfirm from './ScreenSuggestConfirm';
import ScreenAfterBuy from './ScreenAfterBuy';
import { createAppContainer } from 'react-navigation';

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

let SlideFromRight = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0]
  })
  const slideFromRight = { transform: [{ translateX }] }
  return slideFromRight;
};

const NavigationConfig = () => {
  /*return {
    screenInterpolator:(sceneProps) => {
      const position = sceneProps.position;
      const scene = sceneProps.scene;
      const index = scene.index;
      const width = sceneProps.layout.initWidth;

      return RightTransition(index, position, width);
    }
  }*/
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        collapseExpand: CollapseExpand(index, position),
        default: SlideFromRight(index, position, width),
      }[transition];
    },
  }
}

const RootStack = createStackNavigator(
  {
    ScreenSplash: {screen: ScreenSplash},
    ScreenFirstUse: {screen: ScreenFirstUse},
    ScreenMainMenu: {screen: ScreenMainMenu},
    ScreenSubMenu: {screen: ScreenSubMenu},
    ScreenRiff: {screen: ScreenRiff},
    //ScreenChooseList: {screen: ScreenChooseList},
    ScreenFullTab: {screen: ScreenFullTab},
    ScreenViewLibraryPacks: {screen: ScreenViewLibraryPacks},
    ScreenViewLibrary: {screen: ScreenViewLibrary},
    ScreenSuggestSongs: {screen: ScreenSuggestSongs},
    ScreenSuggestConfirm: {screen: ScreenSuggestConfirm},
    ScreenAfterBuy: {screen: ScreenAfterBuy}
  },
  {
    mode: 'card',
    headerMode: 'none',
    initialRouteName: 'ScreenSplash',
    transitionConfig: NavigationConfig
  }
);

const Root = createAppContainer(RootStack);
export default Root;