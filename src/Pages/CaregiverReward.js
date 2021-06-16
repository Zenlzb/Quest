import React, {useEffect, useState} from 'react';
import {FlatList, Keyboard, StyleSheet, Text, TextInput, View} from "react-native";
import colors from "../../assets/themes/colors";
import CustomButton from "../Components/Button";
import ErrorText from "../Components/ErrorText";
import * as Rewards from '../../api/rewards'
import CoinIcon from '../Components/CoinIcon'

const CaregiverReward = ({ route, navigation }) => {
    const { userId } = route.params
    const [rewardName, setRewardName] = useState('')
    const [rewardCost, setRewardCost] = useState('')
    const [rewardAvailable, toggleRewardAvailable] = useState(true)
    const handleRewardNameUpdate = (text) => {setRewardName(text)}
    const handleRewardCostUpdate = (text) => {setRewardCost(text)}

    const [errorCode, setErrorCode] = useState('')
    const errors = [
        {code: 'emptyName', text: 'Please fill in a name', key:'1'},
        {code: 'emptyCost', text: 'Cost is empty or 0', key:'2'},
        {code: 'costNaN', text: 'Please only fill numbers into cost', key:'3'},
    ]
    const validateRewardCreate = () => {
        if (rewardName === '') {
            setErrorCode('emptyName')
            return false
        } else if (+rewardCost === 0) {
            setErrorCode('emptyCost')
            return false
        } else if (isNaN(+rewardCost)) {
            setErrorCode('costNaN')
            return false
        }
        return true
    }
    const handleCreateReward = () => {
        setErrorCode('')
        if (!validateRewardCreate()) { return }
        Rewards.createReward(userId, rewardName, rewardCost, rewardAvailable)
        Keyboard.dismiss()
    }

    const [rewardList, setRewardList] = useState('')
    useEffect(() => {
        return Rewards.rewardListSubscribe(userId, setRewardList)
    }, [])

    const rewardItem = ({ item }) => {
        return (
            <View style={{
                borderWidth: 2,
                borderRadius: 7,
                width: '95%',
                height: 40,
                marginTop: 8,
                backgroundColor: colors.background2,
                alignItems: 'flex-start',
                flexDirection: 'row',
                paddingHorizontal: 8,
                paddingVertical: 3
            }}>
                <Text style={[styles.text, {fontSize: 18, width: 90, textAlign: 'right'}]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.text, {fontSize: 18, width: 80, textAlign: 'right'}]} numberOfLines={1}>{item.cost}</Text>
                <CoinIcon style={{marginLeft: 2, marginTop: 2}} dimension={22}/>
                {item.availability ? <Text style={[styles.text, {fontSize: 18, marginLeft: 30, color: colors.button2}]}>Available</Text>
                    : <Text style={[styles.text, {fontSize: 18, marginLeft: 30, color: colors.button1}]}>Not Available</Text> }

            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={[styles.text, {fontSize: 40}]}>Rewards</Text>
                <CustomButton
                    buttonStyle={[styles.button, {marginLeft: 8, height: 25, marginTop: 21}]}
                    textStyle={[styles.text, {paddingVertical: 1, fontSize: 17}]}
                    onPress={() => {navigation.navigate('Caregiver Main')}}
                >Main ></CustomButton>
            </View>
            <View style={{borderWidth: 2, borderRadius: 7, width: '95%', height: 170, alignItems: 'flex-start'}}>
                <Text style={[styles.text, {fontSize: 22, marginLeft: 8, marginBottom: 5}]}>Create Reward</Text>
                <View style={{width: '100%', height: 100, flexDirection: 'row'}}>
                    <View style={{width: '70%', marginLeft: 8}}>
                        <TextInput
                            style={[styles.textInput, {marginBottom: 8}]}
                            placeholder={"Name"}
                            onChangeText={handleRewardNameUpdate}
                            value={rewardName}
                        />
                        <View style={{flexDirection: 'row', marginBottom: 8}}>
                            <Text style={[styles.text]}>Point Cost</Text>
                            <TextInput
                                style={[styles.textInput, {width: '50%', marginHorizontal: 8}]}
                                onChangeText={handleRewardCostUpdate}
                                value={rewardCost}
                                keyboardType='numeric'
                                textAlign='right'
                            />
                            <CoinIcon dimension={30}/>
                        </View>
                        <View style={{flexDirection: 'row', height: 25}}>
                            <Text style={[styles.text]}>Available?</Text>
                            <CustomButton
                                buttonStyle={[
                                    styles.button,
                                    rewardAvailable ? {backgroundColor: colors.button2} : {backgroundColor: colors.button1},
                                    { marginLeft: 8 }
                                ]}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => {toggleRewardAvailable(true)}}
                            >Yes</CustomButton>
                            <CustomButton
                                buttonStyle={[
                                    styles.button,
                                    rewardAvailable ? {backgroundColor: colors.button1} : {backgroundColor: colors.button2},
                                    { marginLeft: 8 }
                                ]}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => {toggleRewardAvailable(false)}}
                            >No</CustomButton>
                        </View>
                        <ErrorText
                            errorCode={errorCode}
                            setErrorCode={setErrorCode}
                            errors={errors}
                        />
                    </View>
                    <View style={{alignItems: 'center', justifyContent: 'center', width: '30%'}}>
                        <CustomButton
                            buttonStyle={[styles.button, {marginLeft: 8, height: 45, width: 45}]}
                            textStyle={{fontSize:35, fontFamily: 'balsamiq', paddingBottom: 8}}
                            onPress={handleCreateReward}
                        >+</CustomButton>
                    </View>

                </View>
            </View>
            <View style={{width: '95%', justifyContent: 'center', marginLeft: 15}}>
                <FlatList
                    data={rewardList}
                    renderItem={rewardItem}
                    keyExtractor={item => item.id}
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
    titleContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        marginTop: 45
    },
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
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
        width: '100%',
        height: 30,
        paddingHorizontal: 5,
        fontFamily: 'balsamiq',
    }
})
export default CaregiverReward