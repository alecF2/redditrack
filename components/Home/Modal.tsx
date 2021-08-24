import styles from './Modal.module.scss'
import { FC, Dispatch, SetStateAction, MouseEventHandler } from 'react'

import { signInWithRedirect } from 'firebase/auth'
import { auth, provider } from '@config'

interface modalProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const Modal: FC<modalProps> = ({ setOpen }) => {
  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.currentTarget.id === styles.background) {
      setOpen(false)
    } else {
      e.stopPropagation()
    }
  }

  const handleGoogleLogin = async () => {
    await signInWithRedirect(auth, provider)
  }

  return (
    <div id={styles.background} onClick={handleClick}>
      <section id={styles.container} onClick={handleClick}>
        <h2>Select a service to sign in or sign up with.</h2>
        <button onClick={handleGoogleLogin}>Google</button>
        <button>Facebook</button>
      </section>
    </div>
  )
}

export default Modal
