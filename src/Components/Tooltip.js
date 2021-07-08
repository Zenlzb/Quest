import React from 'react'
import {Text, View, StyleSheet} from "react-native";
import colors from "../../assets/themes/colors";
import {Tooltip} from "react-native-elements";

const CustomTooltip = (props) => {
    const { modal, width, height, circleSize } = props
    return (
        <Tooltip
            popover={<Text style={{fontFamily: 'balsamiq'}}>{props.children}</Text>}
            height={height}
            width={width}
            backgroundColor={colors.background}
            skipAndroidStatusBar={modal}>
            <View style={[styles.tooltipCircle, {width: circleSize, height: circleSize, borderRadius: circleSize}]}>
                <Text style={[styles.text, {color: 'white'}]}>?</Text>
            </View>
        </Tooltip>
    )
}

const styles = StyleSheet.create({
    tooltipCircle: {
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