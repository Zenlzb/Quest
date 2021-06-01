import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import LoginPage from "../Pages/LoginPage";
import CreateAccount from "../Pages/CreateAccount";


const Stack = createStackNavigator();

const AuthStack = () => {

    return(
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Login Page" component={LoginPage}/>
                <Stack.Screen name="Create Account" component={CreateAccount}/>
            </Stack.Navigator>
    )
}

export default AuthStack;