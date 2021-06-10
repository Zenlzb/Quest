import firebase from "./firebase";

const db = firebase.database();

const newPreset = (id, title, points, year, month, week, day, hour, minute, second) => ({id, title, points, year, month, week, day, hour, minute, second})

export const createPreset = async (userId, title, points, year, month, week, day, hour, minute, second) => {
    try {
        const preset = db.ref(`users/${userId}/presets`).push()
        await preset.set(newPreset(preset.key, title, points, year, month, week, day, hour, minute, second))

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