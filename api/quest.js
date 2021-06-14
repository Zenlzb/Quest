import firebase from "./firebase";

const db = firebase.database();

const newQuest = (id, title, dueDate, points, status) => ({id, title, dueDate, points, status})

export const createQuest = async (userId, childName, questTitle, questDueDate, questPoints) => {
    try {
        const quest = db.ref(`users/${userId}/children/${childName}/quests`).push()
        await quest.set(newQuest(quest.key, questTitle, questDueDate, questPoints, 'incomplete'))

    } catch (e) {
        console.error(e)
    }
}

export const deleteQuest = async (userId, childName, questId) => {
    try {
        await db.ref(`users/${userId}/children/${childName}/quests/${questId}`).remove()
    } catch (e) {
        console.error(e)
    }
}

export const questListSubscribe = (userId, childName, onValueChanged) => {
    try {
        const quests = db.ref(`users/${userId}/children/${childName}/quests`)
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