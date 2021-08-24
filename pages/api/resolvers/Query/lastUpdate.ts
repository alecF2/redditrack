import { lastUpdateArgs } from "@api/interfaces/queryArgs"

import { firestore } from '@config'
import { doc, getDoc } from 'firebase/firestore/lite'

const lastUpdate = async (_: any, { email }: lastUpdateArgs) => {
  const userDoc = doc(firestore, "users", email)
  const userData = await getDoc(userDoc)
  let time: number = userData.data()!.lastUpdate

  return time
}

export default lastUpdate
