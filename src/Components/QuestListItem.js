import React, {useState} from 'react'
import {Pressable, Text, View, StyleSheet} from "react-native";
import CustomButton from "./Button";
import * as Quests from "../../api/quest";
import colors from "../../assets/themes/colors";
import {Icon} from "react-native-elements";
import CoinIcon from "./CoinIcon";
import {caregiverExpireQuest} from "../../api/quest";

const calculateTimeLeft = (date) => {
    const timeLeft = date - new Date()

    if (timeLeft < 31536000000) { //years
        if (timeLeft < 2628000000) { //months
            if (timeLeft < 604800000) { //weeks
                if (timeLeft < 86400000) { //days
                    if (timeLeft < 3600000) { //hours
                        if (timeLeft < 60000) {
                            if (timeLeft < 0) {
                                return null
                            }
                            return '<1 Min'
                        }
                        return Math.floor(timeLeft / 60000).toString() + 'Min'
                    }
                    return Math.floor(timeLeft / 3600000).toString() + 'Hr'
                }
                return Math.floor(timeLeft / 86400000).toString() + 'd'
            }
            return Math.floor(timeLeft / 604800000).toString() + 'w'
        }
        return Math.floor(timeLeft / 2628000000).toString() + 'M'
    }
    return Math.floor(timeLeft / 31536000000).toString() + 'Yr'
}

const QuestListItem = (props) => {
    const { item, mode } = props
    if (mode === 'child') {
        const { parentUserId, childName } = props
        if (item.status === 'expired-caregiver' || item.status === 'expired-none' || item.status === 'claimed' ) { return null }
        const QuestStatus = () => {
            if (item.status === 'incomplete') {
                const [timeLeftMode, setTimeLeftMode] = useState(true)
                const date = new Date(item.dueDate)
                const timeLeft = calculateTimeLeft(date)
                if (!timeLeft) {
                    return(
                        <View style = {[styles.questStatusChild, {justifyContent: 'space-between'}]}>
                            <View style={{backgroundColor: 'grey', borderRadius: 5, paddingHorizontal: 5, height: 25}}>
                                <Text style={[styles.text, {fontSize: 15, color: 'white'}]}>Expired</Text>
                            </View>
                            <CustomButton
                                buttonStyle={styles.button}
                                textStyle={[styles.text, {paddingVertical: 1, fontSize: 15}]}
                                onPress={() => {Quests.childExpireQuest(parentUserId, childName, item.id)}}
                            >Clear</CustomButton>
                        </View>
                    )
                }
                return (
                    <View style = {[styles.questStatusChild, {justifyContent: 'space-between'}]}>
                        <Pressable
                            style={{flexDirection: 'row', height: 25}}
                            onPress={() => {setTimeLeftMode(!timeLeftMode)}}
                        >
                            <View style = {{backgroundColor: colors.button1, borderRadius: 5, paddingHorizontal: 5}}>
                                <Text style={[styles.text, {fontSize: 15, color: 'white'}]}>Incomplete</Text>
                            </View>
                            <Text style={[styles.text, {fontSize: 15, color: 'white', marginLeft: 5}]}>
                                {timeLeftMode ? timeLeft : date.toDateString() + ' ' + date.toTimeString().substr(0,5)}
                            </Text>
                            {timeLeftMode && <Icon
                                name='clock'
                                type='feather'
                                color='white'
                                size={17}
                                style={{marginTop: 3, marginLeft: 2}}
                            />}
                        </Pressable>
                        <Pressable
                            onPress={() => {Quests.completeQuest(parentUserId, childName, item.id)}}
                        >
                            <Icon
                                name='check-square'
                                type='feather'
                                color='white'
                                size={35}
                            />
                        </Pressable>
                    </View>

                )
            } else if (item.status === 'complete') {
                return (
                    <View style = {styles.questStatusChild}>
                        <View style={{backgroundColor: colors.button2, borderRadius: 5, paddingHorizontal: 5, height: 25}}>
                            <Text style={[styles.text, {fontSize: 15, color: 'white'}]}>Completed!</Text>
                        </View>
                        <Text style={[styles.text, {fontSize: 15, marginLeft: 5}]}>Awaiting Rewards..</Text>
                    </View>

                )
            } else if (item.status === 'expired-child') {
                return (
                    <View style = {[styles.questStatusChild, {justifyContent: 'space-between'}]}>
                        <View style={{backgroundColor: 'grey', borderRadius: 5, paddingHorizontal: 5, height: 25}}>
                            <Text style={[styles.text, {fontSize: 15, color: 'white'}]}>Expired</Text>
                        </View>
                        <CustomButton
                            buttonStyle={styles.button}
                            textStyle={[styles.text, {paddingVertical: 1, fontSize: 15}]}
                            onPress={() => {Quests.childExpireQuest(parentUserId, childName, item.id)}}
                        >Clear</CustomButton>
                    </View>
                )
            }
        }
        return (
            <View style = {styles.questEntriesChild}>
                <View style={{flexDirection: 'row', width: '100%', height: '60%', paddingHorizontal: 5, justifyContent: 'space-between'}}>
                    <Text style={[styles.text, {width: '60%', fontSize: 22}]} numberOfLines={2}>{item.title}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '30%'}}>
                        <Text style={[styles.text, {fontSize: 22}]} numberOfLines={1}>{item.points}</Text>
                        <CoinIcon style={{marginLeft: 2, marginTop: 5}} dimension={25}/>
                    </View>
                </View>
                <QuestStatus/>
            </View>
        )
    } else if (mode === 'caregiver') {
        const { userId, childName, caregiverOnPress } = props
        if (item.status === 'expired-child' || item.status === 'expired-none' || item.status === 'claimed' ) {
            return null
        } else if (item.status === 'complete') {
            return(
                <Pressable
                    style={[styles.questEntriesCaregiver, {backgroundColor: colors.button2}]}
                    onPress={caregiverOnPress}
                >
                    <Text style={[styles.text, {fontSize: 15, textAlign: 'left', width: '60%'}]} numberOfLines={1}>{item.title}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '25%'}}>
                        <Text style={[styles.text, {fontSize: 15}]} numberOfLines={1}> </Text>
                        <Text style={[styles.text, {fontSize: 15}]} numberOfLines={1}>{item.points}</Text>
                        <CoinIcon style={{marginLeft: 2, marginTop: 3.5}} dimension={17}/>
                    </View>
                </Pressable>
            )
        } else if (item.status === 'incomplete') {
            const timeLeft = calculateTimeLeft(new Date(item.dueDate))
            if (!timeLeft) {
                return (
                    <Pressable
                        style={[styles.questEntriesCaregiver, {backgroundColor: 'grey', alignItems: 'center'}]}
                        onPress={() => {caregiverExpireQuest(userId, childName, item.id)}}
                    >
                        <Text style={[styles.text, {fontSize: 15, textAlign: 'left', width: '40%'}]} numberOfLines={1}>{item.title}</Text>
                        <Text style={[styles.text, {fontSize: 13, textAlign: 'right', width: '50%'}]} numberOfLines={1}>Expired. Tap to clear</Text>
                    </Pressable>
                )
            }
            return(
                <Pressable
                    style={[styles.questEntriesCaregiver, {backgroundColor: colors.button1}]}
                    onPress={caregiverOnPress}
                >
                    <Text style={[styles.text, {fontSize: 15, textAlign: 'left', width: '60%'}]} numberOfLines={1}>{item.title}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '25%'}}>
                        <Text style={[styles.text, {fontSize: 15, color: 'white', marginLeft: 5}]}>
                            {timeLeft}
                        </Text>
                        <Icon
                            name='clock'
                            type='feather'
                            color='white'
                            size={17}
                            style={{marginTop: 3, marginLeft: 2}}
                        />
                    </View>
                </Pressable>
            )
        } else if (item.status === 'expired-caregiver') {
            return(
                <Pressable
                    style={[styles.questEntriesCaregiver, {backgroundColor: 'grey', alignItems: 'center'}]}
                    onPress={() => {caregiverExpireQuest(userId, childName, item.id)}}
                >
                    <Text style={[styles.text, {fontSize: 15, textAlign: 'left', width: '60%'}]} numberOfLines={1}>{item.title}</Text>
                </Pressable>
            )
        }
    }

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq'
    },
    questEntriesChild: {
        borderWidth: 2,
        borderRadius: 10,
        height: 115,
        backgroundColor: colors.background3,
        width: '100%',
        alignItems: 'center',
        marginBottom: 8,
        padding: 3
    },
    questStatusChild: {
        flexDirection: 'row',
        padding: 5,
        width: '100%',
        height: '40%',
        alignItems: 'flex-end'
    },
    questEntriesCaregiver: {
        width: '100%',
        height: 25,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 3,
        paddingHorizontal: 3,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export default QuestListItem