import firebase from "./firebase";

const db = firebase.database();

const newChild = (key, name, points, quests) => ({key, name, points, quests});

export const createChild = async (userId, name) => {
    try {
        const child = db.ref(`users/${userId}/${name}`)
        await child.set(newChild(child.key, name, 0, null))
    } catch (e) {
        console.error(e)
    }
}

export const deleteChild = async  (userId, child) => {
    try {
        await db.ref(`users/${userId}/${child.name}`).remove()
    } catch (e) {
        console.error(e)
    }
}

export const checkChildExists = async (userId, childName) => {
    try {
        return (await db.ref(`users/${userId}/${childName}`).get()).exists()
    } catch (e) {
        console.error(e)
    }
}

export const childListSubscribe = (userId, onValueChanged) => {
    const children = db.ref(`users/${userId}`)
    children.on("value", (snapshot) => {
        const val = snapshot.val()
        const retList = [];
        for(let id in val) {
            retList.push(val[id])
        }
        onValueChanged(retList)
    })
    return () => children.off("value")
}