// query
import posts from './Query/posts'
import lastUpdate from './Query/lastUpdate'
import search from './Query/search'

// mutation
import addUser from './Mutation/addUser'
import updatePosts from './Mutation/updatePosts'
import addQuery from './Mutation/addQuery'

const Query = {
  posts,
  lastUpdate,
  search
}

const Mutation = {
  addUser,
  addQuery,
  updatePosts
}

const resolvers = {
  Query,
  Mutation
}

export default resolvers
