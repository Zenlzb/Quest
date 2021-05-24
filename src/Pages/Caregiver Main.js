import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import CustomButton from "../Components/Button";
import {auth, signOut} from "../../api/auth";
import colors from "../../assets/themes/colors";

const CaregiverMain = () => {
    const handleSignOut = () => {
        signOut();
    }

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Welcome, Caregiver {auth.currentUser.displayName}</Text>
            <CustomButton
                buttonStyle={styles.button}
                textStyle={{fontFamily: 'balsamiq'}}
                onPress={handleSignOut}
            >Sign Out</CustomButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq'
    },
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    }
})

export default CaregiverMain;