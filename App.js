import 'react-native-gesture-handler';
import React from 'react';
import {useFonts, BalsamiqSans_400Regular as balsamiq, BalsamiqSans_700Bold as balsamiqBold} from "@expo-google-fonts/balsamiq-sans";
import AppLoading from 'expo-app-loading';
import AuthHandler from "./src/Navigation/AuthHandler";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);
LogBox.ignoreLogs(['Warning: Can\'t perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.']);

export default function App() {
  let [fontsLoaded] = useFonts({
    balsamiq, balsamiqBold
  })

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
      <AuthHandler/>
  );
};


