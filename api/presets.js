import firebase from "./firebase";

const db = firebase.database();

const newPreset = (id, presetName, title, points, durationMode, year, month, week, day, hour, minute, second) => ({id, presetName,  title, points, durationMode, year, month, week, day, hour, minute, second})

export const createPreset = async (userId, presetName,  title, points, durationMode, year, month, week, day, hour, minute, second) => {
    try {
        const preset = db.ref(`users/${userId}/presets`).push()
        await preset.set(newPreset(preset.key, presetName, title, points, durationMode, year, month, week, day, hour, minute, second))
    } catch (e) {
        console.error(e)
    }
}

export const deletePreset = async (userId, presetId) => {
    try {
        await db.ref(`users/${userId}/presets/${presetId}`).remove()
    } catch (e) {
        console.error(e)
    }
}

export const presetListSubscribe = (userId, onValueChanged) => {
    const presets = db.ref(`users/${userId}/presets`)
    presets .on("value", (snapshot) => {
        const val = snapshot.val()
        const retList = [];
        for(let id in val) {
            retList.push(val[id])
        }
        onValueChanged(retList)
    })
    return () => presets .off("value")
}

export const checkNameExists = async (userId, presetName) => {
    const presets = db.ref(`users/${userId}/presets`)
    const presetList = (await presets.get()).val()
    for (let id in presetList) {
        if (presetList[id].presetName === presetName) {
            return true
        }
    }
    return false
}