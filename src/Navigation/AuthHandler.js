import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import AuthStack from "./AuthStack";
import {auth} from "../../api/auth";
import CaregiverMain from "../Pages/Caregiver Main";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChildMain from "../Pages/Child Main";


const AuthHandler = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [childName, setChildName] = useState('')

    function onAuthStateChanged(user) {
        try{
            setTimeout(async () => {
                setUser(user);
                setChildName(await AsyncStorage.getItem('childName'))
                if (initializing) setInitializing(false);
            },700)
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    return(
            <NavigationContainer>
                {user ? (childName ? <ChildMain name={childName}/> : <CaregiverMain/>) : <AuthStack />}
            </NavigationContainer>
    )
}

export default AuthHandler