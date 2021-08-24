import styles from './Main.module.scss'
import Modal from './Modal'
import { UserContext } from '@components/Context/UserContext'
import { auth } from '@config'
import { getRedirectResult, onAuthStateChanged, signOut } from 'firebase/auth'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'

const Main = () => {
  const router = useRouter()
  const [message, setMessage] = useState("no one logged in")
  const [modalOpen, setModalOpen] = useState(false)
  const { currUser, setCurrUser } = useContext(UserContext)!

  const handleSignOut = async () => {
    await signOut(auth)
    localStorage.removeItem("currUser")
    setCurrUser(null)
    setMessage("no one logged in")
  }

  useEffect(() => {
    if (currUser) {
      setMessage(currUser.email)
      return
    }
    onAuthStateChanged(auth, async (user) => {
      console.log("user changed")
      if (user) {
        setMessage(user.email!)
        const currUser = {
          name: user.displayName!,
          email: user.email!,
          uid: user.uid!
        }
        setCurrUser(currUser)
        localStorage.setItem("currUser", JSON.stringify(currUser))
        const response = await axios.post("/api/gql", {
          query: `
          mutation {
            addUser(name: "${user.displayName!}", email: "${user.email!}", uid: "${user.uid}")
          }`
        })
        console.log(response.data.data.addUser)
        // router.push("/dashboard")
        // window.location.pathname = "/dashboard"
        console.log(window.location.pathname)
      }
    })
    const checkCreds = async () => {
      console.log("checking creds")
      const result = await getRedirectResult(auth)
      if (result) {
        window.location.pathname = "/dashboard"
      }
    }
    // const checkCreds = async () => {
    //   const result = await getRedirectResult(auth)
    //   if (result) {
    //     console.log(result.user)
    //     const response = await axios.post("/api/gql", {
    //       query: `
    //       mutation {
    //         addUser(name: "${result.user.displayName!}", email: "${result.user.email!}", uid: "${result.user.uid}")
    //       }`
    //     })
    //     console.log(response)
    //     router.push({
    //       pathname: "/",
    //       query: {
    //         redirect: true
    //       }
    //     })
    //   }
    // }
    checkCreds()
  }, [currUser])

  return <>
    <div id={styles.background}>
      <main id={styles.container}>
        <h2>Track activity of any subreddit, search query, or both.</h2>
        <button onClick={() => setModalOpen(!modalOpen)}>Get started for free, forever</button>
        {/* <button onClick={() => console.log(currUser)}>Another one</button> */}
        <button onClick={handleSignOut}>Log out</button>
        <p>
          Redditrack keeps track of your favorite subreddits and/or queries, and automatically updates your dashboard with new posts. Never miss a thing!
        </p>
        <p>{message}</p>
      </main>
    </div>
    {modalOpen ? <Modal setOpen={setModalOpen} /> : null}
  </>
}

export default Main
