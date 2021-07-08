import firebase from "./firebase";

const db = firebase.database();

const newQuest = (id, title, dueDate, points, status, priority) => ({id, title, dueDate, points, status, priority})

export const createQuest = async (userId, childName, questTitle, questDueDate, questPoints) => {
    try {
        const quest = db.ref(`users/${userId}/children/${childName}/quests`).push()
        const priority = (await getHighestIncompletePriority(userId, childName)) + 1
        await quest.set(newQuest(quest.key, questTitle, questDueDate, questPoints, 'incomplete', priority))

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
            onValueChanged(retList.sort((a, b) => b.priority - a.priority))
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
        const priority = db.ref(`users/${userId}/children/${childName}/quests/${questId}/priority`)
        await priority.set(-1)
    } catch (e) {
        console.error(e)
    }
}

export const childExpireQuest = async (userId, childName, questId) => {
    try {
        const status = db.ref(`users/${userId}/children/${childName}/quests/${questId}/status`)
        const priority = db.ref(`users/${userId}/children/${childName}/quests/${questId}/priority`)
        const stat = await status.get()
        if (stat.val() === 'incomplete') {
            await status.set('expired-caregiver')
        } else if (stat.val() === 'expired-child') {
            await status.set('expired-none')
        }
        await priority.set(0)
    } catch (e) {
        console.error(e)
    }
}

export const caregiverExpireQuest = async (userId, childName, questId) => {
    try {
        const status = db.ref(`users/${userId}/children/${childName}/quests/${questId}/status`)
        const priority = db.ref(`users/${userId}/children/${childName}/quests/${questId}/priority`)
        const stat = await status.get()
        if (stat.val() === 'incomplete') {
            await status.set('expired-child')
        } else if (stat.val() === 'expired-caregiver') {
            await status.set('expired-none')
        }
        await priority.set(0)
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

export const releaseAllRewards = async (userId, childName) => {
    try {
        const childQuests = db.ref(`users/${userId}/children/${childName}/quests`)
        const quest = (await childQuests.get()).val()
        if (quest.length === 0) { return }
        for (let id in quest) {
            if (quest[id].status === "complete") {
                await releaseRewards(userId, childName, quest[id].id)
            }
        }

    } catch (e) {
        console.error(e)
    }
}

export const getHighestIncompletePriority = async (userId, childName) => {
    try {
        const childQuests = db.ref(`users/${userId}/children/${childName}/quests`)
        const quest = (await childQuests.get()).val()
        if (quest.length === 0) { return }
        let max = 0
        for (let id in quest) {
            if (quest[id].priority > max && quest[id].status === "incomplete") {
                max = quest[id].priority
            }
        }
        return max
    } catch (e) {
        console.error(e)
    }
}

export const swapQuests = async (userId, childName, questIdA, questIdB) => {
    try {
        const questA = db.ref(`users/${userId}/children/${childName}/quests/${questIdA}/priority`)
        const questB = db.ref(`users/${userId}/children/${childName}/quests/${questIdB}/priority`)
        const priorityA = await questA.get()
        const priorityB = await questB.get()
        await questA.set(priorityB.val())
        await questB.set(priorityA.val())

    } catch (e) {
        console.error(e)
    }
}