import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import LoginPage from "../Pages/Login Page";
import CaregiverMain from "../Pages/Caregiver Main";

const Stack = createStackNavigator();

const Navigator = () => {

    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login Page" component={LoginPage}/>
            <Stack.Screen name="Caregiver Main" component={CaregiverMain}/>
        </Stack.Navigator>
    )
}

export default Navigator;