import React from 'react'
import {Text, View, StyleSheet} from "react-native";
import colors from "../../assets/themes/colors";
import {Tooltip} from "react-native-elements";

const CustomTooltip = (props) => {
    return (
        <Tooltip
            popover={<Text style={{fontFamily: 'balsamiq'}}>{props.children}</Text>}
            height={62}
            width={300}
            backgroundColor={colors.background}
            skipAndroidStatusBar={true}>
            <View style={styles.tooltipCircle}>
                <Text style={[styles.text, {color: 'white'}]}>?</Text>
            </View>
        </Tooltip>
    )
}

const styles = StyleSheet.create({
    tooltipCircle: {
        width: 35,
        height: 35,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.button1
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq'
    }
})

export default CustomTooltip