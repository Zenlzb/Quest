import React, {useEffect, useState} from 'react'
import {Pressable, Text, View, StyleSheet, FlatList, Modal} from "react-native";
import colors from "../../assets/themes/colors";
import CoinIcon from "./CoinIcon";
import * as Quests from "../../api/quest";
import QuestListItem from "./QuestListItem";
import {Icon} from "react-native-elements";
import CustomButton from "./Button";

const ChildListItem = (props) => {
    const { item, userId, handleRemoveChild } = props
    const { name, points } = item
    const [expanded, setExpanded] = useState(false)
    const [questList, setQuestList] = useState([])
    const [selectedQuestPopup, setSelectedQuestPopup] = useState(false)
    const [selectedQuest, setSelectedQuest] = useState({dueDate:'', id:'', points: 0, status: '', title: ''})

    const handleReleaseRewards = () => {
        Quests.releaseRewards(userId, name, selectedQuest.id)
        setSelectedQuestPopup(false)
    }
    const handleDeleteQuest = () => {
        Quests.deleteQuest(userId, name, selectedQuest.id)
        setSelectedQuestPopup(false)
    }

    useEffect(() => {
        return Quests.questListSubscribe(userId, name, setQuestList)
    }, [])

    const SelectedQuest = (props) => {
        const popupStyles = StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.transparentBackground,
            },
            popupContainer: {
                backgroundColor: colors.background,
                padding:10,
                borderRadius: 5,
                width: '90%',
                height: 190,
                alignItems: 'center',
                justifyContent: 'space-between'
            },})
        const { dueDate, points, status, title } = selectedQuest
        const date = new Date(dueDate)
        const containerColor = () => {
            if (status === 'complete') {
                return {backgroundColor: colors.button2}
            } else if (status === 'incomplete') {
                return {backgroundColor: colors.button1}
            } else {
                return {}
            }
        }
        const currentStatus = () => {
            if (status === 'complete') {
                return 'Completed'
            } else if (status === 'incomplete') {
                return 'Incomplete'
            } else {
                return {}
            }
        }
        const PopupButton = () => {
            if (status === 'complete') {
                return (
                    <CustomButton
                        buttonStyle={[styles.button, {height: 25, marginTop: 48}]}
                        textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                        onPress={handleReleaseRewards}
                    >Release Rewards</CustomButton>
                )
            } else if (status === 'incomplete') {
                return (
                    <CustomButton
                        buttonStyle={[styles.button, {height: 25, marginTop: 18}]}
                        textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                        onPress={handleDeleteQuest}
                    >Delete</CustomButton>
                )
            } else {
                return null
            }
        }
        return (
            <Modal
                transparent={true}
                visible={props.visibility}
            >
                <View style={popupStyles.container}>
                    <View style={[popupStyles.popupContainer, containerColor()]}>
                        <View style={{width: '100%', alignItems: 'flex-start'}}>
                            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={[styles.text, {fontSize: 22, width: '70%', textAlign: 'left'}]} numberOfLines={1}>Title: {title}</Text>
                                <CustomButton
                                    buttonStyle={[styles.button, {height: 25}]}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => {props.toggleVisibility(false)}}
                                >Close</CustomButton>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.text, {fontSize: 22}]}>Points: </Text>
                                <Text style={[styles.text, {fontSize: 22, maxWidth: '40%',textAlign: 'right'}]} numberOfLines={1}>{points}</Text>
                                <CoinIcon style={{marginLeft: 3, marginTop: 6}} dimension={25}/>
                            </View>
                            <Text style={[styles.text, {fontSize: 22}]}>Status: {currentStatus()}</Text>
                            {status === 'incomplete' &&
                                <Text style={[styles.text, {fontSize: 22, height: 30}]}>Due On: {date.toDateString()} {date.toTimeString().substr(0,5)}</Text>
                            }
                            <View style={{width: '100%', alignItems: 'center'}}>
                                <PopupButton/>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    const questListItem = ({ item }) => {
        return (
            <QuestListItem
                item={item}
                mode={'caregiver'}
                userId={userId}
                childName={name}
                caregiverOnPress={() => {
                    setSelectedQuest(item)
                    setSelectedQuestPopup(true)
                }}
            />
        )
    }
    return (
        <Pressable
            style={[styles.container, expanded ? {} : {height: 70}]}
            onPress={() => {setExpanded(!expanded)}}
        >
            <SelectedQuest
                visibility={selectedQuestPopup}
                toggleVisibility={setSelectedQuestPopup}
            />
            <View style={{width: '100%', height: 30, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.text, {width: '50%', textAlign: 'left'}]} numberOfLines={1}>{name}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.text, {width: 80, textAlign: 'right'}]} numberOfLines={1}>{points}</Text>
                    <CoinIcon style={{marginLeft: 2, marginTop: 5}} dimension={22}/>
                </View>
            </View>
            <Text style={[styles.text, {width: '50%', textAlign: 'left', color: 'white', fontSize: 15, marginTop: 8}]} numberOfLines={1}>{expanded ? 'v Quests':'> Quests'}</Text>
            {expanded &&
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                <View style={{width: '80%'}}>
                    <FlatList
                        style={{width: '100%', marginTop: 5}}
                        data={questList}
                        renderItem={questListItem}
                        keyExtractor={item => item.id}
                    />
                </View>
                <Pressable
                    onPress={handleRemoveChild}
                >
                    <Icon
                        name='trash-2'
                        type='feather'
                        color='white'
                        size={35}
                        style={{marginBottom: 5}}
                    />
                </Pressable>
            </View>
            }
        </Pressable>
    )
}

const styles=StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 7,
        width: '100%',
        marginTop: 8,
        backgroundColor: colors.background3,
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 8,
        paddingVertical: 3
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq',
        textAlign: 'center'
    },
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    },
})

export default ChildListItem