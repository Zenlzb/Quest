import React from 'react'
import {Text, StyleSheet, Modal, View} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";

const CustomPopup = (props) => {

    return (
        <Modal
        transparent={true}
        visible={props.visibility}
        >
            <View style={styles.container}>
                <View style={styles.popupContainer}>
                    <Text style={styles.titleText}>{props.titleText}</Text>
                    <Text style={styles.bodyText}>{props.bodyText}</Text>
                    <CustomButton
                        textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                        onPress={() => props.toggleVisibility(false)}
                    >OK</CustomButton>
                </View>
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.transparentBackground,
    },
    popupContainer: {
        backgroundColor: colors.button1,
        padding:10,
        borderRadius: 5,
        width: 300,
        height: 150,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    titleText: {
        color: 'white',
        fontFamily: 'balsamiqBold',
        fontSize: 25
    },
    bodyText: {
        color: 'white',
        fontFamily: 'balsamiq',
        fontSize: 15
    }

})
export default CustomPopup