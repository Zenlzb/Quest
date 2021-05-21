import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";


const LoginPage = ({ navigation }) => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [linkCode, setLinkCode] = useState('')

    const handleNameUpdate = (text) => setName(text)
    const handlePasswordUpdate = (text) => setPassword(text)
    const handleLinkCodeUpdate = (text) => setLinkCode(text)

    return(
        <View style={styles.container}>
        <Text style={styles.titleText}>Quest</Text>
        <View style={styles.loginContainer}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <TextInput
                    style={[styles.textInput, {marginBottom: 8}]}
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
            </View>
            <CustomButton
                buttonStyle={styles.submitButton}
                textStyle={{fontFamily: 'balsamiq'}}
                onPress={() => navigation.navigate("Caregiver Main")}
            >Submit</CustomButton>
        </View>
        <CustomButton
            buttonStyle={styles.caregiverButton}
            textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
            onPress={() => console.log("a")}
        >Create Caregiver Account</CustomButton>
        <View style={styles.linkChild}>
            <TextInput
                style={styles.textInput}
                placeholder={"Link Child Account"}
                onChangeText={handleLinkCodeUpdate}
                value={linkCode}
            />
            <CustomButton
                buttonStyle={styles.linkButton}
                textStyle={{fontFamily: 'balsamiq'}}
                onPress={() => console.log("b")}
            >Link</CustomButton>
        </View>

    </View>
    )
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 50,
        marginBottom: 60,
        marginTop: 100,
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
    caregiverButton: {
        backgroundColor: colors.button1,
        marginTop: 8
    },
    linkButton: {
        backgroundColor: colors.button1,
        marginLeft: 5,
    },
    linkChild: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 250
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