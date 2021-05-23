import React from 'react';
import {View, Text} from "react-native";
import CustomButton from "../Components/Button";
import {auth, signOut} from "../../api/auth";
import colors from "../../assets/themes/colors";

const CaregiverMain = () => {
    const handleSignOut = () => {
        signOut();
    }

    return(
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{auth.currentUser.displayName}</Text>
            <CustomButton
                buttonStyle={{
                    backgroundColor: colors.button1,
                    justifyContent: 'center',
                }}
                textStyle={{fontFamily: 'balsamiq'}}
                onPress={handleSignOut}
            >Sign Out</CustomButton>
        </View>
    )
}

export default CaregiverMain;