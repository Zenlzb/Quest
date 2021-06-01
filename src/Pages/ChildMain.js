import React, {useState} from 'react';
import {View, Text, StyleSheet} from "react-native";
import {getCurrentUserId, signOut} from "../../api/auth";
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";

const ChildMain = ({name}) => {
    const [parentUserId, setParentUserId] = useState(getCurrentUserId());

    const handleSignOut = () => {
        signOut();
    }

    return(
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.text}>Child {name}</Text>
                <Text style={styles.text}>Points</Text>
                <CustomButton
                    buttonStyle={styles.button}
                    textStyle={{fontFamily: 'balsamiq'}}
                    onPress={handleSignOut}
                >Sign Out</CustomButton>
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
        backgroundColor: colors.background,
        // justifyContent: 'center',
        alignItems: 'center'
    },
    topBar: {
        marginTop: 30,
        marginHorizontal: 10,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq'
    },
    button: {

        backgroundColor: colors.button1,
        justifyContent: 'center',
    }
})
export default ChildMain;