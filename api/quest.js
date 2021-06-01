import firebase from "./firebase";

const db = firebase.database();

const newQuest = (id, title, duration, points) => ({id, title, duration, points})

export const createQuest = async (userId, childName, questTitle, questDuration, questPoints) => {
    try {
        const quest = db.ref(`users/${userId}/${childName}/quests`).push()
        await quest.set(newQuest(quest.key, questTitle, questDuration, questPoints))

    } catch (e) {
        console.error(e)
    }
}

export const deleteQuest = async (userId, childName, questId) => {
    try {
        await db.ref(`users/${userId}/${childName}/quests/${questId}`).remove()
    } catch (e) {
        console.error(e)
    }
}

export const questListSubscribe = (userId, childName, onValueChanged) => {
    try {
        const quests = db.ref(`users/${userId}/${childName}/quests`)
        quests.on("value", (snapshot) => {
            const val = snapshot.val()
            const retList = [];
            for(let id in val) {
                retList.push(val[id])
            }
            onValueChanged(retList)
        })
        return () => quests.off("value")

    } catch (e) {
        console.error(e)
    }
}