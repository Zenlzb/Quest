import React, {useState} from 'react'
import {Text, StyleSheet, Modal, View, TextInput} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";
import ErrorText from "./ErrorText";
import {checkNameExists} from "../../api/presets";

const CustomPopup = (props) => {

    if (props.presetMode) {
        const { userId, addPresetPopup, toggleAddPresetPopup, presetName, handlePresetNameUpdate, addPreset } = props
        const [errorCode, setErrorCode] = useState('')
        const errors = [
            {code: 'emptyName', text: 'Please fill in a name', key:'1'},
            {code: 'nameExists', text: 'A preset with that name already exists', key:'2'},
        ]
        return(
            <Modal
                transparent={true}
                visible={addPresetPopup}
                onShow={() => {setErrorCode('')}}
            >
                <View style={styles.container}>
                    <View style={[styles.popupContainer, {backgroundColor: colors.background}]}>
                        <Text style={[styles.titleText, {color: 'black'}]}>Name your preset</Text>
                        <TextInput
                            style={[styles.textInput, {height: 35,width: '100%'}]}
                            placeholder={"Preset Name"}
                            onChangeText={handlePresetNameUpdate}
                            value={presetName}
                        />
                        <ErrorText
                            errorCode={errorCode}
                            setErrorCode={setErrorCode}
                            errors={errors}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <CustomButton
                                buttonStyle={{backgroundColor:colors.button1}}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => {
                                    setErrorCode('')
                                    if (!presetName) {
                                        setErrorCode('emptyName')
                                        return
                                    }

                                    setTimeout(async () => {
                                        const nameExists = await checkNameExists(userId, presetName)
                                        if (nameExists) {
                                            setErrorCode('nameExists')
                                        } else {
                                            addPreset()
                                        }
                                    }, 10)
                                }}
                            >Create</CustomButton>
                            <CustomButton
                                buttonStyle={{backgroundColor:colors.button1, marginLeft: 8}}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => toggleAddPresetPopup(false)}
                            >Cancel</CustomButton>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <Modal
        transparent={true}
        visible={props.visibility}
        >
            <View style={styles.container}>
                <View style={[styles.popupContainer, props.containerStyle]}>
                    <Text style={[styles.titleText, props.textStyle]}>{props.titleText}</Text>
                    <Text style={[styles.bodyText, props.textStyle]} numberOfLines={props.numberOfLines || 1}>{props.bodyText}</Text>
                    {props.buttonList()}
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
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#fff',
        borderRadius: 5,
        fontSize: 20,
        height: 30,
        paddingLeft: 5,
        fontFamily: 'balsamiq'
    },

})
export default CustomPopup