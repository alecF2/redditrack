import { initializeApp, getApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore/lite'

export const apiKey = "AIzaSyAPZk__ifJn82HS0RbFi7hNJZMeS2AAjn4"
export const authDomain = "reddit-track.firebaseapp.com"
export const projectId = "reddit-track"
export const storageBucket = "reddit-track.appspot.com"
export const messagingSenderId = "134141079475"
export const appId = "1:134141079475:web:7a38d6cac468cf0a7ae5c6"

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
}

// const firebaseConfig = {
//   apiKey: process.env.fb_apiKey!,
//   authDomain: process.env.fb_authDomain!,
//   projectId: process.env.fb_projectId!,
//   storageBucket: process.env.fb_storageBucket!,
//   messagingSenderId: process.env.fb_messagingSenderId!,
//   appId: process.env.fb_appId!
// }

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const provider = new GoogleAuthProvider()
export const firestore = getFirestore(firebaseApp) 
export const usersCol = collection(firestore, "users")

export default firebaseApp
