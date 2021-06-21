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

export const completeQuest = async (userId, childName, questId) => {
    try {
        const status = db.ref(`users/${userId}/children/${childName}/quests/${questId}/status`)
        await status.set('complete')
    } catch (e) {
        console.error(e)
    }
}

export const childExpireQuest = async (userId, childName, questId) => {
    try {
        const status = db.ref(`users/${userId}/children/${childName}/quests/${questId}/status`)
        const stat = await status.get()
        if (stat.val() === 'incomplete') {
            await status.set('expired-caregiver')
        } else if (stat.val() === 'expired-child') {
            await status.set('expired-none')
        }
    } catch (e) {
        console.error(e)
    }
}

export const caregiverExpireQuest = async (userId, childName, questId) => {
    try {
        const status = db.ref(`users/${userId}/children/${childName}/quests/${questId}/status`)
        const stat = await status.get()
        if (stat.val() === 'incomplete') {
            await status.set('expired-child')
        } else if (stat.val() === 'expired-caregiver') {
            await status.set('expired-none')
        }
    } catch (e) {
        console.error(e)
    }
}

export const releaseRewards = async (userId, childName, questId) => {
    try {
        const status = db.ref(`users/${userId}/children/${childName}/quests/${questId}/status`)
        await status.set('claimed')
        const questPoints = await db.ref(`users/${userId}/children/${childName}/quests/${questId}/points`).get()
        const childPoints = db.ref(`users/${userId}/children/${childName}/points`)
        const childPointCount = await childPoints.get()
        await childPoints.set((+childPointCount.val()) + (+questPoints.val()))
    } catch (e) {
        console.error(e)
    }
}