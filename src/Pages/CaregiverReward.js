import React, {useEffect, useState} from 'react';
import {FlatList, Keyboard, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import colors from "../../assets/themes/colors";
import CustomButton from "../Components/Button";
import ErrorText from "../Components/ErrorText";
import * as Rewards from '../../api/rewards'
import CoinIcon from '../Components/CoinIcon'
import CreateRewardModal from "../Components/CreateReward";
import RewardListItem from "../Components/RewardListItem";
import RewardHistoryModal from "../Components/RewardHistory";
import CustomTooltip from "../Components/Tooltip";

const CaregiverReward = ({ route, navigation }) => {
    const { userId } = route.params
    const [rewardName, setRewardName] = useState('')
    const [rewardCost, setRewardCost] = useState('')
    const [rewardAvailable, toggleRewardAvailable] = useState(true)
    const handleRewardNameUpdate = (text) => {setRewardName(text)}
    const handleRewardCostUpdate = (text) => {setRewardCost(text)}

    const [popupId, setPopupId] = useState('')
    const [popupName, setPopupName] = useState('')
    const [popupCost, setPopupCost] = useState('')
    const [popupAvailable, setPopupAvailable] = useState(false)
    const [rewardModal, toggleRewardModal] = useState(false)
    const handleEditReward = (id, name, cost, availability) => {
        setPopupId(id)
        setPopupName(name)
        setPopupCost(cost)
        setPopupAvailable(availability)
        toggleRewardModal(true)
    }

    const [rewardHistoryModal, toggleRewardHistoryModal] = useState(false)

    const [errorCode, setErrorCode] = useState('')
    const errors = [
        {code: 'emptyName', text: 'Please fill in a name', key:'1'},
        {code: 'emptyCost', text: 'Cost is empty or 0', key:'2'},
        {code: 'costNaN', text: 'Please only fill numbers into cost', key:'3'},
        {code: 'costLarge', text: 'Cost cannot exceed 10,000,000', key:'4'},
        {code: 'costNegative', text: 'Cost cannot be negative', key:'5'},
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
        } else if ((+rewardCost) > 10000000) {
            setErrorCode('costLarge')
            return false
        } else if (+rewardCost < 0) {
            setErrorCode('costNegative')
            return false
        }
        return true
    }
    const handleCreateReward = () => {
        setErrorCode('')
        if (!validateRewardCreate()) { return }
        Rewards.createReward(userId, rewardName, rewardCost, rewardAvailable)
        setRewardName('')
        setRewardCost('')
        toggleRewardAvailable(true)
        Keyboard.dismiss()
    }

    const [rewardList, setRewardList] = useState('')
    useEffect(() => {
        return Rewards.rewardListSubscribe(userId, setRewardList, false)
    }, [])

    const rewardItem = ({ item }) => {
        return (
            <RewardListItem
                item={item}
                onPress={() => {handleEditReward(item.id, item.name, item.cost, item.availability)}}
                mode='caregiverReward'
            />
        )
    }

    return (
        <View style={styles.container}>
            <CreateRewardModal
                visibility={rewardModal}
                toggleVisibility={toggleRewardModal}
                userId={userId}
                id={popupId}
                name={popupName}
                cost={popupCost}
                availability={popupAvailable}
            />
            <RewardHistoryModal
                visibility={rewardHistoryModal}
                toggleVisibility={toggleRewardHistoryModal}
                userId={userId}
                caregiver={true}
            />
            <View style={styles.titleContainer}>
                <Text style={[styles.text, {fontSize: 40}]}>Rewards</Text>
                <View style={{flexDirection:'row', height: 25, marginTop: 21}}>
                    <CustomButton
                        buttonStyle={styles.button}
                        textStyle={[styles.text, {paddingVertical: 1, fontSize: 17}]}
                        onPress={() => {toggleRewardHistoryModal(true)}}
                    >Pending</CustomButton>
                    <CustomButton
                        buttonStyle={[styles.button, {marginLeft: 8,}]}
                        textStyle={[styles.text, {paddingVertical: 1, fontSize: 17}]}
                        onPress={() => {navigation.navigate('Caregiver Main')}}
                    >Main ></CustomButton>
                </View>
            </View>
            <ScrollView style={{width: '100%', height: '90%', marginBottom: 5}} contentContainerStyle={{alignItems: 'center'}}>
                <View style={styles.createRewardContainer}>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{width: '70%', alignItems: 'flex-start'}}>
                            <Text style={[styles.text, {fontSize: 22, marginBottom: 5}]}>Create Reward</Text>
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
                                        { marginHorizontal: 8 }
                                    ]}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => {toggleRewardAvailable(false)}}
                                >No</CustomButton>
                                <CustomTooltip
                                    height={42}
                                    width={330}
                                    circleSize={25}
                                >
                                    Whether or not your children can see the reward. You can toggle this at any time.
                                </CustomTooltip>
                            </View>
                            <ErrorText
                                errorCode={errorCode}
                                setErrorCode={setErrorCode}
                                errors={errors}
                            />
                        </View>

                        <CustomButton
                            buttonStyle={[styles.button, {height: 45, width: 45}]}
                            textStyle={{fontSize:35, fontFamily: 'balsamiq', paddingBottom: 8}}
                            onPress={handleCreateReward}
                        >+</CustomButton>

                    </View>
                </View>
                <View style={{width: '95%', justifyContent: 'center', marginTop: 5}}>
                    <FlatList
                        data={rewardList}
                        renderItem={rewardItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            </ScrollView>

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
        height: '10%',
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        marginTop: 45
    },
    createRewardContainer: {
        borderWidth: 2,
        borderRadius: 7,
        width: '95%',
        height: 170,
        paddingHorizontal: 8,
        paddingVertical: 5,
        alignItems: 'flex-start',
        backgroundColor: colors.background2
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
    },

})
export default CaregiverReward