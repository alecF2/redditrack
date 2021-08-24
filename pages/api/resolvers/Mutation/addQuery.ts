import snoow from 'pages/api/snoow/index'
import { Listing, Submission } from 'snoowrap'
import { addQueryArgs } from '@api/interfaces/mutationArgs'
import Post from '@api/interfaces/post'

import { firestore } from '@config'
import { doc, getDoc, setDoc } from 'firebase/firestore/lite'

const addQuery = async (_: any, { sub, search, email }: addQueryArgs) => {
  let newPosts: Listing<Submission>
  const subreddit = sub !== "" ? `subreddit:${sub}` : ""
  const queryStr = `${search} ${subreddit}`.trim()
  const queryDoc = doc(firestore, "users", email, "queries", queryStr)
  const docSnap = await getDoc(queryDoc)

  if (docSnap.exists()) {
    throw new Error('query already exists in database')
  }

  try {
    newPosts = await snoow.search({
      query: queryStr,
      sort: "new",
      limit: 3
    })
  } catch (err) {
    throw new Error(err)
  }

  if (!newPosts.length) {
    throw new Error('no post found within the past day')
  }

  const postsToAdd: Post[] = []
  newPosts.forEach(newPost => {
    const post: Post = {
      title: newPost.title,
      author: newPost.author.name,
      content: newPost.selftext,
      thumbnail: newPost.thumbnail,
      karma: newPost.score,
      numComments: newPost.num_comments,
      url: newPost.url,
      permalink: `https://reddit.com${newPost.permalink}`,
      date: newPost.created_utc,
      id: newPost.id
    }
    postsToAdd.push(post)
  })

  if (!postsToAdd.length) {
    return "successfully added query, but there were no posts to add"
  }

  await setDoc(queryDoc, {
    posts: postsToAdd
  })

  return `successfully added query and ${postsToAdd.length} of its latest posts`
}

export default addQuery
