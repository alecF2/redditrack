import { gql } from 'apollo-server-micro'

const typeDefs = gql`
  type UpdateInfo {
    query: String!
    postsAdded: Int!
  }

  type Post {
    title: String!
    author: String!
    content: String!
    thumbnail: String!
    karma: Int!
    numComments: Int!
    url: String!
    permalink: String!
    date: Int!
    id: String!
  }

  type Collection {
    query: String!
    posts: [Post]!
  }

  type Query {
    posts(email: String!): [Collection]!
    lastUpdate(email: String!): Int!
    search(query: String!): [Post]!
  }

  type Mutation {
    addUser(name: String!, email: String!, uid: String!): String!
    addQuery(sub: String!, search: String!, email: String!): String!
    updatePosts(email: String!): [UpdateInfo]!
    update(query: String!): [Post]!
  }
`

export default typeDefs
