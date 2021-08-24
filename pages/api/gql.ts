import { ApolloServer } from 'apollo-server-micro'
import typeDefs from './schema'
import resolvers from './resolvers'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
})

export const config = {
  api: {
    bodyParser: false
  }
}

const startServer = apolloServer.start()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await startServer
  await apolloServer.createHandler({ path: "/api/gql" })(req, res)
}
