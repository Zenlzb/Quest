import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from "react-native";
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";
import * as Authenticator from '../../api/auth';

const CreateAccount = ({ navigation }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleNameUpdate = (text) => setName(text)
    const handleEmailUpdate = (text) => setEmail(text)
    const handlePasswordUpdate = (text) => setPassword(text)

    const handleCreate = () => {
        Authenticator.createAccount(
            {name, email, password},
            (user) => {navigation.navigate({name: 'Caregiver Main', params: {user: user}})},
            (error) => {return console.error(error);})
    }

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
    }
})

export default CreateAccount;