import React from 'react'
import {Text} from "react-native";
import colors from "../../assets/themes/colors";

const ErrorText = (props) => {
    return props.errors.map((value) => {
        if (props.errorCode === value.code) {
            return (<Text style={{
                fontFamily: 'balsamiq',
                fontSize: 15,
                color: colors.button1
            }} key={value.key}>{value.text}</Text>)
        }
    })
}

export default ErrorText