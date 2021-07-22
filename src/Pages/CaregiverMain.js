import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput, FlatList, Keyboard, Pressable, Dimensions, Platform} from "react-native";
import CustomButton from "../Components/Button";
import {auth, signOut, getCurrentUserId} from "../../api/auth";
import colors from "../../assets/themes/colors";
import * as Children from "../../api/child"
import CreateQuestModal from "../Components/CreateQuest";
import ErrorText from "../Components/ErrorText";
import CustomPopup from "../Components/Popup";
import ChildListItem from "../Components/ChildListItem";
import {Icon} from "react-native-elements";
import * as Quests from "../../api/quest";
import * as Notifications from "expo-notifications";
import Constants from 'expo-constants';
import * as Notifs from "../../api/notifications"

const CaregiverMain = ({ navigation }) => {
    const [childList, setChildList] = useState([])
    const [userId, setUserId] = useState(getCurrentUserId());
    const [questModalVisible, toggleQuestModal] = useState(false)
    const [signOutConfirm, setSignOutConfirm] = useState(false)
    const [deleteChildPopup, setDeleteChildPopup] = useState(false)
    const [deleteChild, setDeleteChild] = useState()
    const [questCreated, setQuestCreated] = useState(false)
    const [reloadList, setReloadList] = useState(0)
    const { width, scale } = Dimensions.get("screen")
    const fontScale = (width * scale) / 540

    const [childNameInput, setChildNameInput] = useState('')
    const handleChildNameUpdate = (text) => setChildNameInput(text)

    const handleSignOut = () => {setSignOutConfirm(true)}
    const handleAddChild = () => {
        if (childNameInput === '') {
            setErrorCode('invalid')
            return
        }
        Children.checkChildExists(userId, childNameInput).then((childExists) => {
            if (!childExists) {
                setErrorCode(null)
                Children.createChild(userId, childNameInput)
                Keyboard.dismiss()
                setChildNameInput('')
            } else {
                console.log('already exists')
                setErrorCode('alreadyExists')
            }
        })
    }
    const handleDeleteChild = () => {
        Children.deleteChild(userId, deleteChild)
        setDeleteChildPopup(false)
    }
    const handleCreateQuest = () => {
        if (childList.length === 0) {
            setErrorCode('noChild')
            return
        }
        setErrorCode(null)
        toggleQuestModal(true)
    }
    const handleReleaseAll = () => {
        for (let id in childList) {
            Quests.releaseAllRewards(userId, childList[id].name)
        }

    }

    useEffect(() => {
        return Children.childListSubscribe(userId, setChildList)
    }, [])

    const renderItem = ({ item }) => {
        return (
            <ChildListItem
                item={item}
                userId={userId}
                fontScale={fontScale}
                handleRemoveChild={() => {
                    setDeleteChild(item.name)
                    setDeleteChildPopup(true)
                }}
            />
        )
    }
    const emptyList = () => {
        return (
            <Text style={{fontSize: 20, color: 'grey', textAlign: 'center', fontFamily: 'balsamiq'}}>
                Welcome! {'\n'}
                Getting Started: {'\n'}
                1. Add a Child! {'\n'}
                2. Add <Text style={{color: colors.button3}}>Rewards</Text>!{'\n'}
                3. Create a Quest! {'\n'}
            </Text>
        )
    }

    const [errorCode, setErrorCode] = useState(null)
    const errors = [
        {code: 'invalid', text: 'Invalid Name', key:'1'},
        {code: 'alreadyExists', text: 'Child already exists', key:'2'},
        {code: 'noChild', text: 'No child found, add a child first', key:'3'}
    ]

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
            await Notifs.setCaregiverPushToken(userId, token)
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
            <CreateQuestModal
                userId={userId}
                visibility={questModalVisible}
                toggleVisibility={toggleQuestModal}
                setQuestCreated={setQuestCreated}
                childList={childList}
            />
            <CustomPopup
                visibility={questCreated}
                titleText={'Quest Created!'}
                bodyText={'Quest successfully created'}
                containerStyle={{backgroundColor:colors.background}}
                textStyle={{color:'black'}}
                buttonList={() => {
                    return (
                        <CustomButton
                            textStyle={{fontSize:15, fontFamily: 'balsamiq', color:'black'}}
                            onPress={() => setQuestCreated(false)}
                        >Close</CustomButton>
                    )
                }}
            />
            <CustomPopup
                visibility={signOutConfirm}
                titleText={'Sign out'}
                bodyText={'Are you sure you want to sign out?'}
                buttonList={() => {
                        return (
                            <View style={{flexDirection: 'row',}}>
                                <CustomButton
                                    buttonStyle={{marginHorizontal: 8}}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => signOut()}
                                >Yes</CustomButton>
                                <CustomButton
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => setSignOutConfirm(false)}
                                >Cancel</CustomButton>
                            </View>
                        )
                    }}
            />
            <CustomPopup
                visibility={deleteChildPopup}
                titleText={'Remove Child'}
                bodyText={`Are you sure you want to remove "${deleteChild}" ?`}
                numberOfLines={2}
                textStyle={{textAlign: 'center'}}
                buttonList={() => {
                    return (
                        <View style={{flexDirection: 'row',}}>
                            <CustomButton
                                buttonStyle={{marginHorizontal: 8}}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={handleDeleteChild}
                            >Remove</CustomButton>
                            <CustomButton
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => setDeleteChildPopup(false)}
                            >Cancel</CustomButton>
                        </View>
                    )
                }}
            />
            <View style={styles.topContainer}>
                <CustomButton
                    buttonStyle={styles.button}
                    textStyle={[styles.text, {paddingVertical: 1, fontSize: 17}]}
                    onPress={handleSignOut}
                >Sign Out</CustomButton>
                <Text style={[styles.text, {textAlign: 'right', fontSize: 17, width: '70%'}]} numberOfLines={1}>
                    Welcome, Caregiver {auth.currentUser.displayName}
                </Text>
            </View>

            <View style={styles.titleContainer}>
                <Text style={[styles.text, {fontSize: 35+fontScale*5}]}>Children</Text>
                <View style={{flexDirection: 'row', marginLeft: 3, marginTop: 12 + fontScale*2, height: 25}}>
                    <CustomButton
                        buttonStyle={[styles.button, {marginRight: 8}]}
                        textStyle={{fontFamily: 'balsamiq', fontSize: 12 + fontScale, color: colors.button3}}
                        onPress={() => {
                            navigation.navigate('Caregiver Reward', { userId: userId })
                        }}
                    >Rewards</CustomButton>
                    <CustomButton
                        buttonStyle={styles.button}
                        textStyle={{fontFamily: 'balsamiq', fontSize: 12 + fontScale}}
                        onPress={handleCreateQuest}
                    >+ Create Quest</CustomButton>
                </View>
            </View>

            <View style={styles.childContainer}>
                <View style={styles.addChildContainer}>
                    <TextInput
                        style={[styles.textInput, {marginRight: 8, width: '70%'}]}
                        placeholder={"Add Child"}
                        onChangeText={handleChildNameUpdate}
                        value={childNameInput}
                    />
                    <CustomButton
                        buttonStyle={[styles.button, {height: 33}]}
                        textStyle={{fontFamily: 'balsamiq', fontSize: 12 + fontScale*3}}
                        onPress={handleAddChild}
                    >Add</CustomButton>
                    <Pressable
                        style={{height: 33, width: 33, borderRadius: 7, backgroundColor: colors.button1, marginLeft: 8, alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => {setReloadList(reloadList + 1)}}
                        android_ripple={{color: 'white', borderless: false}}
                    >
                        <Icon
                            name='refresh-cw'
                            type='feather'
                            color='white'
                            size={20}
                        />
                    </Pressable>
                </View>
                <View style={styles.releaseButtonContainer}>
                    <CustomButton
                        buttonStyle={[styles.button, {backgroundColor: colors.button2}]}
                        textStyle={{fontFamily: 'balsamiq', fontSize: 12 + fontScale*2}}
                        onPress={handleReleaseAll}
                    >Release rewards for all completed quests</CustomButton>
                </View>
                <ErrorText
                    errorCode={errorCode}
                    setErrorCode={setErrorCode}
                    errors={errors}
                />
                <FlatList
                    style={styles.flatList}
                    data={childList}
                    renderItem={renderItem}
                    keyExtractor={item => item.key}
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
        marginBottom: 8,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        height: 27,
        width: '100%'
    },
    childContainer: {
        width: '95%',
        height: '79%',
        borderWidth: 2,
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    addChildContainer: {
        height: 33,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    releaseButtonContainer: {
        height: 25,
        width: '100%',
        paddingHorizontal: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq',
        textAlign: 'center'
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: '#fff',
        fontSize: 20,
        width: '80%',
        height: 33,
        paddingLeft: 5,
        fontFamily: 'balsamiq'
    },
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    },
    errorText: {
        fontFamily:'balsamiq',
        fontSize: 15,
        color: colors.button1
    },
    flatList: {
        width: '95%',
        height: '70%',
        marginTop:8
    }
})

export default CaregiverMain;

