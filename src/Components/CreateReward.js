import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TextInput, View} from 'react-native';
import colors from "../../assets/themes/colors";
import CoinIcon from "./CoinIcon";
import CustomButton from "./Button";
import ErrorText from "./ErrorText";
import * as Rewards from '../../api/rewards'

const CreateRewardModal = (props) => {
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
    const validateRewardSave = () => {
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
    const handleRewardSave = () => {
        setErrorCode('')
        if (!validateRewardSave()) { return }
        Rewards.editReward(props.userId, props.id, rewardName, rewardCost, rewardAvailable)
        props.toggleVisibility(false)
    }
    const handleRewardDelete = () => {
        setErrorCode('')
        Rewards.deleteReward(props.userId, props.id)
        props.toggleVisibility(false)
    }

    return(
        <Modal
            transparent={true}
            visible={props.visibility}
            onShow={() => {
                setRewardName(props.name)
                setRewardCost(props.cost)
                toggleRewardAvailable(props.availability)
            }}
        >
            <View style={styles.container}>
                <View style={styles.popupContainer}>
                    <View style={{borderWidth: 2, borderRadius: 7, width: '100%', height: 170, alignItems: 'flex-start'}}>
                        <Text style={[styles.text, {fontSize: 22, marginLeft: 8, marginBottom: 5}]}>Edit Reward</Text>
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
                                        style={[styles.textInput, {width: '43%', marginHorizontal: 8}]}
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
                            <View style={{alignItems: 'center', justifyContent: 'center', width: '30%', marginBottom: 10, marginLeft:4}}>
                                <CustomButton
                                    buttonStyle={[styles.button]}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={handleRewardDelete}
                                >Delete</CustomButton>
                                <CustomButton
                                    buttonStyle={[styles.button, {marginTop: 70}]}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={handleRewardSave}
                                >Save</CustomButton>
                                <CustomButton
                                    buttonStyle={[styles.button, {marginTop: 8}]}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => {props.toggleVisibility(false)}}
                                >Cancel</CustomButton>
                            </View>

                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.transparentBackground,
    },
    popupContainer: {
        backgroundColor: colors.background,
        padding:10,
        borderRadius: 5,
        width: '90%',
        height: 190,
        alignItems: 'center',
        justifyContent: 'space-between'
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

export default CreateRewardModal