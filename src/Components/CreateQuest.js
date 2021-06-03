import React, {useState} from 'react'
import {StyleSheet, Modal, View, FlatList, TextInput, Text} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";
import DateTimePicker from '@react-native-community/datetimepicker';

/*TODO Error handling
    - anything is empty
    - child not selected
    - points is not a number
    - duration is not a number
    - duration and date both empty
    - duration and date both filled
*/
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

    const [showDatePicker, setShowDatePicker] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const setDate = (event, date) => {
        const currentDate = date || selectedDate
        setShowDatePicker(false)
        setSelectedDate(currentDate)
    }
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [selectedTime, setSelectedTime] = useState(new Date())
    const setTime = (event, date) => {
        const currentDate = date || selectedTime
        setShowTimePicker(false)
        setSelectedTime(currentDate)
    }

    const [dueDateMode, setDueDateMode] = useState(true)

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
                setTitle('')
                setPoints('')
                setYear(null)
                setMonth(null)
                setWeek(null)
                setDay(null)
                setHour(null)
                setMinute(null)
                setSecond(null)
                setDueDateMode(true)
                setSelectedDate(new Date())
                setSelectedTime(new Date())
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
                            onPress={() => toggleSelected(items.map(() => true))}
                        >All</CustomButton>
                    </View>
                    <View style={styles.presetContainer}>
                        <Text style={styles.text}>
                            Presets go here
                        </Text>
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
                    <View style={styles.dueDateContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.text}>
                                Duration
                            </Text>
                            <CustomButton
                                buttonStyle={[
                                    styles.button,
                                    dueDateMode ? {backgroundColor: colors.button2} : {backgroundColor: colors.button1},
                                    {marginLeft: 8}
                                ]}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => {setDueDateMode(true)}}
                            >Select</CustomButton>
                        </View>

                        <View style={styles.durationContainer}>
                            <TextInput
                                style={[styles.durationTextInput, {marginLeft: 0}]}
                                placeholder={"Yr"}
                                onChangeText={handleYearUpdate}
                                value={year}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                placeholder={"Mth"}
                                onChangeText={handleMonthUpdate}
                                value={month}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                placeholder={"Wk"}
                                onChangeText={handleWeekUpdate}
                                value={week}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                placeholder={"Day"}
                                onChangeText={handleDayUpdate}
                                value={day}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                placeholder={"Hr"}
                                onChangeText={handleHourUpdate}
                                value={hour}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                placeholder={"M"}
                                onChangeText={handleMinuteUpdate}
                                value={minute}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                placeholder={"S"}
                                onChangeText={handleSecondUpdate}
                                value={second}
                            />
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8, alignItems: 'center'}}>
                            <View style={{width: '43%', height: 1, backgroundColor: 'black', marginRight: 5}}/>
                            <Text style={styles.text}>
                                OR
                            </Text>
                            <View style={{width: '43%', height: 1, backgroundColor: 'black', marginLeft: 5}}/>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.text}>
                                Due Date
                            </Text>
                            <CustomButton
                                buttonStyle={[
                                    styles.button,
                                    !dueDateMode ? {backgroundColor: colors.button2} : {backgroundColor: colors.button1},
                                    {marginLeft: 8}
                                ]}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => {setDueDateMode(false)}}
                            >Select</CustomButton>
                        </View>

                        <View style={styles.dateTimePickerContainer}>
                            <CustomButton
                                buttonStyle={styles.button}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => setShowDatePicker(true)}
                            >Choose Date</CustomButton>
                            <Text style={[styles.text, { marginLeft: 10 }]}>
                                {selectedDate.toDateString()}
                            </Text>
                        </View>
                        <View style={styles.dateTimePickerContainer}>
                            <CustomButton
                                buttonStyle={styles.button}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => setShowTimePicker(true)}
                            >Choose Time</CustomButton>
                            <Text style={[styles.text, { marginLeft: 10 }]}>
                                {selectedTime.toTimeString().substr(0,5)}
                            </Text>
                        </View>

                        {showDatePicker && (<DateTimePicker
                            value={selectedDate}
                            mode={'date'}
                            onChange={setDate}
                        />)}
                        {showTimePicker && (<DateTimePicker
                            value={selectedTime}
                            mode={'time'}
                            onChange={setTime}
                        />)}

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
    presetContainer: {
      borderWidth: 1,
      marginTop: 10,
      width: '100%',
      height: 100,
      alignItems: 'center',
      justifyContent: 'center'
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
    dueDateContainer: {
        marginTop: 10,
        padding: 5,
        borderWidth: 1,
        alignItems: 'center'

    },
    dateTimePickerContainer: {
        marginTop: 8,
        flexDirection: 'row',
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
    durationTextInput: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#fff',
        fontSize: 15,
        height: 30,
        paddingLeft: 5,
        fontFamily: 'balsamiq',
        width: '13%',
        textAlign: 'right',
        paddingRight: 5,
        marginLeft: 5
    }
    ,
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq'
    }
})

export default CreateQuestModal