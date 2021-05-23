import React from 'react';
import firebase from "./firebase";

export const auth = firebase.auth()

export const signIn = async ({ email, password }) => {
    try {
        await auth.signInWithEmailAndPassword(email, password);
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

