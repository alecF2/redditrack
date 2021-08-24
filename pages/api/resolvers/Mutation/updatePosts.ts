import snoow from 'pages/api/snoow'
import { Listing, Submission } from 'snoowrap'
import { updatePostsArgs } from '@api/interfaces/mutationArgs'
import UpdateInfo from '@api/interfaces/updateInfo'

import { firestore } from '@config'
import { doc, getDocs, collection, updateDoc, DocumentReference, DocumentData } from 'firebase/firestore/lite'
import Post from '@api/interfaces/post'

const updatePosts = async (_: any, { email }: updatePostsArgs) => {
  const queryCol = collection(firestore, "users", email, "queries")
  const querySnap = await getDocs(queryCol)
  const info: UpdateInfo[] = []

  if (querySnap.empty) {
    throw new Error('no queries in database to fetch')
  }

  // TODO: check if newPosts array is empty, if it is then query the last 25 posts, check if the newest post is newer than the last queried post in the database, and if it is, then add all 25 posts to the database
  interface QueryInfo {
    oldPosts: Post[]
    lastPostUid: string
    queryStr: string
    docToUpdate: DocumentReference<DocumentData>
  }

  const docsToUpdate: QueryInfo[] = []

  querySnap.forEach((queryDoc) => {
    const oldPosts: Post[] = queryDoc.data().posts
    const lastPostUid = `t3_${oldPosts[0].id}`
    const queryStr = queryDoc.id
    const docToUpdate = doc(firestore, "users", email, "queries", queryStr)
    const info: QueryInfo = {
      oldPosts,
      lastPostUid,
      queryStr,
      docToUpdate
    }
    docsToUpdate.push(info)
  })

  await Promise.all(
    docsToUpdate.map(async (doc) => {
      let newPosts: Listing<Submission> | undefined
      const postsToAdd: Post[] = []

      try {
        let fetchedPosts: Listing<Submission>

        do {
          console.log("fetching for " + doc.queryStr)
          fetchedPosts = await snoow.search({
            query: doc.queryStr,
            sort: "new",
            before: doc.lastPostUid
          })
          console.log("length: " + fetchedPosts.length)
          if (typeof newPosts === "undefined") {
            newPosts = fetchedPosts
          } else {
            newPosts.unshift(...fetchedPosts)
          }
          if (fetchedPosts.length) {
            doc.lastPostUid = `t3_${fetchedPosts[0].id}`
          }
        } while (fetchedPosts.length === 25)
        
        if (newPosts.length === 0) {
          newPosts = await snoow.search({
            query: doc.queryStr,
            sort: "new"
          })
          
          if (newPosts.length && newPosts[0].id === doc.lastPostUid.replace("t3_", "")) {
            newPosts.length = 0
          }
        }
        console.log(`there are ${newPosts.length} new posts in ${doc.queryStr}`)

      } catch (err) {
        console.log(err)
        throw new Error(err)
      }

      for (let i = 0; i < newPosts.length; i++) {
        const post: Post = {
          title: newPosts[i].title,
          author: newPosts[i].author.name,
          content: newPosts[i].selftext,
          thumbnail: newPosts[i].thumbnail,
          karma: newPosts[i].score,
          numComments: newPosts[i].num_comments,
          url: newPosts[i].url,
          permalink: `https://reddit.com${newPosts[i].permalink}`,
          date: newPosts[i].created_utc,
          id: newPosts[i].id
        }
        postsToAdd.push(post)
      }
      info.push({
        query: doc.queryStr,
        postsAdded: postsToAdd.length
      })

      try {
        await updateDoc(doc.docToUpdate, {
          posts: postsToAdd.concat(doc.oldPosts)
        })
      } catch (err) {
        console.log(err)
        throw new Error(err)
      }
    })
  )

  const userDoc = doc(firestore, "users", email)
  await updateDoc(userDoc, {
    lastUpdate: Math.floor(Date.now() / 1000)
  })
  console.log(info)
  return info
}

export default updatePosts
