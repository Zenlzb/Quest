import 'react-native-gesture-handler';
import React from 'react';
import {useFonts, BalsamiqSans_400Regular as balsamiq, BalsamiqSans_700Bold as balsamiqBold} from "@expo-google-fonts/balsamiq-sans";
import AppLoading from 'expo-app-loading';
import AuthHandler from "./src/Navigation/AuthHandler";

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


