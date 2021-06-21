import React, {useEffect, useState} from 'react'
import {Pressable, Text, View, StyleSheet, FlatList} from "react-native";
import colors from "../../assets/themes/colors";
import CoinIcon from "./CoinIcon";
import * as Quests from "../../api/quest";
import QuestListItem from "./QuestListItem";
import {Icon} from "react-native-elements";

const ChildListItem = (props) => {
    const {item, userId, handleRemoveChild} = props
    const { name, points } = item
    const [expanded, setExpanded] = useState(false)
    const [questList, setQuestList] = useState([])

    useEffect(() => {
        return Quests.questListSubscribe(userId, name, setQuestList)
    }, [])

    const questListItem = ({ item }) => {
        return (
            <QuestListItem
                item={item}
                mode={'caregiver'}
                userId={userId}
                childName={name}
            />
        )
    }
    return (
        <Pressable
            style={[styles.container, expanded ? {} : {height: 70}]}
            onPress={() => {setExpanded(!expanded)}}
        >
            <View style={{width: '100%', height: 30, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.text, {width: '50%', textAlign: 'left'}]} numberOfLines={1}>{name}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.text, {width: 80, textAlign: 'right'}]} numberOfLines={1}>{points}</Text>
                    <CoinIcon style={{marginLeft: 2, marginTop: 5}} dimension={22}/>
                </View>
            </View>
            <Text style={[styles.text, {width: '50%', textAlign: 'left', color: 'white', fontSize: 15, marginTop: 8}]} numberOfLines={1}>{expanded ? 'v Quests':'> Quests'}</Text>
            {expanded &&
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                <View style={{width: '80%'}}>
                    <FlatList
                        style={{width: '100%', marginTop: 5}}
                        data={questList}
                        renderItem={questListItem}
                        keyExtractor={item => item.id}
                    />
                </View>
                <Pressable
                    onPress={handleRemoveChild}
                >
                    <Icon
                        name='trash-2'
                        type='feather'
                        color='white'
                        size={35}
                        style={{marginBottom: 5}}
                    />
                </Pressable>


            </View>
            }

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