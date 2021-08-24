import { makeSchema, queryType, objectType, stringArg } from 'nexus'
import snoow, { Listing, Submission } from '../snoow/index'
import post from '../interfaces/post'
import * as QArgs from '../interfaces/mutationArgs'

const Post = objectType({
  name: "Post",
  nonNullDefaults: {
    input: true,
    output: true,
  },
  definition(t) {
    t.string("title")
    t.string("author")
    t.string("content")
    t.nullable.string("thumbnail")
    t.int("karma")
    t.int("numComments")
    t.string("url")
    t.string("permalink")
    t.int("date")
    t.field("newPost", {
      type: "Post"
    })
  }
})

const Query = queryType({
  definition(t) {
    t.string("hello", {
      args: { name: stringArg() },
      resolve: (parent, { name }) => `Hello ${name || 'World'}!`
    }),
    t.field("post", )
  }
})

const types = [Post, Query]

export const schema = makeSchema({ types })
