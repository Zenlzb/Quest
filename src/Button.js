import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = props => (
    <TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
        <Text style={styles.text}>{props.children}</Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ff5863',
        borderRadius: 5
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
