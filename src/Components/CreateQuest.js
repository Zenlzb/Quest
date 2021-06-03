import React, {useState} from 'react'
import {StyleSheet, Modal, View, FlatList, TextInput, Text} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";


const CreateQuestModal = (props) => {
    const [title, setTitle] = useState('')
    const handleTitleUpdate = (text) => setTitle(text)

    const [points, setPoints] = useState('')
    const handlePointsUpdate = (text) => setPoints(text)

    const [year, setYear] = useState(null)
    const [month, setMonth] = useState(null)
    const [week, setWeek] = useState(null)
    const [day, setDay] = useState(null)
    const [hour, setHour] = useState(null)
    const [minute, setMinute] = useState(null)
    const [second, setSecond] = useState(null)
    const handleYearUpdate = (text) => setYear(text)
    const handleMonthUpdate = (text) => setMonth(text)
    const handleWeekUpdate = (text) => setWeek(text)
    const handleDayUpdate = (text) => setDay(text)
    const handleHourUpdate = (text) => setHour(text)
    const handleMinuteUpdate = (text) => setMinute(text)
    const handleSecondUpdate = (text) => setSecond(text)


    const [items, setItems] = useState([{name: 'a', key: 'a'}])
    const [selected, toggleSelected] = useState([false])
    const getItemIndex = (item) => {
        for(let i = 0; i < items.length; i++) {
            if (item.name === items[i].name) {
                return i
            }
        }
        return null
    }

    const childItem = ({ item, index }) => {
        return (
                <CustomButton
                    buttonStyle={[
                        styles.button,
                        index === 0 ? {marginLeft: 0} : {marginLeft: 8},
                        selected[getItemIndex(item)] ? {backgroundColor: colors.button2} : {backgroundColor: colors.button1}
                    ]}
                    textStyle={{fontFamily: 'balsamiq', fontSize:15}}
                    onPress={ () => {
                        const temp = [...selected]
                        temp[getItemIndex(item)] = !temp[getItemIndex(item)]
                        toggleSelected(temp)
                    } }
                >{item.name}</CustomButton>
        )
    }

    return (
        <Modal
            transparent={true}
            visible={props.visibility}
            onShow={() => {
                setItems([...props.childList])
                toggleSelected(items.map(() => false))
            }}
        >
            <View style={styles.container}>
                <View style={styles.popupContainer}>

                    <View style={styles.childPickerContainer}>
                        <FlatList
                            horizontal={true}
                            renderItem={childItem}
                            data={items}
                            keyExtractor={item => item.key}
                        />
                        <CustomButton
                            buttonStyle={[styles.button, {marginLeft: 8}]}
                            textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                            onPress={() => toggleSelected(selected.map(() => true))}
                        >All</CustomButton>
                    </View>
                    <TextInput
                        style={[styles.textInput, {width: '100%', marginTop: 8}]}
                        placeholder={"Quest title"}
                        onChangeText={handleTitleUpdate}
                        value={title}
                    />
                    <View style={styles.pointsContainer}>
                        <Text style={[styles.text, {marginRight: 10}]}>
                            Reward Points
                        </Text>
                        <TextInput
                            style={[styles.textInput, {width: '50%'}]}
                            placeholder={"coin icon goes ->"}
                            onChangeText={handlePointsUpdate}
                            value={points}
                        />
                    </View>
                    <View style={styles.durationContainer}>
                        <TextInput
                            style={[styles.textInput, {width: '13%', textAlign: 'right', paddingRight: 5}]}
                            placeholder={"Yr"}
                            onChangeText={handleYearUpdate}
                            value={year}
                        />
                        <TextInput
                            style={[styles.textInput, {width: '13%', textAlign: 'right', paddingRight: 5, marginLeft: 5}]}
                            placeholder={"Mth"}
                            onChangeText={handleMonthUpdate}
                            value={month}
                        />
                        <TextInput
                            style={[styles.textInput, {width: '13%', textAlign: 'right', paddingRight: 5, marginLeft: 5}]}
                            placeholder={"Wk"}
                            onChangeText={handleWeekUpdate}
                            value={week}
                        />
                        <TextInput
                            style={[styles.textInput, {width: '13.5%', textAlign: 'right', paddingRight: 5, marginLeft: 5}]}
                            placeholder={"Day"}
                            onChangeText={handleDayUpdate}
                            value={day}
                        />
                        <TextInput
                            style={[styles.textInput, {width: '13%', textAlign: 'right', paddingRight: 5, marginLeft: 5}]}
                            placeholder={"Hr"}
                            onChangeText={handleHourUpdate}
                            value={hour}
                        />
                        <TextInput
                            style={[styles.textInput, {width: '13%', textAlign: 'right', paddingRight: 5, marginLeft: 5}]}
                            placeholder={"M"}
                            onChangeText={handleMinuteUpdate}
                            value={minute}
                        />
                        <TextInput
                            style={[styles.textInput, {width: '13%', textAlign: 'right', paddingRight: 5, marginLeft: 5}]}
                            placeholder={"S"}
                            onChangeText={handleSecondUpdate}
                            value={second}
                        />


                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            buttonStyle={styles.button}
                            textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                            onPress={() => {}}
                        >Create</CustomButton>
                        <CustomButton
                            buttonStyle={[styles.button, {marginLeft: 30}]}
                            textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                            onPress={() => props.toggleVisibility(false)}
                        >Cancel</CustomButton>
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
        width: 350,
        height: 500,
        alignItems: 'center',
    },
    childPickerContainer: {
        flexDirection: 'row',
    },
    buttonContainer: {
        marginTop: 8,
        flexDirection: 'row'
    },
    pointsContainer: {
        marginTop: 8,
        flexDirection: 'row'
    },
    durationContainer: {
        marginTop: 8,
        flexDirection: 'row'
    },
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#fff',
        fontSize: 20,
        height: 30,
        paddingLeft: 5,
        fontFamily: 'balsamiq'
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq'
    }
})

export default CreateQuestModal