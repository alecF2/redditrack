import styles from './AddQuery.module.scss'
import { useRef, useContext, FormEvent } from 'react'
import { UserContext } from '@components/Context/UserContext'
import axios from 'axios'

const AddQuery = () => {
  const { currUser } = useContext(UserContext)
  const subRef = useRef<HTMLInputElement>(null)
  const queryRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (subRef.current!.value === "" && queryRef.current!.value === "") {
      return
    } else if (subRef.current!.value !== "") {
      const response = await axios.post("/api/gql", {
        query: `
        mutation {
          addQuery(sub:"${subRef.current!.value}", search: "${queryRef.current!.value}", email: "${currUser!.email}")
        }`
      })
      console.log(response.data.data)
    }
  }

  return (
    <div id={styles.background}>
      <form id={styles.container} onSubmit={handleSubmit}>
        <h2>Add a new query</h2>
        <span>Subreddit</span>
        <input type="text" id="subreddit" ref={subRef} />
        <br />
        <span>Query</span>
        <input type="text" id="query" ref={queryRef} />
        <br />
        <input type="submit" value="add" />
      </form>
    </div>
  )
}

export default AddQuery
