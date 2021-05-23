import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import LoginPage from "../Pages/Login Page";
import CaregiverMain from "../Pages/Caregiver Main";
import ChildMain from "../Pages/Child Main";
import CreateAccount from "../Pages/Create Account";


const Stack = createStackNavigator();

const AuthStack = () => {

    return(
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Login Page" component={LoginPage}/>
                <Stack.Screen name="Caregiver Main" component={CaregiverMain}/>
                <Stack.Screen name="Child Main" component={ChildMain}/>
                <Stack.Screen name="Create Account" component={CreateAccount}/>
            </Stack.Navigator>
    )
}

export default AuthStack;