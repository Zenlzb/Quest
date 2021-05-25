import firebase from "./firebase";

const db = firebase.database();

const newChild = (key, name) => ({key, name});

export const createChild = async (userId, name) => {
    try {
        const child = db.ref(`users/${userId}`).push()
        await child.set(newChild(child.key, name))
    } catch (e) {
        console.error(e)
    }
}

export const deleteChild = async  (userId, child) => {
    try {
        await db.ref(`users/${userId}/${child.key}`).remove()
    } catch (e) {
        console.error(e)
    }
}

export const childSubscribe = (userId, onValueChanged) => {
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