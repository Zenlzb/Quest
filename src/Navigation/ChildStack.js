import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import ChildMain from "../Pages/ChildMain";

const Stack = createStackNavigator();

const ChildStack = () => {

    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Child Main" component={ChildMain}/>
        </Stack.Navigator>
    )
}

export default ChildStack;