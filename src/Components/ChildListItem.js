import React, {useEffect, useState} from 'react'
import {Pressable, Text, View, StyleSheet, FlatList} from "react-native";
import colors from "../../assets/themes/colors";
import CoinIcon from "./CoinIcon";
import * as Quests from "../../api/quest";

const ChildListItem = (props) => {
    const {item, userId, handleRemoveChild} = props
    const [expanded, setExpanded] = useState(false)
    const [questList, setQuestList] = useState([])

    useEffect(() => {
        return Quests.questListSubscribe(userId, item.name, setQuestList)
    }, [])

    const questListItem = ({ item }) => {
        if (item.status === 'expired-caregiver' || item.status === 'expired-none' || item.status === 'claimed' ) {
            return null
        } else if (item.status === 'complete') {
            return(
                <Pressable style={{width: '80%', height: 25, borderWidth: 1, borderRadius: 5, backgroundColor: colors.button2, marginBottom: 3, paddingHorizontal: 3}}>
                    <Text style={[styles.text, {fontSize: 15, textAlign: 'left', width: '60%'}]} numberOfLines={1}>{item.title}</Text>

                </Pressable>
            )
        } else if (item.status === 'incomplete') {

        } else if (item.status === 'expired-caregiver') {

        }
    }
    return (
        <Pressable
            style={[styles.container, expanded ? {} : {height: 70}]}
            onPress={() => {setExpanded(!expanded)}}
        >
            <View style={{width: '100%', height: 30, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.text, {width: '50%', textAlign: 'left'}]} numberOfLines={1}>{item.name}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.text, {width: 80, textAlign: 'right'}]} numberOfLines={1}>{item.points}</Text>
                    <CoinIcon style={{marginLeft: 2, marginTop: 5}} dimension={22}/>
                </View>
            </View>
            <Text style={[styles.text, {width: '50%', textAlign: 'left', color: 'white', fontSize: 15, marginTop: 8}]} numberOfLines={1}>{expanded ? 'v Quests':'> Quests'}</Text>
            {expanded && <FlatList
                style={{width: '100%', marginTop: 5}}
                data={questList}
                renderItem={questListItem}
                keyExtractor={item => item.id}
            />}

        </Pressable>
    )
}

const styles=StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 7,
        width: '100%',
        marginTop: 8,
        backgroundColor: colors.background3,
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingHorizontal: 8,
        paddingVertical: 3
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq',
        textAlign: 'center'
    },
})

export default ChildListItem