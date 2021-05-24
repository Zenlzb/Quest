import React from 'react';
import firebase from "./firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const auth = firebase.auth()

export const signIn = async ({ email, password, childLink }) => {
    try {
        const { user } = await auth.signInWithEmailAndPassword(email, password);
        // TODO check if child exists
        await AsyncStorage.setItem('childName', childLink)
    } catch (error) {
        console.error(error);
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

