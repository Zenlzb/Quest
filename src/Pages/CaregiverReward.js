import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import colors from "../../assets/themes/colors";
import CustomButton from "../Components/Button";

const CaregiverReward = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={[styles.text, {fontSize: 40}]}>Rewards</Text>
                <CustomButton
                    buttonStyle={[styles.button, {marginLeft: 8, height: 25, marginTop: 21}]}
                    textStyle={[styles.text, {paddingVertical: 1, fontSize: 17}]}
                    onPress={() => {navigation.navigate('Caregiver Main')}}
                >Main ></CustomButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        backgroundColor: colors.background,
        alignItems: 'center',
        width: '100%'
    },
    titleContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        marginTop: 45
    },
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq',
        textAlign: 'center'
    }
})
export default CaregiverReward