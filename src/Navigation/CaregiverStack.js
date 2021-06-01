import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import CaregiverMain from "../Pages/CaregiverMain";

const Stack = createStackNavigator();

const CaregiverStack = () => {

    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Caregiver Main" component={CaregiverMain}/>
        </Stack.Navigator>
    )
}

export default CaregiverStack;