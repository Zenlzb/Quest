import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from "react-native";
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";
import {createAccount} from '../../api/auth';
import ErrorText from "../Components/ErrorText";

const CreateAccount = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleNameUpdate = (text) => setName(text)
    const handleEmailUpdate = (text) => setEmail(text)
    const handlePasswordUpdate = (text) => setPassword(text)

    const handleCreate = () => {
        setErrorCode(null)
        createAccount({name, email, password}, setErrorCode)
    }

    const [errorCode, setErrorCode] = useState(null)
    const errors = [
        {code: 'auth/weak-password', text: 'Password is too short', key:'1'},
        {code: 'auth/invalid-email', text: 'Email is invalid', key:'2'},
        {code: 'auth/email-already-in-use', text: 'Email is already in use', key:'3'},
    ]

    return(
        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <TextInput
                        style={[styles.textInput, {marginBottom: 8}]}
                        placeholder={"Name"}
                        onChangeText={handleNameUpdate}
                        value={name}
                    />
                    <TextInput
                        style={[styles.textInput, {marginBottom: 8}]}
                        placeholder={"Email"}
                        onChangeText={handleEmailUpdate}
                        value={email}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder={"Password"}
                        onChangeText={handlePasswordUpdate}
                        value={password}
                        secureTextEntry
                    />
                </View>
                <CustomButton
                    buttonStyle={styles.CreateButton}
                    textStyle={{fontFamily: 'balsamiq'}}
                    onPress={handleCreate}
                >Create</CustomButton>
            </View>
            <ErrorText
                errorCode={errorCode}
                setErrorCode={setErrorCode}
                errors={errors}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    CreateButton: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
        marginLeft: 10
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
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginContainer: {
        flexDirection: 'row',
    },
    errorText: {
        fontFamily:'balsamiq',
        fontSize: 15,
        color: colors.button1
    }
})

export default CreateAccount;