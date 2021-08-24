import styles from './CardDisplay.module.scss'
import { FC, Fragment, useEffect } from 'react'

import { cardCollection, cardProps } from 'pages/dashboard'

interface FCProps {
  queries: cardCollection[]
  lastUpdate: string
}

const Card: FC<cardProps> = ({ title, thumbnail, karma, id, date }) => {
  const dateConvert = (d: number) => {
    const date = new Date(d*1000)
    return date.toLocaleString()
  }

  return (
    <section className={styles.query_card} key={id}>
      {thumbnail !== "self" && thumbnail !== "default" && thumbnail !== "spoiler" ? <img src={thumbnail} alt="thumbnail for post" /> : null}
      <div>
        <h2>{title}</h2>
        <p>{karma} karma</p>
        <p>{dateConvert(date)}</p>
      </div>
    </section>
  )
}

const Section: FC<cardCollection> = ({ query, posts }) => {
  const convert = (s: string) => {
    let newStr = s
    if (!s.startsWith("subreddit:") && s.includes("subreddit:")) {
      const split = s.split(" ")
      const sub = split.pop()!
      split.unshift(sub)
      newStr = split.join(" ")
    }
    if (newStr.includes("subreddit:")) {
      console.log(newStr)
      newStr = newStr.replace("subreddit:", "r/")
    }
    return newStr
  }

  return (
    <section className={styles.query_section} key={query}>
      <h2>{convert(query)}</h2>
      <article className={styles.query_box}>
        {posts && posts.length ? posts.map(Card) : null}
      </article>
    </section>
  )
}

const CardDisplay: FC<FCProps> = ({ queries, lastUpdate }) => {
  useEffect(() => {
    console.log("inside CardDIsplay: " + typeof queries)
  }, [queries])

  return (
    <div id={styles.background}>
      <main id={styles.container}>
        <h2>last updated {lastUpdate}</h2>
        {queries.length ? queries.map(Section) : <p>No posts yet</p>}
      </main>
    </div>
  )
}

export default CardDisplay
