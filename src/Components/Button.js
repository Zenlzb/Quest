import React from 'react'
import {Text, StyleSheet, Pressable} from 'react-native';


const CustomButton = (props) => {

    return (
        <Pressable
            style={[styles.container, props.buttonStyle]}
            onPress={props.onPress}
            onLongPress={props.onLongPress}
            android_ripple={{color: 'white', borderless: false}}
        >
            <Text style={[styles.text, props.textStyle]}>{props.children}</Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
    },
    text: {
        fontSize: 20,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 5,
        color: 'white',
        textAlign: 'center'
    }
})

export default CustomButton
