import React, {useState} from 'react'
import {StyleSheet, Modal, View, FlatList} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";


const CreateQuestModal = (props) => {
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
        width: 300,
        height: 500,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    childPickerContainer: {
        flexDirection: 'row',


    },
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    }
})

export default CreateQuestModal