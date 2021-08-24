import Snoowrap, { Listing, Submission } from 'snoowrap'

const snoow = new Snoowrap({
  userAgent: process.env.USERAGENT!,
  clientId: process.env.CLIENTID!,
  clientSecret: process.env.CLIENTSECRET!,
  refreshToken: process.env.REFRESHTOKEN!
})

export default snoow
