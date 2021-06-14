import firebase from "./firebase";

const db = firebase.database();

const newReward = (id, name, cost, availability) => ({id, name, cost, availability})

export const createReward = async (userId, rewardName, rewardCost, availability) => {
    try {
        const reward = db.ref(`users/${userId}/rewards`).push()
        await reward.set(newReward(reward.key, rewardName, rewardCost, availability))

    } catch (e) {
        console.error(e)
    }
}

export const deleteReward = async (userId, rewardId) => {
    try {
        await db.ref(`users/${userId}/rewards/${rewardId}`).remove()
    } catch (e) {
        console.error(e)
    }
}