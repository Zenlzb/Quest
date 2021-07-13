import React, {useState} from 'react'
import {Text, StyleSheet, Modal, View, TextInput, Image} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";
import ErrorText from "./ErrorText";
import {checkNameExists} from "../../api/presets";
import * as ImagePicker from "expo-image-picker";
import * as Quests from "../../api/quest";
import firebase from "../../api/firebase";

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

    if (props.completeQuestMode) {
        const { item, parentUserId, childName, completeQuest, setCompleteQuest } = props
        const [image, setImage] = useState(null);
        const [uploading, setUploading] = useState(false)
        const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log(result);

            if (!result.cancelled) {
                setImage(result.uri);
            }
        };
        const uploadImage = async () => {
            const uploadUri = image
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uploadUri, true);
                xhr.send(null);
            });
            const filename = Date.now() + uploadUri.substring(uploadUri.lastIndexOf('/') + 1)
            const ref = firebase.storage().ref(parentUserId+"_"+childName).child(filename);
            const snapshot = await ref.put(blob);

            blob.close();

            return await snapshot.ref.getDownloadURL();
        }
        const handleCompleteQuest = async () => {
            setUploading(true)
            try {
                const uploadUrl = await uploadImage()
                await Quests.completeQuest(parentUserId, childName, item.id, uploadUrl)
            } catch (e) {
                console.error(e)
            } finally {
                setUploading(false)
                setCompleteQuest(false)
            }
        }
        if (item.requirePhoto) {
            return (
                <Modal
                    transparent={true}
                    visible={completeQuest}
                >
                    <View style={styles.container}>
                        <Modal
                            transparent={true}
                            visible={uploading}
                        >
                            <View style={styles.container}>
                                <View style={[styles.popupContainer, {backgroundColor: colors.background, alignItems: 'center'}]}>
                                    <Text style={[styles.titleText, {color: 'black'}]}>Uploading...</Text>
                                </View>
                            </View>
                        </Modal>
                        <View style={[styles.popupContainer,
                            {backgroundColor: colors.button2},
                            image ? {height: '50%', width: '90%'} : {}
                        ]}>
                            <Text style={[styles.titleText, {textAlign: 'center'}]}>Choose photo</Text>
                            {image && <Image
                                source={{ uri: image }}
                                style={{ width: '95%', height: '60%', borderRadius: 5 }}
                            />}
                            {!image && <CustomButton
                                buttonStyle={{marginHorizontal: 8, backgroundColor: colors.button1}}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={pickImage}
                            >Pick Image</CustomButton>}
                            {image && <View style={{flexDirection: 'row'}}>
                                <CustomButton
                                    buttonStyle={{marginHorizontal: 8, backgroundColor: colors.button1}}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => {setImage(null)}}
                                >Remove Image</CustomButton>
                                <CustomButton
                                    buttonStyle={{marginHorizontal: 8, backgroundColor: colors.button1}}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={handleCompleteQuest}
                                >Complete Quest</CustomButton>
                            </View>}

                            <View style={{flexDirection: 'row',}}>
                                <CustomButton
                                    buttonStyle={{backgroundColor: colors.button1}}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => setCompleteQuest(false)}
                                >Cancel</CustomButton>
                            </View>
                        </View>
                    </View>
                </Modal>
            )
        } else {
            return (
                <CustomPopup
                    visibility={completeQuest}
                    titleText={'Complete Quest'}
                    bodyText={`Are you sure you want to complete '${item.title}' ?`}
                    numberOfLines={2}
                    containerStyle={{backgroundColor: colors.button2}}
                    textStyle={{textAlign: 'center'}}
                    buttonList={() => {
                        return (
                            <View style={{flexDirection: 'row',}}>
                                <CustomButton
                                    buttonStyle={{marginHorizontal: 8, backgroundColor: colors.button2}}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => {
                                        Quests.completeQuest(parentUserId, childName, item.id, "")
                                        setCompleteQuest(false)
                                    }}
                                >Complete</CustomButton>
                                <CustomButton
                                    buttonStyle={{backgroundColor: colors.button2}}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => setCompleteQuest(false)}
                                >Cancel</CustomButton>
                            </View>
                        )
                    }}
                />
            )
        }

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