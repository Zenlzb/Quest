import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from "react-native";
import {getCurrentUserId, signOut} from "../../api/auth";
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";
import * as Quests from "../../api/quest"
import * as Children from "../../api/child";

const ChildMain = ({name}) => {
    const [parentUserId, setParentUserId] = useState(getCurrentUserId());
    const [questList, setQuestList] = useState()

    useEffect(() => {
        return Quests.questListSubscribe(parentUserId, name, setQuestList)
    }, [])

    const handleSignOut = () => {
        signOut();
    }

    const renderItem = ({item, index}) => {
        const handleRemoveQuest = () => {Quests.deleteQuest(parentUserId, name, item.id)}
        return (
            <CustomButton
                buttonStyle={[styles.button, {marginBottom: 8, width: '100%', height: 70}]}
                textStyle={{fontFamily: 'balsamiq', fontSize:15}}
                onPress={handleRemoveQuest}
            >{item.title}</CustomButton>
        )
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
            <View style={{marginTop: 80, marginHorizontal: 10}}>
                <Text style = {[styles.text, {fontSize: 18}]}> Quests</Text>
                <FlatList
                    data={questList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    // ListEmptyComponent={emptyList} //you have no quests
                />
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
        // alignItems: 'center'
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
    },
    tasks: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    }
})
export default ChildMain;