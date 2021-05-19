import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import CustomButton from "./Button";

const MainPage = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const handleNameUpdate = (text) => setName(text)
    const handlePasswordUpdate = (text) => setPassword(text)

    return(
        <View style={styles.container}>
        <Text style={styles.titleText}>Quest</Text>
        <View style={styles.loginContainer}>
            <TextInput
                style={styles.textInput}
                placeholder={"Username"}
                onChangeText={handleNameUpdate}
                value={name}
            />
            <TextInput
                style={styles.textInput}
                placeholder={"Password"}
                onChangeText={handlePasswordUpdate}
                value={password}
                secureTextEntry
            />
            <CustomButton
                style={styles.submitButton}
                onPress={() => console.log("c")}
            >Submit</CustomButton>
        </View>
        <CustomButton
            style={styles.caregiverButton}
            onPress={() => console.log("a")}
        >Create Caregiver Account</CustomButton>
        <CustomButton
            style={styles.linkButton}
            onPress={() => console.log("b")}
        >Link New Child</CustomButton>
    </View>
    )
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 50,
        marginBottom: 60,
        marginTop: 50
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#fff',
        fontSize: 20,
        marginBottom: 8,
        width: 200,
        height: 30,
        paddingLeft: 5
    },
    submitButton: {

    },
    caregiverButton: {
        marginTop: 200
    },
    linkButton: {
        backgroundColor: '#34ebc6',
        marginTop: 8
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f4f7c3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    }
});

export default MainPage