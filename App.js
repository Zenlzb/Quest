import 'react-native-gesture-handler';
import React from 'react';
import {useFonts, BalsamiqSans_400Regular as balsamiq, BalsamiqSans_700Bold as balsamiqBold} from "@expo-google-fonts/balsamiq-sans";
import AppLoading from 'expo-app-loading';
import {NavigationContainer} from "@react-navigation/native";
import Navigator from "./src/Navigation";

export default function App() {

  let [fontsLoaded] = useFonts({
    balsamiq, balsamiqBold
  })

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>

  );
};


