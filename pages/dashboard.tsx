import { GetServerSideProps } from 'next'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '@components/Context/UserContext'
import { auth } from '@config'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import Post from '@api/interfaces/post'
import axios from 'axios'

import Nav from "@components/Globals/Nav"
import AddQuery from '@components/Dashboard/AddQuery'
import CardDisplay from '@components/Dashboard/CardDisplay'

export interface cardCollection {
  query: string
  posts: cardProps[]
}

export interface cardProps extends Post { }

export interface dashProps {
  queries: cardCollection[]
  cached: boolean
}

export default function Dashboard() {
  const [queries, setQueries] = useState<cardCollection[]>([])
  const [lastUpdate, setLastUpdate] = useState("")
  const router = useRouter()
  const { currUser, setCurrUser } = useContext(UserContext)
  const fiveMin = 5 * 60000

  const getQueries = async () => {
    console.log("Hello")
    if (currUser) {
      console.log("there is a user pt2")
      const { email } = currUser
      const query = `query {
        posts(email: "${email}") {
          query
          posts {
            title
            author
            content
            thumbnail
            karma
            numComments
            url
            permalink
            date
            id
          }
        }
        lastUpdate(email: "${email}")
      }`
      const response = await axios.post("/api/gql", { query })
      const tempQueries: cardCollection[] = response.data.data.posts
      setQueries(tempQueries)
      let update = new Date(Number(response.data.data.lastUpdate) * 1000)
      setLastUpdate(update.toLocaleString())
    }

    useEffect(() => {
      console.log(queries)
      if (!currUser) {
        const data = localStorage.getItem("currUser")
        if (!data) {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              setCurrUser!({
                name: user.displayName!,
                email: user.email!,
                uid: user.uid!
              })
            } else {
              router.push("/")
              return
            }
          })
        } else {
          setCurrUser(JSON.parse(data))
        }
      }
    }, [])
  }

  useEffect(() => {
    console.log(currUser)
    getQueries()
    const interval = setInterval(async () => {
      console.log("fetching new posts..")
      if (currUser) {
        console.log("there is a user.")
        const { email } = currUser
        const updateQuery = `mutation {
          updatePosts(email: "${email}") {
            query
            postsAdded
          }
        }`
        await axios.post("/api/gql", { query: updateQuery })
        await getQueries()
      }
    }, fiveMin)
    return () => clearInterval(interval)
  }, [currUser])

  useEffect(() => {
    console.log("queries: " + queries)
  }, [queries])

  return <>
    <Nav />
    <AddQuery />
    <CardDisplay queries={queries} lastUpdate={lastUpdate} />
  </>
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   let cached = false
//   const currUser = localStorage.getItem("currUser")
//   const queries: cardCollection[] = []

//   if (currUser) {
//     const email = JSON.parse(currUser).email
//     const queryRef = collection(firestore, "users", email, "queries")
//     const querySnap = await getDocs(queryRef)
//     querySnap.forEach(query => {
//       queries.push(query.data().posts)
//     })
//     cached = true
//   }

//   return {
//     props: {
//       queries,
//       cached
//     }
//   }
// }
