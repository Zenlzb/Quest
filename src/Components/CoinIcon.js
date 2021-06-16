import React from 'react'
import {View, Text, StyleSheet} from 'react-native';
import colors from "../../assets/themes/colors";

const coinIcon = (props) => {
    const { dimension, style } = props
    return (
        <View style={
            [styles.container,
            {width: dimension, height: dimension, borderRadius: dimension, borderWidth: dimension/15},
            style]
        }>
            <Text style={[styles.text, {fontSize: dimension*0.7, paddingBottom: dimension/10}]}>c</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.button3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'balsamiq',

    }
})

export default coinIcon