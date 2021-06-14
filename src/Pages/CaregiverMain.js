import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, FlatList, Keyboard} from "react-native";
import CustomButton from "../Components/Button";
import {auth, signOut, getCurrentUserId} from "../../api/auth";
import colors from "../../assets/themes/colors";
import * as Children from "../../api/child"
import CreateQuestModal from "../Components/CreateQuest";
import ErrorText from "../Components/ErrorText";
import CustomPopup from "../Components/Popup";

const CaregiverMain = ({ navigation }) => {
    const [childList, setChildList] = useState([])
    const [userId, setUserId] = useState(getCurrentUserId());
    const [questModalVisible, toggleQuestModal] = useState(false)
    const [signOutConfirm, setSignOutConfirm] = useState(false)

    const [childNameInput, setChildNameInput] = useState('')
    const handleChildNameUpdate = (text) => setChildNameInput(text)

    const handleSignOut = () => {setSignOutConfirm(true)}
    const handleAddChild = () => {
        if (childNameInput === '') {
            setErrorCode('invalid')
            return
        }
        Children.checkChildExists(userId, childNameInput).then((childExists) => {
            if (!childExists) {
                setErrorCode(null)
                Children.createChild(userId, childNameInput)
                Keyboard.dismiss()
                setChildNameInput('')
            } else {
                console.log('already exists')
                setErrorCode('alreadyExists')
            }
        })
    }
    const handleCreateQuest = () => {
        if (childList.length === 0) {
            setErrorCode('noChild')
            return
        }
        setErrorCode(null)
        toggleQuestModal(true)
    }

    useEffect(() => {
        return Children.childListSubscribe(userId, setChildList)
    }, [])

    const renderItem = ({ item }) => {
        const handleRemoveChild = () => {Children.deleteChild(userId, item)}
        return (
            <CustomButton
                buttonStyle={[styles.button, {marginBottom: 8, width: '100%', height: 70}]}
                textStyle={{fontFamily: 'balsamiq', fontSize:15}}
                onPress={handleRemoveChild}
            >{item.name}</CustomButton>
        )
    }

    const emptyList = () => {
        return (
            <Text style={{fontSize: 20, color: 'grey', textAlign: 'center', fontFamily: 'balsamiq'}}>
                Welcome! {'\n'}
                Getting Started: {'\n'}
                1. Add a Child! {'\n'}
                2. Add <Text style={{color: colors.button3}}>Rewards</Text>!{'\n'}
                3. Create a Quest! {'\n'}
            </Text>
        )
    }

    const [errorCode, setErrorCode] = useState(null)
    const errors = [
        {code: 'invalid', text: 'Invalid Name', key:'1'},
        {code: 'alreadyExists', text: 'Child already exists', key:'2'},
        {code: 'noChild', text: 'No child found, add a child first', key:'3'}
    ]

    return(
        <View style={styles.container}>
            <CreateQuestModal
                userId={userId}
                visibility={questModalVisible}
                toggleVisibility={toggleQuestModal}
                childList={childList}
            />
            <CustomPopup
                visibility={signOutConfirm}
                titleText={'Sign out'}
                bodyText={'Are you sure you want to sign out?'}
                buttonList={() => {
                        return (
                            <View style={{flexDirection: 'row',}}>
                                <CustomButton
                                    buttonStyle={{marginHorizontal: 8}}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => signOut()}
                                >Yes</CustomButton>
                                <CustomButton
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => setSignOutConfirm(false)}
                                >Cancel</CustomButton>
                            </View>
                        )
                    }}
            />
            <View style={styles.topContainer}>
                <CustomButton
                    buttonStyle={[styles.button, {marginLeft: 8}]}
                    textStyle={[styles.text, {paddingVertical: 1, fontSize: 17}]}
                    onPress={handleSignOut}
                >Sign Out</CustomButton>
                <Text style={[styles.text, {marginRight: 8, fontSize: 17}]}>
                    Welcome, Caregiver {auth.currentUser.displayName.length >= 15
                    ? auth.currentUser.displayName.substr(0, 12) + '...' : auth.currentUser.displayName}
                </Text>
            </View>

            <View style={{flexDirection: 'row', width: '100%', height: 70, paddingHorizontal: 8, justifyContent: 'space-between'}}>
                <Text style={[styles.text, {fontSize: 40}]}>Children</Text>
                <View style={{flexDirection: 'row', marginTop: 21, height: 25}}>
                    <CustomButton
                        buttonStyle={[styles.button, {marginRight: 8}]}
                        textStyle={{fontFamily: 'balsamiq', fontSize: 15, color: colors.button3}}
                        onPress={() => {
                            navigation.navigate('Caregiver Reward')
                        }}
                    >Rewards</CustomButton>
                    <CustomButton
                        buttonStyle={styles.button}
                        textStyle={{fontFamily: 'balsamiq', fontSize: 15}}
                        onPress={handleCreateQuest}
                    >+ Create Quest</CustomButton>
                </View>
            </View>

            <View style={{width: '95%', height: '79%', borderWidth: 2, padding: 5, borderRadius: 10, alignItems: 'center'}}>
                <View style={{width: '90%', height: 20, flexDirection: 'row', alignItems: 'center', marginVertical: 8}}>
                    <TextInput
                        style={[styles.textInput, {marginRight: 8}]}
                        placeholder={"Add Child"}
                        onChangeText={handleChildNameUpdate}
                        value={childNameInput}
                    />
                    <CustomButton
                        buttonStyle={[styles.button, {height: 33}]}
                        textStyle={{fontFamily: 'balsamiq'}}
                        onPress={handleAddChild}
                    >Add</CustomButton>
                </View>
                <ErrorText
                    errorCode={errorCode}
                    setErrorCode={setErrorCode}
                    errors={errors}
                />

                <FlatList
                    style={{width: '90%', height: '70%', marginTop:8}}
                    data={childList}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
                    ListEmptyComponent={emptyList}
                />

            </View>
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
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: 45,
        marginBottom: 8,
        justifyContent: 'space-between',
        height: 27,
        width: '100%'
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq',
        textAlign: 'center'
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: '#fff',
        fontSize: 20,
        width: '80%',
        height: 33,
        paddingLeft: 5,
        fontFamily: 'balsamiq'
    },
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    },
    errorText: {
        fontFamily:'balsamiq',
        fontSize: 15,
        color: colors.button1
    }
})

export default CaregiverMain;