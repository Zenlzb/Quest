import React from 'react';
import firebase from "./firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const auth = firebase.auth()

export const signIn = async ({ email, password, childLink }, setErrorCode) => {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        await AsyncStorage.setItem('childName', childLink)
    } catch (error) {
        const code = error.code
        if (code==='auth/wrong-password' ||
            code==='auth/too-many-requests') {
            setErrorCode(code)
        } else {
            console.log(code)
            console.error(error);
        }
    }
}

export const createAccount = async ({ name, email, password }) => {
    try {

        const { user } = await auth.createUserWithEmailAndPassword(email, password)
        if (user) {
            await user.updateProfile({ displayName: name });
            // await user.sendEmailVerification();
        }
    } catch (error) {
        console.error(error);
    }
}

export const signOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error(error);
    }
}

export const getCurrentUserId = () => auth.currentUser ? auth.currentUser.uid : null;

export const getCurrentUserName = () => auth.currentUser ? auth.currentUser.displayName : null;
