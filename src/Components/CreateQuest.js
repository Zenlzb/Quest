import React, {useState} from 'react'
import {Text, StyleSheet, Modal, View} from 'react-native';
import colors from "../../assets/themes/colors";
import CustomButton from "./Button";
import DropDownPicker from 'react-native-dropdown-picker'

const CreateQuestModal = (props) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([{name:'a'}])
    return (
        <Modal
            transparent={true}
            visible={props.visibility}
            onShow={() => setItems([{name: 'All'},...props.childList])}
        >
            <View style={styles.container}>
                <View style={styles.popupContainer}>
                    <DropDownPicker
                        schema={{
                            label: 'name',
                            value: 'name'
                        }}
                        placeholder='Select Child'
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                    />
                    <CustomButton
                        buttonStyle={styles.button}
                        textStyle={{fontSize:15, fontFamily: 'balsamiq'}}
                        onPress={() => props.toggleVisibility(false)}
                    >OK</CustomButton>
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
    button: {
        backgroundColor: colors.button1,
        justifyContent: 'center',
    }
})

export default CreateQuestModal