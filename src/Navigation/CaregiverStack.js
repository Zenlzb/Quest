import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import CaregiverMain from "../Pages/CaregiverMain";
import CaregiverReward from "../Pages/CaregiverReward";


const Stack = createStackNavigator();

const CaregiverStack = () => {

    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: 'transparent' },
                cardOverlayEnabled: true,
                cardStyleInterpolator: ({ current: { progress } }) => ({
                    cardStyle: {
                        opacity: progress.interpolate({
                            inputRange: [0, 0.5, 0.9, 1],
                            outputRange: [0, 0.25, 0.7, 1],
                        }),
                    },
                    overlayStyle: {
                        opacity: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.5],
                            extrapolate: 'clamp',
                        }),
                    },
                }),
            }}
            mode="modal"
        >
            <Stack.Screen name="Caregiver Main" component={CaregiverMain}/>
            <Stack.Screen name="Caregiver Reward" component={CaregiverReward}/>
        </Stack.Navigator>
    )
}

export default CaregiverStack;