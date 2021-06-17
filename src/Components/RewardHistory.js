import React, {useEffect, useState} from 'react'
import {FlatList, Modal, StyleSheet, Text, View} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";
import * as Rewards from '../../api/rewards'
import RewardListItem from "./RewardListItem";

const RewardHistoryModal = (props) => {
    const [pendingClaimList, setPendingClaimList] = useState([])

    useEffect(() => {
        return Rewards.pendingClaimListSubscribe(props.userId, setPendingClaimList)
    }, [])

    const test = () => {
        Rewards.createRewardClaim(props.userId,  3, 'Bob', 'Book', 100, new Date().toJSON())
    }
    const claimItem = ({ item }) => {
        return (
            <RewardListItem
                item={item}
                mode='caregiverRewardHistory'
                onPress={() => {}}
            />
        )
    }
    return (
        <Modal
            transparent={true}
            visible={props.visibility}
            onShow={() => {

            }}
        >
            <View style={styles.container}>
                <View style={styles.popupContainer}>
                    <View style={{alignItems: 'flex-start', width: '100%', marginBottom: 5}}>
                        <Text style={[styles.text, {fontSize: 30}]}>Pending</Text>
                    </View>
                    <View style={{width: '100%', height: 200, borderWidth: 2, borderRadius: 5, marginBottom: 8, paddingHorizontal: 8}}>
                        <View style={{width: '100%', justifyContent: 'center', marginLeft: 7}}>
                            <FlatList
                                data={pendingClaimList}
                                renderItem={claimItem}
                                keyExtractor={item => item.id}
                            />
                        </View>

                    </View>

                    <View style={{flexDirection: 'row', marginBottom: 8}}>
                        <CustomButton
                            buttonStyle={styles.button}
                            textStyle={{fontSize:12, fontFamily: 'balsamiq'}}
                            onPress={test}
                        >Test Button</CustomButton>
                    </View>
                    <CustomButton
                        buttonStyle={styles.button}
                        textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                        onPress={() => props.toggleVisibility(false)}
                    >Cancel</CustomButton>
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