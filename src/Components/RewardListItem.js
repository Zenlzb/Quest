import React from 'react';
import {Pressable, Text, View, StyleSheet} from "react-native";
import colors from "../../assets/themes/colors";
import CoinIcon from "./CoinIcon";

const RewardListItem = (props) => {
    const { item, onPress } = props
    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            <Text style={styles.text} numberOfLines={1}>{item.name}</Text>
            <View style={styles.textContainer}>
                {item.availability
                    ? <Text style={[styles.text, {color: colors.button2}]}>Available</Text>
                    : <Text style={[styles.text, {color: colors.button1}]}>Not Available</Text>}
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.text, {width: 80, textAlign: 'right'}]} numberOfLines={1}>{item.cost}</Text>
                    <CoinIcon style={{marginLeft: 2, marginTop: 5}} dimension={25}/>
                </View>
            </View>
        </Pressable>
    )
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
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 22,
        fontFamily: 'balsamiq',
        textAlign: 'center'
    },
})

export default RewardListItem