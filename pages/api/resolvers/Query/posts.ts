import { postsArgs } from "@api/interfaces/queryArgs"
import { cardCollection } from "pages/dashboard"
import Post from "@api/interfaces/post"

import { firestore } from '@config'
import { getDocs, collection } from 'firebase/firestore/lite'

const posts = async (_: any, { email }: postsArgs) => {
  const queryRef = collection(firestore, "users", email, "queries")
  const querySnap = await getDocs(queryRef)
  const tempQueries: cardCollection[] = []

  querySnap.forEach(query => {
    let posts: Post[] = query.data().posts
    if (posts.length > 100) {
      posts = posts.slice(0, 100)
    }
    tempQueries.push({
      query: query.id,
      posts
    })
  })

  return tempQueries
}

export default posts
