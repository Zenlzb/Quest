import React, {useEffect, useState} from 'react'
import {FlatList, StyleSheet, Text, View} from "react-native";
import colors from "../../assets/themes/colors";
import CustomButton from "../Components/Button";
import * as Rewards from "../../api/rewards";
import RewardListItem from "../Components/RewardListItem";
import CreateClaim from "../Components/CreateClaim";

const ChildReward = ({ route, navigation }) => {
    const { parentUserId, childName, childPoints } = route.params
    const [rewardList, setRewardList] = useState([])
    const [createClaim, setCreateClaim] = useState(false)
    useEffect(() => {
        return Rewards.rewardListSubscribe(parentUserId, setRewardList, true)
    }, [])

    const [popupName, setPopupName] = useState('')
    const [popupCost, setPopupCost] = useState('')

    const rewardItem = ({ item }) => {
        return (
            <RewardListItem
                item={item}
                onPress={() => {
                    setPopupName(item.name)
                    setPopupCost(item.cost)
                    setCreateClaim(true)
                }}
                mode='childReward'
            />
        )
    }
    return (
        <View style={styles.container}>
            <CreateClaim
                visibility={createClaim}
                toggleVisibility={setCreateClaim}
                parentUserId={parentUserId}
                childName={childName}
                childBalance={childPoints}
                rewardName={popupName}
                rewardCost={popupCost}
            />
            <View style={styles.titleContainer}>
                <Text style={[styles.text, {fontSize: 40}]}>Rewards</Text>
                <View style={{flexDirection:'row', height: 25, marginTop: 21}}>
                    <CustomButton
                        buttonStyle={styles.button}
                        textStyle={[styles.text, {paddingVertical: 1, fontSize: 17}]}
                        onPress={() => {}}
                    >Pending</CustomButton>
                    <CustomButton
                        buttonStyle={[styles.button, {marginLeft: 8,}]}
                        textStyle={[styles.text, {paddingVertical: 1, fontSize: 17}]}
                        onPress={() => {navigation.navigate('Child Main')}}
                    >Main ></CustomButton>
                </View>
            </View>
            <View style={{width: '95%', height: '83%', borderWidth: 2, borderRadius: 10, alignItems: 'center'}}>
                <FlatList
                    style={{width: '95%'}}
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
})
export default ChildReward