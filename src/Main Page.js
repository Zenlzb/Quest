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
            style={styles.caregiverButton}
            onPress={() => console.log("a")}
            title='Create Caregiver Account'
        >Create Caregiver Account</CustomButton>
        <CustomButton
            style={styles.linkButton}
            onPress={() => console.log("b")}
            title=''
        >Link New Child</CustomButton>
    </View>
    )
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 50,
        marginBottom:60
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        fontSize: 20,
        marginBottom: 8,
        width: 200,
        height: 30,
    },
    caregiverButton: {
        marginTop: 50
    },
    linkButton: {
        marginTop: 8
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MainPage