import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";
import {signIn} from "../../api/auth";
import ErrorText from "../Components/ErrorText";

const LoginPage = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [childLink, setChildLink] = useState('')

    const [errorCode, setErrorCode] = useState(null)
    const errors = [
        {code: 'auth/wrong-password', text: 'Username or Password is Invalid', key:'1'},
        {code: 'auth/too-many-requests', text: 'Too many tries, please try again later', key:'2'}
    ]

    const handleEmailUpdate = (text) => setEmail(text)
    const handlePasswordUpdate = (text) => setPassword(text)
    const handleChildLinkUpdate = (text) => setChildLink(text)

    const handleLogin = () => {
        Keyboard.dismiss();
        signIn({ email, password, childLink }, setErrorCode)
    }

    useEffect(() => {
        return navigation.addListener('blur', () => {
            setErrorCode(null)
        });
    }, [navigation])


    return(

        <View style={styles.container}>
        <Text style={styles.titleText}>Quest</Text>
        <View style={styles.loginContainer}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <TextInput
                    style={[styles.textInput, {marginBottom: 8}]}
                    placeholder={"Email"}
                    onChangeText={handleEmailUpdate}
                    value={email}
                />
                <TextInput
                    style={[styles.textInput, {marginBottom: 8}]}
                    placeholder={"Password"}
                    onChangeText={handlePasswordUpdate}
                    value={password}
                    secureTextEntry
                />
                <TextInput
                    style={styles.textInput}
                    placeholder={"Link Child Account"}
                    onChangeText={handleChildLinkUpdate}
                    value={childLink}
                />
            </View>
            <CustomButton
                buttonStyle={styles.submitButton}
                textStyle={{fontFamily: 'balsamiq'}}
                onPress={handleLogin}
            >Log-in</CustomButton>
        </View>
            <ErrorText
                errorCode={errorCode}
                setErrorCode={setErrorCode}
                errors={errors}
            />
        <CustomButton
            buttonStyle={styles.createAccountButton}
            textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
            onPress={() => navigation.navigate("Create Account")}
        >Create Caregiver Account</CustomButton>

    </View>
    )
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 50,
        marginBottom: 60,
        fontFamily: 'balsamiqBold'
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
    submitButton: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
        marginLeft: 10
    },
    createAccountButton: {
        backgroundColor: colors.button1,
        marginTop: 8
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
});

export default LoginPage