import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {signOut} from "../../api/auth";
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";

const ChildMain = ({name}) => {
    const handleSignOut = () => {
        signOut();
    }

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Welcome, Child {name}</Text>
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
export default ChildMain;