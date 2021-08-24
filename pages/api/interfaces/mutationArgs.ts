export interface postArgs {
  sub: string
  query: string
  email: string
}

export interface addUserArgs {
  name: string
  email: string
  uid: string
}

export interface addQueryArgs {
  sub: string
  search: string
  email: string
}

export interface updatePostsArgs {
  email: string
}
