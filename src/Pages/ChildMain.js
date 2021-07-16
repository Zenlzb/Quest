import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import {getCurrentUserId, signOut} from "../../api/auth";
import CustomButton from "../Components/Button";
import colors from "../../assets/themes/colors";
import * as Quests from "../../api/quest"
import * as Children from "../../api/child"
import CoinIcon from "../Components/CoinIcon";
import QuestListItem from "../Components/QuestListItem";
import CustomTooltip from "../Components/Tooltip";
import {Icon} from "react-native-elements";
import QuestHistoryModal from "../Components/QuestHistory";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Notifs from "../../api/notifications"


const ChildMain = ({ name, navigation }) => {
    const [parentUserId, setParentUserId] = useState(getCurrentUserId());
    const [childStats, setChildStats] = useState({key: '1', name:'a', points: '0'})
    const [questList, setQuestList] = useState([])
    const [reloadList, setReloadList] = useState(0)
    const [swapMode, setSwapMode] = useState(false)
    const [swappingQuest, setSwappingQuest] = useState(null)
    const [questHistoryModal, setQuestHistoryModal] = useState(false)

    useEffect(() => {
        return Quests.questListSubscribe(parentUserId, name, setQuestList)
    }, [])
    useEffect(() => {
        return Children.childStatSubscribe(parentUserId, name, setChildStats)
    }, [])

    const handleSignOut = () => {
        signOut();
    }

    const renderItem = ({item}) => {
        const handleSwap = () => {
            if (swappingQuest !== item.id) {
                Quests.swapQuests(parentUserId, name, swappingQuest, item.id)
            }
            setSwapMode(false)
        }
        return (
            <Pressable
                onPress={swapMode ? handleSwap : () => {}}
            >
                <QuestListItem
                    item={item}
                    mode={'child'}
                    parentUserId={parentUserId}
                    childName={name}
                    swapMode={swapMode}
                    setSwapMode={setSwapMode}
                    swappingQuest={swappingQuest}
                    setSwappingQuest={setSwappingQuest}
                />
            </Pressable>

        )
    }
    const emptyList = () => {
        return (
            <Text style={{fontSize: 20, color: 'grey', textAlign: 'center', fontFamily: 'balsamiq'}}>
                You don't have any quests right now!
            </Text>
        )
    }

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(null);
    const notificationListener = useRef(null);
    const responseListener = useRef(null);

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    async function registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            await Notifs.setChildPushToken(parentUserId, name, token)
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }

    return(
        <View style={styles.container}>
            <QuestHistoryModal
                mode={'child'}
                parentUserId={parentUserId}
                childName={name}
                visibility={questHistoryModal}
                toggleVisibility={setQuestHistoryModal}
            />
            <View style={styles.topContainer}>
                <Text style={[styles.text, {flex: 0.5, fontSize: 17}]} numberOfLines={1}>{name}</Text>
                <View style={{flex: 0.5, flexDirection: 'row'}}>
                    <Text style={[styles.text, {textAlign: 'center',fontSize: 17}]} numberOfLines={1}>{childStats.points}</Text>
                    <CoinIcon style={{marginLeft: 2, marginTop: 3}} dimension={20}/>
                </View>
                <CustomButton
                    buttonStyle={styles.button}
                    textStyle={[styles.text, {paddingVertical: 1, fontSize: 17}]}
                    onPress={handleSignOut}
                >Sign Out</CustomButton>
            </View>
            {!swapMode && <View style={styles.titleContainer}>
                <Text style={[styles.text, {fontSize: 40}]}>Quests</Text>
                <View style={{flexDirection: 'row', marginTop: 21, height: 25}}>
                    <Pressable
                        style={{height: 28, width: 28, borderRadius: 7, backgroundColor: colors.button1, marginRight: 8, alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => {setReloadList(reloadList + 1)}}
                        android_ripple={{color: 'white', borderless: false}}
                    >
                        <Icon
                            name='refresh-cw'
                            type='feather'
                            color='white'
                            size={17}
                        />
                    </Pressable>
                    <CustomButton
                        buttonStyle={[styles.button, {marginRight: 8}]}
                        textStyle={{fontFamily: 'balsamiq', fontSize: 15, color: colors.button3}}
                        onPress={() => {navigation.navigate('Child Reward', {parentUserId: parentUserId, childName: name})}}
                    >Rewards</CustomButton>
                    <CustomButton
                        buttonStyle={[styles.button, {marginRight: 8}]}
                        textStyle={{fontFamily: 'balsamiq', fontSize: 15}}
                        onPress={() => {setQuestHistoryModal(true)}}
                    >History</CustomButton>
                </View>
            </View>}
            {swapMode && <View style={styles.titleContainer}>
                <Text style={[styles.text, {fontSize: 40}]}>Swap</Text>
                <View style={{flexDirection: 'row', marginTop: 21, height: 25}}>
                    <CustomTooltip
                        modal={false}
                        height={30}
                        width={280}
                        circleSize={27}
                    >
                        Click on another quest to swap places
                    </CustomTooltip>
                    <CustomButton
                        buttonStyle={[styles.button, {marginHorizontal: 8}]}
                        textStyle={{fontFamily: 'balsamiq', fontSize: 15}}
                        onPress={() => {setSwapMode(false)}}
                    >Cancel</CustomButton>
                </View>
            </View>}
            <View style={styles.questListContainer}>
                <FlatList
                    style={{width:'100%'}}
                    data={questList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={emptyList}
                    extraData={reloadList}
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
        alignItems: 'center',
        width: '100%'
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: 45,
        paddingHorizontal: 10,
        paddingVertical: 3,
        height: 40,
        width: '95%',
        borderWidth: 2,
        borderRadius: 5,
        alignItems: 'center'
    },
    titleContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        paddingHorizontal: 8,
        justifyContent: 'space-between'
    },
    questListContainer: {
        width: '95%',
        height: '79%',
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
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

})
export default ChildMain;