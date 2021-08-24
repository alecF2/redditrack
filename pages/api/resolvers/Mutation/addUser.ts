import { addUserArgs } from '@api/interfaces/mutationArgs'

import { firestore } from '@config'
import { doc, getDoc, setDoc } from 'firebase/firestore/lite'

const addUser = async (_: any, { name, email, uid }: addUserArgs) => {
  const userDoc = doc(firestore, "users", email)
  const docSnap = await getDoc(userDoc)
  if (docSnap.exists()) {
    return "user already in database"
  }
  const lastUpdate = Math.floor(Date.now() / 1000)
  await setDoc(userDoc, { name, email, uid, lastUpdate })
  return "successfully added"
}

export default addUser
