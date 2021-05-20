import React from 'react';
import LoginPage from "./src/Pages/Login Page";
import {useFonts, BalsamiqSans_400Regular as balsamiq, BalsamiqSans_700Bold as balsamiqBold} from "@expo-google-fonts/balsamiq-sans";
import AppLoading from 'expo-app-loading';

export default function App() {

  let [fontsLoaded] = useFonts({
    balsamiq, balsamiqBold
  })

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
      <LoginPage/>
  );
};


