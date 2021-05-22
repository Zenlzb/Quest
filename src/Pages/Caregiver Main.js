import React from 'react';
import {View, Text} from "react-native";

const CaregiverMain = ({route}) => {
    return(
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{route.params.user.displayName}</Text>
        </View>
    )
}

export default CaregiverMain;