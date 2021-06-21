import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import ChildMain from "../Pages/ChildMain";
import ChildReward from "../Pages/ChildReward";

const Stack = createStackNavigator();
export const AppContext = React.createContext('');

const ChildMainWrapper = (props) => {
    return(
        <AppContext.Consumer>
            {(data) => <ChildMain name={data} navigation={props.navigation} route={props.route}/>}
        </AppContext.Consumer>
    )
}

const ChildStack = () => {

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
            <Stack.Screen name="Child Main" component={ChildMainWrapper}/>
            <Stack.Screen name="Child Reward" component={ChildReward}/>
        </Stack.Navigator>
    )
}

export default ChildStack;