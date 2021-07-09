import React, {useEffect, useState} from 'react'
import {FlatList, Modal,  StyleSheet, Text, View} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";
import * as Quests from "../../api/quest";
import QuestListItem from "./QuestListItem";

const QuestHistoryModal = (props) => {
    const { parentUserId, childName, visibility, toggleVisibility } = props
    const [questList, setQuestList] = useState([])
    useEffect(() => {
        return Quests.questListSubscribe(parentUserId, childName, setQuestList)
    }, [])

    const renderItem = ({item}) => {
        return (
            <QuestListItem
                item={item}
                mode={'child-history'}
            />
        )
    }

    return (
        <Modal
            transparent={true}
            visible={visibility}
        >
            <View style={styles.container}>
                <View style={styles.popupContainer}>
                    <View style={{alignItems: 'flex-start', width: '100%', marginBottom: 5}}>
                        <Text style={[styles.text, {fontSize: 30}]}>History</Text>
                    </View>
                    <View style={{width: '100%', height: '85%', borderWidth: 2, borderRadius: 5, marginBottom: 4, paddingHorizontal: 8, paddingBottom: 8}}>
                        <View style={{width: '100%', justifyContent: 'center', marginTop: 5}}>
                            <FlatList
                                data={questList}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                        </View>
                    </View>
                    <CustomButton
                        buttonStyle={styles.button}
                        textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                        onPress={() => toggleVisibility(false)}
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

export default QuestHistoryModal