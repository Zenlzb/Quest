import firebase from "./firebase";

const db = firebase.database();

export const setCaregiverPushToken = async (userId, pushToken) => {
    try {
        await db.ref(`users/${userId}/pushToken`).set(pushToken)
    } catch (e) {
        console.error(e)
    }
}

export const getCaregiverPushToken = async (userId) => {
    try {
        return (await db.ref(`users/${userId}/pushToken`).get()).val()
    } catch (e) {
        console.error(e)
    }
}

export const setChildPushToken = async (parentUserId, childName, pushToken) => {
    try {
        await db.ref(`users/${parentUserId}/children/${childName}/pushToken`).set(pushToken)
    } catch (e) {
        console.error(e)
    }
}

export const getChildPushToken = async (parentUserId, childName) => {
    try {
        return (await db.ref(`users/${parentUserId}/children/${childName}/pushToken`).get()).val()
    } catch (e) {
        console.error(e)
    }
}

export const sendPushNotification = async (expoPushToken, notificationTitle, notificationBody) => {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: notificationTitle,
        body: notificationBody,
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}