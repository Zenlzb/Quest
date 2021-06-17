import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from "react-native";
import {getCurrentUserId, signOut} from "../../api/auth";
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";
import * as Quests from "../../api/quest"


const ChildMain = ({name}) => {
    const [parentUserId, setParentUserId] = useState(getCurrentUserId());
    const [questList, setQuestList] = useState()

    useEffect(() => {
        return Quests.questListSubscribe(parentUserId, name, setQuestList)
    }, [])

    const handleSignOut = () => {
        signOut();
    }

    const renderItem = ({item}) => {
        const QuestStatus = () => {
            if (item.status === 'incomplete') {
                const timeLeft = calculateTimeLeft(new Date(item.dueDate))
                console.log(timeLeft)
                return (<View style = {{backgroundColor: colors.button1, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1}}>
                            <Text style={[styles.text, {fontSize: 15, color: 'white'}]}>Incomplete {timeLeft}</Text>
                        </View>)
            } else if (item.status === 'complete') {
                return <Text style={[styles.text, {fontSize: 15, color: colors.button2}]}>Completed!</Text>
            } else if (item.status === 'expired') {
                return <Text style={[styles.text, {fontSize: 15, color: 'grey'}]}>Expired!</Text>
            }
        }
        return (
            <View style = {styles.questEntries}>
                <Text style = {styles.questText}>
                    {item.title}, {item.points} points
                </Text>
                <View style = {{flexDirection: 'row', paddingHorizontal: 5}}>
                    <QuestStatus/>
                    <CustomButton
                        buttonStyle={[styles.button, {marginTop: 8}]}
                        textStyle={{fontFamily: 'balsamiq', fontSize:15}}
                        onPress={() => {
                            Quests.completeQuest(parentUserId, name, item.id)
                        }}
                    >Complete Quest
                    </CustomButton>
                </View>
            </View>
        )
    }


    const calculateTimeLeft = (date) => {
        const timeLeft = date - new Date()

        if (timeLeft < 31536000000) { //years
            if (timeLeft < 2628000000) { //months
                if (timeLeft < 604800000) { //weeks
                    if (timeLeft < 86400000) { //days
                        if (timeLeft < 3600000) { //hours
                            if (timeLeft < 60000) {
                                if (timeLeft < 0) {
                                    Quests.expireQuest(parentUserId, name, item.id)
                                    return 'Quest expired!'
                                }
                                return '<1 Min'
                            }
                            return Math.floor(timeLeft / 60000).toString() + ' Min'
                        }
                        return Math.floor(timeLeft / 3600000).toString() + ' H'
                    }
                    return Math.floor(timeLeft / 86400000).toString() + ' D'
                }
                return Math.floor(timeLeft / 604800000).toString() + ' W'
            }
            return Math.floor(timeLeft / 2628000000).toString() + ' M'
        }
        return Math.floor(timeLeft / 31536000000).toString() + ' Y'
    }


    const emptyList = () => {
        return (
            <Text style={{fontSize: 20, color: 'grey', textAlign: 'center', fontFamily: 'balsamiq'}}>
                You don't have any quests right now!
            </Text>
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
                    ListEmptyComponent={emptyList}
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
    },
    questEntries: {
        borderWidth: 1,
        borderRadius: 10,
        height: 120,
        backgroundColor: colors.background3,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questText: {
        fontSize: 35,
        fontFamily: 'balsamiq',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 5,
        color: 'white',
        textAlign: 'center'
    },

})
export default ChildMain;