import snoow from 'pages/api/snoow'
import { Listing, Submission } from 'snoowrap'
import Post from '@api/interfaces/post'

const search = async (_: any, { query }: { query: string }) => {
  let posts: Listing<Submission>
  const newPosts: Post[] = []
  try {
    posts = await snoow.search({
      query,
      sort: "new",
      before: "t3_p61m3l"
    })
    posts.forEach(post => {
      const newPost: Post = {
        title: post.title,
        author: post.author.name,
        content: post.selftext,
        thumbnail: post.thumbnail,
        karma: post.score,
        numComments: post.num_comments,
        url: post.url,
        permalink: `https://reddit.com${post.permalink}`,
        date: post.created_utc,
        id: post.id
      }
      newPosts.push(newPost)
    })
  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
  return newPosts
}

export default search
