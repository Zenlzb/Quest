import React from 'react';
import {Pressable, Text, View, StyleSheet} from "react-native";
import colors from "../../assets/themes/colors";
import CoinIcon from "./CoinIcon";

const RewardListItem = (props) => {
    if (props.mode === 'caregiverReward') {
        const { item, onPress } = props
        const AvailableText = () => {
            if (item.availability) {
                return (
                    <View style = {{backgroundColor: colors.button2, borderRadius: 5, paddingHorizontal: 5, justifyContent: 'center', height: 25}}>
                        <Text style={[styles.text, {color: 'white', fontSize: 15}]}>Available</Text>
                    </View>
                )
            } else {
                return (
                    <View style = {{backgroundColor: colors.button1, borderRadius: 5, paddingHorizontal: 5, justifyContent: 'center', height: 25}}>
                        <Text style={[styles.text, {color: 'white', fontSize: 15}]}>Not Available</Text>
                    </View>
                )
            }
        }
        return (
            <Pressable
                style={styles.container}
                onPress={onPress}
            >
                <Text style={styles.text} numberOfLines={1}>{item.name}</Text>
                <View style={[styles.textContainer, {height: 30, alignItems: 'flex-end'}]}>
                    <AvailableText/>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.text, {width: 80, textAlign: 'right'}]} numberOfLines={1}>{item.cost}</Text>
                        <CoinIcon style={{marginLeft: 2, marginTop: 5}} dimension={25}/>
                    </View>
                </View>
            </Pressable>
        )
    } else if (props.mode === 'caregiverRewardHistory') {
        const { item, onPress } = props
        const StatusText = () => {
            if (item.status === 'pending') {
                return <Text style={[styles.text, {color: 'grey', fontSize: 18}]}>Pending</Text>
            } else if (item.status === 'completed') {
                return <Text style={[styles.text, {color: colors.button2, fontSize: 18}]}>Completed</Text>
            } else if (item.status === 'denied') {
                return <Text style={[styles.text, {color: colors.button1, fontSize: 18}]}>Denied</Text>
            }
        }
        return(
            <Pressable
                style={[styles.container, {height: 67, borderWidth: 1.5}]}
                onPress={onPress}
            >
                <View style={styles.textContainer}>
                    <View style={{flexDirection: 'row', width: '60%'}}>
                        <Text style={[styles.text, {fontSize: 18, width: '80%', textAlign: 'left'}]} numberOfLines={1}>{item.rewardName}</Text>
                        <Text style={[styles.text, {fontSize: 18, width: '20%', textAlign: 'left'}]} numberOfLines={1}> x{item.quantity}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.text, {width: 80, textAlign: 'right', fontSize: 18}]} numberOfLines={1}>{item.rewardCost * item.quantity}</Text>
                        <CoinIcon style={{marginLeft: 2, marginTop: 3}} dimension={20}/>
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.text, {fontSize: 18}]}>{item.childName}</Text>
                    <StatusText/>
                </View>
            </Pressable>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 7,
        width: '95%',
        height: 80,
        marginTop: 8,
        backgroundColor: colors.background2,
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 8,
        paddingVertical: 3
    },
    textContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 22,
        fontFamily: 'balsamiq',
        textAlign: 'center'
    },
})

export default RewardListItem