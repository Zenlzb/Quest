import React from 'react';
import {StyleSheet, View} from "react-native";
import colors from "../../assets/themes/colors";

const CaregiverReward = () => {
    return (
        <View style={styles.container}>

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
    }
})
export default CaregiverReward