import React, {useEffect, useState} from 'react'
import {FlatList, Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";
import * as Rewards from '../../api/rewards'
import RewardListItem from "./RewardListItem";
import CustomPopup from "./Popup";

const RewardHistoryModal = (props) => {
    const { userId, childName, caregiver } = props
    const [pendingClaimList, setPendingClaimList] = useState([])
    const [completeClaimList, setCompleteClaimList] = useState([])
    const [completeClaimPopup, setCompleteClaimPopup] = useState(false)
    const [completeClaimId, setCompleteClaimId] = useState('')
    const [completeClaimName, setCompleteClaimName] = useState('')
    const [completeClaimPoints, setCompleteClaimPoints] = useState(0)
    const [completeClaimChild, setCompleteClaimChild] = useState('')

    useEffect(() => {
        if (caregiver) {
            return Rewards.claimListSubscribe(userId, setPendingClaimList, true)
        } else {
            return Rewards.childClaimListSubscribe(userId, childName, setPendingClaimList, true)
        }

    }, [])

    useEffect(() => {
        if (caregiver) {
            return Rewards.claimListSubscribe(userId, setCompleteClaimList, false)
        } else {
            return Rewards.childClaimListSubscribe(userId, childName, setCompleteClaimList, false)
        }

    }, [])

    const claimItem = ({ item }) => {
        return (
            <RewardListItem
                item={item}
                mode={caregiver ? 'caregiverRewardHistory' : 'childRewardHistory'}
                onPress={() => {
                    if (caregiver) {
                        setCompleteClaimId(item.id)
                        setCompleteClaimName(item.rewardName)
                        setCompleteClaimPoints((+item.quantity) * (+item.rewardCost))
                        setCompleteClaimChild(item.childName)
                        setCompleteClaimPopup(true)
                    }
                }}
            />
        )
    }
    const emptyPendingList = () => {
        return (
            <Text style={{fontSize: 25, color: 'grey', textAlign: 'center', fontFamily: 'balsamiq'}}>
                There are no pending reward claims
            </Text>
        )
    }
    const emptyHistoryList = () => {
        return (
            <Text style={{fontSize: 25, color: 'grey', textAlign: 'center', fontFamily: 'balsamiq'}}>
                Reward claim history is empty
            </Text>
        )
    }
    return (
        <Modal
            transparent={true}
            visible={props.visibility}
        >
            <View style={styles.container}>
                <CustomPopup
                    visibility={completeClaimPopup}
                    titleText={'Complete Claim'}
                    bodyText={`Complete: '${completeClaimName}' ?`}
                    containerStyle={{backgroundColor: colors.background2}}
                    textStyle={{color:'black'}}
                    buttonList={() => {
                        return (
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%'}}>
                                <CustomButton
                                    buttonStyle={[styles.button, {backgroundColor: colors.button2}]}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => {
                                        Rewards.completeRewardClaim(userId, completeClaimId)
                                        setCompleteClaimPopup(false)
                                    }}
                                >Accept</CustomButton>
                                <CustomButton
                                    buttonStyle={styles.button}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => {
                                        Rewards.denyRewardClaim(userId, completeClaimId, completeClaimChild, completeClaimPoints)
                                        setCompleteClaimPopup(false)
                                    }}
                                >Deny</CustomButton>
                                <CustomButton
                                    buttonStyle={styles.button}
                                    textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                    onPress={() => {setCompleteClaimPopup(false)}}
                                >Cancel</CustomButton>
                            </View>
                        )
                    }}
                />
                <View style={styles.popupContainer}>
                    <ScrollView style={{height: '95%', width: '100%', marginBottom: 8}}>
                        <View style={{alignItems: 'flex-start', width: '100%', marginBottom: 5}}>
                            <Text style={[styles.text, {fontSize: 30}]}>Pending</Text>
                        </View>
                        <View style={{width: '100%', borderWidth: 2, borderRadius: 5, marginBottom: 8, paddingHorizontal: 8, paddingBottom: 8}}>
                            <View style={{width: '100%', justifyContent: 'center'}}>
                                <FlatList
                                    data={pendingClaimList}
                                    renderItem={claimItem}
                                    keyExtractor={item => item.id}
                                    ListEmptyComponent={emptyPendingList}
                                />
                            </View>

                        </View>
                        <View style={{alignItems: 'flex-start', width: '100%', marginBottom: 5}}>
                            <Text style={[styles.text, {fontSize: 30}]}>History</Text>
                        </View>
                        <View style={{width: '100%', borderWidth: 2, borderRadius: 5, marginBottom: 8, paddingHorizontal: 8, paddingBottom: 8}}>
                            <View style={{width: '100%', justifyContent: 'center'}}>
                                <FlatList
                                    data={completeClaimList.reverse()}
                                    renderItem={claimItem}
                                    keyExtractor={item => item.id}
                                    ListEmptyComponent={emptyHistoryList}
                                />
                            </View>

                        </View>
                    </ScrollView>
                    <CustomButton
                        buttonStyle={styles.button}
                        textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                        onPress={() => props.toggleVisibility(false)}
                    >Close</CustomButton>
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
        width: 350,
        height: 600,
        alignItems: 'center',
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
})

export default RewardHistoryModal