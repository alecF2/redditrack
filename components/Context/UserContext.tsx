import { createContext, useState, useMemo, Dispatch, SetStateAction } from 'react'

export type UserContent = {
  name: string
  email: string
  uid: string
}

type UserContentMemo = {
  currUser: UserContent | null
  setCurrUser: Dispatch<SetStateAction<UserContent | null>>
}

export const UserContext = createContext<UserContentMemo>({
  currUser: null,
  setCurrUser: () => { }
})

const UserContextProvider = ({ children }: any) => {
  const [currUser, setCurrUser] = useState<UserContent | null>(null)
  const providerValue = useMemo(() => ({ currUser, setCurrUser }), [currUser, setCurrUser])

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
