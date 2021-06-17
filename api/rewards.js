import firebase from "./firebase";

const db = firebase.database();

const newReward = (id, name, cost, availability) => ({id, name, cost, availability})
const newRewardClaim = (id, quantity, childName, rewardName, rewardCost, claimDate, status) => ({id, quantity, childName, rewardName, rewardCost, claimDate, status})

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

export const editReward = async (userId, rewardId, rewardName, rewardCost, availability) => {
    try {
        const name = db.ref(`users/${userId}/rewards/${rewardId}/name`)
        await name.set(rewardName)
        const cost = db.ref(`users/${userId}/rewards/${rewardId}/cost`)
        await cost.set(rewardCost)
        const available = db.ref(`users/${userId}/rewards/${rewardId}/availability`)
        await available.set(availability)
    } catch (e) {
        console.error(e)
    }
}

export const rewardListSubscribe = (userId, onValueChanged) => {
    try {
        const rewards = db.ref(`users/${userId}/rewards`)
        rewards.on("value", (snapshot) => {
            const val = snapshot.val()
            const retList = [];
            for(let id in val) {
                retList.push(val[id])
            }
            onValueChanged(retList)
        })
        return () => rewards.off("value")
    } catch (e) {
        console.error(e)
    }
}

export const createRewardClaim = async (userId, quantity, childName, rewardName, rewardCost, claimDate) => {
    try {
        const claim = db.ref(`users/${userId}/rewardHistory`).push()
        await claim.set(newRewardClaim(claim.key, quantity, childName, rewardName, rewardCost, claimDate, 'pending'))
    } catch (e) {
        console.error(e)
    }
}

export const completeRewardClaim = async (userId, claimId) => {
    try {
        const status = db.ref(`users/${userId}/rewardHistory/${claimId}/status`)
        await status.set('completed')
    } catch (e) {
        console.error(e)
    }
}

export const declineRewardClaim = async (userId, claimId) => {
    try {
        const status = db.ref(`users/${userId}/rewardHistory/${claimId}/status`)
        await status.set('declined')
    } catch (e) {
        console.error(e)
    }
}

export const pendingClaimListSubscribe = (userId, onValueChanged) => {
    try {
        const claims = db.ref(`users/${userId}/rewardHistory`)
        claims.on("value", (snapshot) => {
            const val = snapshot.val()
            const retList = [];
            for(let id in val) {
                if (val[id].status === 'pending') {
                    retList.push(val[id])
                }
            }
            onValueChanged(retList)
        })
        return () => claims.off("value")
    } catch (e) {
        console.error(e)
    }
}