import React, {useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import AuthStack from "./AuthStack";
import {auth} from "../../api/auth";
import CaregiverMain from "../Pages/Caregiver Main";


const AuthHandler = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    function onAuthStateChanged(user) {
        setTimeout(() => {
            setUser(user);
            if (initializing) setInitializing(false);
        },500)
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    return(
            <NavigationContainer>
                {user ? <CaregiverMain/> : <AuthStack />}
            </NavigationContainer>
    )
}

export default AuthHandler