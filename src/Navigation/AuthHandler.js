import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import AuthStack from "./AuthStack";
import {auth, getCurrentUserId} from "../../api/auth";
import CaregiverMain from "../Pages/Caregiver Main";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChildMain from "../Pages/Child Main";
import {checkChildExists} from "../../api/child";
import CustomPopup from "../Components/Popup";


const AuthHandler = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [childName, setChildName] = useState('')
    const [childNotFound, setChildNotFound] = useState(false)

    function onAuthStateChanged(user) {
        try{
            if (user) {
                setTimeout(async () => {
                    const name = await AsyncStorage.getItem('childName')
                    if(name != null) {
                        const childExists = await checkChildExists(getCurrentUserId(), name)
                        if (childExists) {
                            setChildName(name)
                            console.log('exists')
                        } else {
                            setChildNotFound(true)
                            console.log('doesnt exist')
                        }
                    }

                    setUser(user)
                    if (initializing) setInitializing(false);
                },700)
            } else {
                setTimeout( async () => {

                    setUser(user)
                    await AsyncStorage.removeItem('childName')
                    setChildName('')
                    if (initializing) setInitializing(false);
                }, 500)
            }
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        return auth.onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
    }, []);

    return(
            <NavigationContainer>
                <CustomPopup
                    visibility={childNotFound}
                    toggleVisibility={setChildNotFound}
                    titleText={'Child Not Found'}
                    bodyText={'Add a Child Using the Add Button'}
                />
                {user ? (childName ? <ChildMain name={childName}/> : <CaregiverMain/>) : <AuthStack />}
            </NavigationContainer>
    )
}

export default AuthHandler