import React, {useEffect, useState} from 'react';
import {Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";
import {signIn} from "../../api/auth";
import ErrorText from "../Components/ErrorText";

const LoginPage = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [childLink, setChildLink] = useState('')
    const [loginHelp, setLoginHelp] = useState(false)

    const [errorCode, setErrorCode] = useState(null)
    const errors = [
        {code: 'auth/user-not-found', text: 'No user with that email found', key:'1'},
        {code: 'auth/wrong-password', text: 'Password is Incorrect or Empty', key:'2'},
        {code: 'auth/too-many-requests', text: 'Too many tries, please try again later', key:'3'},
        {code: 'auth/invalid-email', text: 'Email is invalid', key:'4'},
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
            <Modal
                transparent={true}
                visible={loginHelp}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalPopupContainer, {justifyContent: 'space-between'}]}>
                        <View style={{width: '100%', height: '80%', alignItems: 'flex-start'}}>
                            <Text style={[styles.text, {fontSize: 21}]}>1) Setting up a Caregiver Account</Text>
                            <Text style={[styles.text, {fontSize: 13}]}>Tap Create Caregiver Account on the login page{'\n'}</Text>
                            <Text style={[styles.text, {fontSize: 19}]}>2) Logging into a Caregiver Account</Text>
                            <Text style={[styles.text, {fontSize: 13, textAlign: 'left'}]}>Enter your login credentials, leaving 'Link Child Account' blank{'\n'}</Text>
                            <Text style={[styles.text, {fontSize: 21}]}>3) Setting up a Child Account</Text>
                            <Text style={[styles.text, {fontSize: 13, textAlign: 'left'}]}>Once you enter the caregiver account, there will be an option to Add Child.</Text>
                            <Text style={[styles.text, {fontSize: 13, textAlign: 'left'}]}>After you have added a child, log in on your child's mobile device by inputting your login credentials, and your child's name in 'Link Child Account'</Text>
                        </View>

                        <View style={{width: '100%', alignItems: 'center'}}>
                            <CustomButton
                                buttonStyle={{backgroundColor: colors.button1, justifyContent: 'center',}}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => setLoginHelp(false)}
                            >Close</CustomButton>
                        </View>

                    </View>
                </View>

            </Modal>
            <Text style={styles.titleText}>Quest</Text>
            <View style={styles.loginContainer}>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <TextInput
                        style={[styles.textInput, {marginBottom: 8}]}
                        placeholder={"Email"}
                        keyboardType='email-address'
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
            <Pressable onPress={() => setLoginHelp(true)}>
                <Text style={{fontFamily: 'balsamiq', marginTop: 10}}>New User?</Text>
            </Pressable>



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
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.transparentBackground,
    },
    modalPopupContainer: {
        backgroundColor: colors.background,
        padding:10,
        borderRadius: 5,
        width: 350,
        height: '60%',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq',
        textAlign: 'center'
    },
});

export default LoginPage