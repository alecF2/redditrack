import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import UserContextProvider from '@components/Context/UserContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  )
}

export default MyApp
