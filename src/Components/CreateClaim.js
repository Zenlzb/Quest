import React, {useState} from 'react'
import {Modal, StyleSheet, Text, TextInput, View} from "react-native";
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";
import CoinIcon from "./CoinIcon";
import ErrorText from "./ErrorText";
import * as Rewards from '../../api/rewards'
import * as Notifs from "../../api/notifications";

const CreateClaim = (props) => {
    const { parentUserId, childName, childBalance, visibility, toggleVisibility } = props
    const [rewardName, setRewardName] = useState('')
    const [rewardCost, setRewardCost] = useState('')
    const [quantity, setQuantity] = useState('')
    const handleQuantityUpdate = (text) => setQuantity(text)
    const handleCreateClaim = async () => {
        setErrorCode('')
        if (isNaN(+quantity)) {
            setErrorCode('quantityNaN')
            return
        } else if (quantity > 1000) {
            setErrorCode('quantityLarge')
            return
        } else if (+quantity === 0) {
            setErrorCode('quantityZero')
            return
        } else if (+quantity < 0) {
            setErrorCode('quantityNegative')
            return
        } else if (+quantity % 1 !== 0){
            setErrorCode('quantityDecimal')
            return
        } else if ((+rewardCost)*(+quantity) > childBalance) {
            setErrorCode('notEnoughPoints')
            return
        }
        await Rewards.createRewardClaim(parentUserId, quantity, childName, rewardName, rewardCost, new Date().toJSON())
        await Notifs.sendPushNotification(await Notifs.getCaregiverPushToken(parentUserId), "Reward Purchased!", `${childName} has purchased '${rewardName}'!`)
        toggleVisibility(false)
    }

    const [errorCode, setErrorCode] = useState(null)
    const errors = [
        {code: 'quantityNaN', text: 'Please input a number into quantity', key:'1'},
        {code: 'quantityLarge', text: 'Max quantity is 1,000', key:'2'},
        {code: 'quantityZero', text: 'Quantity cannot be 0', key:'3'},
        {code: 'quantityNegative', text: 'Quantity cannot be negative', key:'4'},
        {code: 'quantityDecimal', text: 'Quantity cannot be decimal', key:'5'},
        {code: 'notEnoughPoints', text: 'Not enough points', key:'6'},
    ]
    return (
        <Modal
            transparent={true}
            visible={visibility}
            onShow={() => {
                setRewardName(props.rewardName)
                setRewardCost(props.rewardCost)
                setQuantity('')
                setErrorCode('')
            }}
        >
            <View style={styles.container}>
                <View style={styles.popupContainer}>
                    <View style={[styles.textContainer, {alignItems: 'flex-start'}]}>
                        <Text style={[styles.text, {width: '50%', textAlign: 'left'}, rewardName.length>20 ? {fontSize: 18} : {}]} numberOfLines={3}>{rewardName}</Text>
                        <View style={{flexDirection: 'row', width: '20%', justifyContent: 'flex-end'}}>
                            <Text style={[styles.text, {width: '80%', textAlign: 'right'}]} numberOfLines={1}>{rewardCost}</Text>
                            <CoinIcon style={{marginLeft: 2, marginTop: 5}} dimension={25}/>
                        </View>
                        <View style={{flexDirection: 'row', width: '20%', justifyContent: 'flex-end'}}>
                            <Text style={styles.text} numberOfLines={1}>x</Text>
                            <TextInput
                                style={styles.quantityTextInput}
                                keyboardType='numeric'
                                placeholder={"Qty"}
                                onChangeText={handleQuantityUpdate}
                                value={quantity}
                            />
                        </View>
                    </View>
                    <View style={{width: '100%',  alignItems: 'center'}}>
                        <ErrorText
                            errorCode={errorCode}
                            setErrorCode={setErrorCode}
                            errors={errors}
                        />
                        <View style={{flexDirection: 'row', marginTop: 5}}>
                            <CustomButton
                                buttonStyle={[styles.button, {marginRight: 8}]}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={handleCreateClaim}
                            >Buy</CustomButton>
                            <CustomButton
                                buttonStyle={styles.button}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => {toggleVisibility(false)}}
                            >Cancel</CustomButton>
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
        backgroundColor: colors.background2,
        padding:10,
        borderRadius: 5,
        width: '80%',
        height: 150,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
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
    quantityTextInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 3,
        backgroundColor: '#fff',
        fontSize: 15,
        height: 30,
        paddingLeft: 5,
        fontFamily: 'balsamiq',
        width: 50,
        textAlign: 'right',
        paddingRight: 5,
        marginLeft: 5
    },

})
export default CreateClaim