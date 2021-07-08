import React, {useEffect, useState} from 'react'
import {FlatList, Modal, StyleSheet, Text, TextInput, View} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";
import DateTimePicker from '@react-native-community/datetimepicker';
import ErrorText from "./ErrorText";
import * as Quests from '../../api/quest'
import * as Presets from '../../api/presets'
import CustomTooltip from "./Tooltip";
import CoinIcon from './CoinIcon'

const CreateQuestModal = (props) => {
    const [title, setTitle] = useState('')
    const handleTitleUpdate = (text) => setTitle(text)

    const [points, setPoints] = useState('')
    const handlePointsUpdate = (text) => setPoints(text)

    const [year, setYear] = useState('')
    const [month, setMonth] = useState('')
    const [week, setWeek] = useState('')
    const [day, setDay] = useState('')
    const [hour, setHour] = useState('')
    const [minute, setMinute] = useState('')
    const [second, setSecond] = useState('')
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

    const handleClearAll = () => {
        setTitle('')
        setPoints('')
        setYear('')
        setMonth('')
        setWeek('')
        setDay('')
        setHour('')
        setMinute('')
        setSecond('')
        setDueDateMode(true)
        setSelectedDate(new Date())
        setSelectedTime(new Date())
        setErrorCode('')
    }
    const handleCreateQuest = () => {
        setErrorCode('')
        if (!validateQuestCreate()) { return }

        let selectedChildren = []
        for(let i = 0; i < selected.length; i++) {
            if (selected[i]) {
                selectedChildren.push(items[i].name)
            }
        }
        if (selectedChildren.length === 0) {
            setErrorCode('noChildSelected')
            return
        }

        let date = dueDateMode ? convertDuration() : combineDateAndTime(selectedDate, selectedTime)

        if (date - new Date() <= 0) {
            setErrorCode('pastDate')
            return
        } else if (date - new Date() > 315360000000) {
            setErrorCode('dateTooFar')
            return
        }

        for(let i = 0; i < selectedChildren.length; i++) {
            Quests.createQuest(props.userId, selectedChildren[i], title, date.toJSON(), +points)
        }
        props.toggleVisibility(false)

    }
    const handleAddPreset = () => {
        setErrorCode('')
        if (!validateQuestCreate()) { return }

        Presets.createPreset(props.userId, title, points, year, month, week, day, hour, minute, second)
    }
    const handleSelectPreset = (item) => {
        setTitle(item.title)
        setPoints(item.points)
        setYear(item.year)
        setMonth(item.month)
        setWeek(item.week)
        setDay(item.day)
        setHour(item.hour)
        setMinute(item.minute)
        setSecond(item.second)
    }

    const [presetList, setPresetList] = useState([])
    useEffect(() => {
        return Presets.presetListSubscribe(props.userId, setPresetList)
    }, [])

    const validateQuestCreate = () => {
        if (!title) {
            setErrorCode('emptyTitle')
            return false
        } else if (+points === 0) {
            setErrorCode('emptyPoints')
            return false
        } else if (dueDateMode && !(year || month || week || day || hour || minute || second)) {
            setErrorCode('emptyDuration')
            return false
        } else if (dueDateMode && (isNaN(+year) || isNaN(+month) || isNaN(+week) || isNaN(+day) || isNaN(+hour) || isNaN(+minute) || isNaN(+second))) {
            setErrorCode('durationNaN')
            return false
        } else if (isNaN(+points)) {
            setErrorCode('pointsNaN')
            return false
        } else if ((+year % 1 !== 0) || (+month % 1 !== 0) || (+week % 1 !== 0) || (+day % 1 !== 0)) {
            setErrorCode('decimalYMWD')
            return false
        } else if (+points > 10000000) {
            setErrorCode('pointsLarge')
            return false
        } else if (+points < 0) {
            setErrorCode('pointsNegative')
            return false
        }
        return true
    }
    const [errorCode, setErrorCode] = useState('')
    const errors = [
        {code: 'emptyTitle', text: 'Please fill in a title', key:'1'},
        {code: 'emptyPoints', text: 'Points is empty or 0', key:'2'},
        {code: 'emptyDuration', text: 'Please fill in at least 1 field in duration', key:'3'},
        {code: 'durationNaN', text: 'Please only fill numbers into duration', key:'4'},
        {code: 'pointsNaN', text: 'Please only fill numbers into points', key:'5'},
        {code: 'noChildSelected', text: 'Please select at least 1 child', key:'6'},
        {code: 'decimalYMWD', text: 'Year, Month, Week and Day cannot be a decimal', key:'7'},
        {code: 'pastDate', text: 'The date selected has passed', key:'8'},
        {code: 'pointsLarge', text: 'The point reward cannot exceed 10,000,000', key:'8'},
        {code: 'pointsNegative', text: 'The point reward cannot be negative', key:'9'},
        {code: 'dateTooFar', text: 'The duration cannot exceed 10 years', key:'10'},
    ]

    const combineDateAndTime = (date, time) => {
        let minutes = time.getMinutes().toString()
        let hours = time.getHours().toString()
        if (minutes.length === 1) { minutes = '0' + minutes }
        if (hours.length === 1) { hours = '0' + hours }
        const timeString = hours + ':' + minutes + ':00';

        const year = date.getFullYear();
        let month = date.getMonth() + 1; // Jan is 0, dec is 11
        if (month.toString().length === 1) {month = '0'+ month}
        let day = date.getDate();
        if (day.toString().length === 1) {day = '0'+ day}
        const dateString = '' + year + '-' + month + '-' + day;
        let hr = -(new Date().getTimezoneOffset() / 60)
        let timezone
        if (hr < 0) {
            if (Math.abs(hr) < 10) {
                timezone = `-0${Math.abs(hr)}:00`
            } else {
                timezone = `-${Math.abs(hr)}:00`
            }
        } else {
            if (Math.abs(hr) < 10) {
                timezone = `+0${Math.abs(hr)}:00`
            } else {
                timezone = `+${Math.abs(hr)}:00`
            }
        }

        console.log(dateString + 'T' + timeString + timezone)

        return new Date(dateString + 'T' + timeString + timezone);
    }
    const convertDuration = () => {
        let time = new Date()
        time.setMonth(time.getMonth() + (+month) + (+year) * 12)
        time.setDate(time.getDate() + (+day) + (+week) * 7)
        time.setSeconds(time.getSeconds() + (+second) + (+minute) * 60 + (+hour) * 3600)
        return time
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
    const presetItem = ({ item }) => {
        return (
            <CustomButton
                buttonStyle={[
                    styles.button,
                    {marginBottom: 8, marginRight: 5},
                ]}
                textStyle={{fontFamily: 'balsamiq', fontSize:10}}
                onPress={() => {handleSelectPreset(item)}}
                onLongPress={() => {
                    Presets.deletePreset(props.userId, item.id)
                }}
            >{item.title}</CustomButton>
            )
    }


    return (
        <Modal
            transparent={true}
            visible={props.visibility}
            onShow={() => {
                setItems([...props.childList])
                toggleSelected(items.map(() => false))
                handleClearAll()
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
                            textStyle={{fontSize: 15, fontFamily: 'balsamiq'}}
                            onPress={() => toggleSelected(items.map(() => true))}
                        >All</CustomButton>
                    </View>
                    <View style={styles.presetContainer}>
                        <FlatList
                            style={{marginRight: 8}}
                            horizontal={false}
                            columnWrapperStyle={{flexWrap: "wrap"}}
                            numColumns={5}
                            renderItem={presetItem}
                            data={presetList}
                            keyExtractor={item => item.id}
                        />
                        <CustomButton
                            buttonStyle={[styles.button, {width: 35, height: 35, alignItems: 'center', justifyContent: 'center', marginRight: 5}]}
                            textStyle={{paddingBottom: 7, fontSize:25, fontFamily: 'balsamiq'}}
                            onPress={handleAddPreset}
                        >+</CustomButton>
                        <CustomTooltip
                            modal={true}
                            height={62}
                            width={300}
                            circleSize={35}
                        >
                            Add a preset: Fill in the fields and click '+'{'\n'}
                            Delete a preset: Hold down on the preset{'\n'}
                            Presets will only save duration, not due date
                        </CustomTooltip>
                    </View>
                    <TextInput
                        style={[styles.textInput, {height: 35,width: '100%', marginTop: 8}]}
                        placeholder={"Quest title"}
                        onChangeText={handleTitleUpdate}
                        value={title}
                    />
                    <View style={styles.pointsContainer}>
                        <Text style={[styles.text, {marginRight: 10}]}>
                            Reward Points
                        </Text>
                        <TextInput
                            style={[styles.textInput, {width: '35%', paddingRight: 5, marginRight: 8}]}
                            keyboardType='numeric'
                            textAlign='right'
                            onChangeText={handlePointsUpdate}
                            value={points}
                        />
                        <CoinIcon dimension={30}/>
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
                                keyboardType='numeric'
                                placeholder={"Yr"}
                                onChangeText={handleYearUpdate}
                                value={year}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                keyboardType='numeric'
                                placeholder={"Mth"}
                                onChangeText={handleMonthUpdate}
                                value={month}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                keyboardType='numeric'
                                placeholder={"Wk"}
                                onChangeText={handleWeekUpdate}
                                value={week}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                keyboardType='numeric'
                                placeholder={"Day"}
                                onChangeText={handleDayUpdate}
                                value={day}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                keyboardType='numeric'
                                placeholder={"Hr"}
                                onChangeText={handleHourUpdate}
                                value={hour}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                keyboardType='numeric'
                                placeholder={"M"}
                                onChangeText={handleMinuteUpdate}
                                value={minute}
                            />
                            <TextInput
                                style={styles.durationTextInput}
                                keyboardType='numeric'
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
                                buttonStyle={[styles.button, {width: '40%', marginLeft: 10}]}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => setShowDatePicker(true)}
                            >Choose Date</CustomButton>
                            <Text style={[styles.text, { marginLeft: 10 , width: '50%', textAlign: 'center'}]}>
                                {selectedDate.toDateString()}
                            </Text>
                        </View>
                        <View style={styles.dateTimePickerContainer}>
                            <CustomButton
                                buttonStyle={[styles.button, {width: '40%', marginLeft: 10}]}
                                textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                                onPress={() => setShowTimePicker(true)}
                            >Choose Time</CustomButton>
                            <Text style={[styles.text, { marginLeft: 10 , width: '50%', textAlign: 'center'}]}>
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
                    <ErrorText
                        errorCode={errorCode}
                        setErrorCode={setErrorCode}
                        errors={errors}
                    />

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            buttonStyle={styles.button}
                            textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                            onPress={handleCreateQuest}
                        >+ Create</CustomButton>
                        <CustomButton
                            buttonStyle={[styles.button, {marginLeft: 30}]}
                            textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                            onPress={() => props.toggleVisibility(false)}
                        >⨯ Cancel</CustomButton>
                        <CustomButton
                            buttonStyle={[styles.button, {marginLeft: 30}]}
                            textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                            onPress={handleClearAll}
                        >- Clear All</CustomButton>
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
      padding: 8,
      borderWidth: 1,
      borderRadius: 5,
      marginTop: 10,
      width: '100%',
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
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
        borderRadius: 5,
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
        borderRadius: 5,
        fontSize: 20,
        height: 30,
        paddingLeft: 5,
        fontFamily: 'balsamiq'
    },
    durationTextInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 3,
        backgroundColor: '#fff',
        fontSize: 15,
        height: 30,
        paddingLeft: 5,
        fontFamily: 'balsamiq',
        width: '13%',
        textAlign: 'right',
        paddingRight: 5,
        marginLeft: 5
    },
    text: {
        fontSize: 20,
        fontFamily: 'balsamiq'
    },

})

export default CreateQuestModal