import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, FlatList} from "react-native";
import CustomButton from "../Components/Button";
import {auth, signOut, getCurrentUserId} from "../../api/auth";
import colors from "../../assets/themes/colors";
import * as Children from "../../api/child"
import * as Quests from "../../api/quest"
import CreateQuestModal from "../Components/CreateQuest";
import ErrorText from "../Components/ErrorText";

const CaregiverMain = () => {
    const [childList, setChildList] = useState()
    const [userId, setUserId] = useState(getCurrentUserId());
    const [questModalVisible, toggleQuestModal] = useState(false)

    const [childNameInput, setChildNameInput] = useState('')
    const handleChildNameUpdate = (text) => setChildNameInput(text)

    const [questInput, setQuestInput] = useState('')
    const [questChildInput, setQuestChildInput] = useState('')
    const handleQuestUpdate = (text) => setQuestInput(text)
    const handleQuestChildUpdate = (text) => setQuestChildInput(text)

    const handleSignOut = () => {signOut()}
    const handleAddChild = () => {
        if (childNameInput === 'All' || childNameInput === 'all' || childNameInput === '') {
            setErrorCode('invalid')
            return
        }
        Children.checkChildExists(userId, childNameInput).then((childExists) => {
            if (!childExists) {
                setErrorCode(null)
                Children.createChild(userId, childNameInput)
            } else {
                console.log('already exists')
                setErrorCode('alreadyExists')
            }
        })
    }
    const handleAddQuest = () => {
        Children.checkChildExists(userId, questChildInput).then((childExists) => {
            if (childExists) {
                Quests.createQuest(userId, questChildInput, questInput,Date.now() + 30000, 0)
            } else { console.log('doesnt exist') }
        })
    }

    useEffect(() => {
        return Children.childListSubscribe(userId, setChildList)
    }, [])

    const renderItem = ({ item }) => {
        const handleRemoveChild = () => {Children.deleteChild(userId, item)}
        return (
            <CustomButton
                buttonStyle={[styles.button, {marginBottom: 8}]}
                textStyle={{fontFamily: 'balsamiq', fontSize:10}}
                onPress={handleRemoveChild}
            >{item.name}</CustomButton>

        )
    }

    const [errorCode, setErrorCode] = useState(null)
    const errors = [
        {code: 'invalid', text: 'Invalid Name', key:'1'},
        {code: 'alreadyExists', text: 'Child already exists', key:'2'}
    ]

    return(
        <View style={styles.container}>
            <CreateQuestModal
                userId={userId}
                visibility={questModalVisible}
                toggleVisibility={toggleQuestModal}
                childList={childList}
            />
            <Text style={styles.text}>Welcome, Caregiver {auth.currentUser.displayName}</Text>
            <CustomButton
                buttonStyle={[styles.button, {marginBottom: 8}]}
                textStyle={{fontFamily: 'balsamiq'}}
                onPress={handleSignOut}
            >Sign Out</CustomButton>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                    style={[styles.textInput, {marginRight: 8}]}
                    placeholder={"Add Child"}
                    onChangeText={handleChildNameUpdate}
                    value={childNameInput}
                />
                <CustomButton
                    buttonStyle={styles.button}
                    textStyle={{fontFamily: 'balsamiq'}}
                    onPress={handleAddChild}
                >Add</CustomButton>
            </View>
            <ErrorText
                errorCode={errorCode}
                setErrorCode={setErrorCode}
                errors={errors}
            />
            <View style={{marginTop: 8, flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                    style={[styles.textInput, {width: 150, marginRight: 8}]}
                    placeholder={"Add Quest"}
                    onChangeText={handleQuestUpdate}
                    value={questInput}
                />
                <TextInput
                    style={[styles.textInput, {width:100, marginRight: 8}]}
                    placeholder={"For Child"}
                    onChangeText={handleQuestChildUpdate}
                    value={questChildInput}
                />
                <CustomButton
                    buttonStyle={styles.button}
                    textStyle={{fontFamily: 'balsamiq'}}
                    onPress={handleAddQuest}
                >Add</CustomButton>
            </View>
            <CustomButton
                buttonStyle={[styles.button, {marginTop: 8}]}
                textStyle={{fontFamily: 'balsamiq'}}
                onPress={() => toggleQuestModal(true)}
            >+ Create Quest</CustomButton>
            <Text style={{marginTop:8, fontFamily: 'balsamiq'}}>List of Children</Text>
            <View style={{marginTop:8, height:100, width: 100, alignItems: 'center'}}>
                <FlatList
                    data={childList}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq'
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#fff',
        fontSize: 20,
        width: 200,
        height: 30,
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