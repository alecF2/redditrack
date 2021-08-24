import styles from './Nav.module.scss'
import Modal from '@components/Home/Modal'

import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { UserContext } from '@components/Context/UserContext'


const Nav = () => {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const { currUser } = useContext(UserContext)

  const Button = () => {
    // console.log(currUser)
    if (!currUser) {
      return <button onClick={() => setModalOpen(true)}>Sign in</button>
    }
    return <button onClick={() => router.push("/dashboard")}>Dashboard</button>
  }
  
  return (
    <>
      <div id={styles.background}>
        <nav id={styles.container}>
          <div>
            <img src="/images/Globals/reddit_stack.svg" alt="logo" />
            <Link href="/"><a><h1>redditrack</h1></a></Link>
          </div>
          <div>
            <Link href="/about"><a><h2>About</h2></a></Link>
            <Button />
          </div>
        </nav>
      </div>
      {modalOpen ? <Modal setOpen={setModalOpen} /> : null}
    </>
  )
}

export default Nav
