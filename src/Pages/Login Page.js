import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput, Keyboard} from 'react-native';
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";
import {signIn} from "../../api/auth";

const LoginPage = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [childLink, setChildLink] = useState('')

    const handleEmailUpdate = (text) => setEmail(text)
    const handlePasswordUpdate = (text) => setPassword(text)
    const handleChildLinkUpdate = (text) => setChildLink(text)

    const handleLogin = () => {
        Keyboard.dismiss();
        signIn({ email, password, childLink });

    }

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
    linkButton: {
        backgroundColor: colors.button1,
        marginLeft: 5,
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