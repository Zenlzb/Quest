import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import CustomButton from "./Button";

const MainPage = () => {
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
                onPress={() => console.log("c")}
            >Submit</CustomButton>
        </View>
        <CustomButton
            buttonStyle={styles.caregiverButton}
            textStyle={{fontSize:15}}
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
        marginTop: 100
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#fff',
        fontSize: 20,
        width: 200,
        height: 30,
        paddingLeft: 5
    },
    submitButton: {
        justifyContent: 'center',
        marginLeft: 10
    },
    caregiverButton: {
        marginTop: 8
    },
    linkButton: {
        backgroundColor: '#34ebc6',
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
        backgroundColor: '#f4f7c3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginContainer: {
        flexDirection: 'row',

    }
});

export default MainPage