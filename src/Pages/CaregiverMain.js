import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, FlatList} from "react-native";
import CustomButton from "../Components/Button";
import {auth, signOut, getCurrentUserId} from "../../api/auth";
import colors from "../../assets/themes/colors";
import * as Children from "../../api/child"

const CaregiverMain = () => {
    const [childList, setChildList] = useState()
    const [userId, setUserId] = useState(getCurrentUserId());

    const [childNameInput, setChildNameInput] = useState('')
    const handleChildNameUpdate = (text) => setChildNameInput(text)
    const handleSignOut = () => {signOut()}
    const handleAddChild = () => {Children.createChild(userId, childNameInput)}

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

    return(
        <View style={styles.container}>
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
    }
})

export default CaregiverMain;