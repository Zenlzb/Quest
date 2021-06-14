import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import AuthStack from "./AuthStack";
import {auth, getCurrentUserId} from "../../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {checkChildExists} from "../../api/child";
import CustomPopup from "../Components/Popup";
import CustomButton from "../Components/Button";
import CaregiverStack from "./CaregiverStack";
import ChildStack, {AppContext} from "./ChildStack";

const AuthHandler = () => {
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
                },700)
            } else {
                setTimeout( async () => {

                    setUser(user)
                    await AsyncStorage.removeItem('childName')
                    setChildName('')
                }, 500)
            }
        } catch (e) {
            console.log(e)
        }

    }

    const ChildStackWrapper = () => {
        return (
            <AppContext.Provider value={childName}>
                <ChildStack/>
            </AppContext.Provider>
        )
    }

    useEffect(() => {
        return auth.onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
    }, []);

    return(
            <NavigationContainer>
                <CustomPopup
                    visibility={childNotFound}
                    titleText={'Child Not Found'}
                    bodyText={'Add a Child Using the Add Button'}
                    buttonList={
                        () => {
                        return (
                            <CustomButton
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={
                                    () => {
                                        setChildNotFound(false)
                                        setTimeout( async () => {await AsyncStorage.removeItem('childName')}, 500)
                                        setChildName('')
                                    }
                                }
                            >OK</CustomButton>
                        )
                    }}
                />
                {user ? (childName ? <ChildStackWrapper/> : <CaregiverStack/>) : <AuthStack />}
            </NavigationContainer>
    )
}

export default AuthHandler