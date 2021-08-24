import Nav from "@components/Globals/Nav"
import Main from "@components/Home/Main"

import { GetServerSideProps } from 'next'

export default function Home() {
  return (
    <>
      <Nav />
      <Main />
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   return {
//     props: {
//       name: "alec",
//       email: "alec@null.net",
//       uid: "42"
//     }
//   }
// }
