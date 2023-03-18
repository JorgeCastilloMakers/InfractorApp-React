import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { v4 } from 'uuid'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};


export const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app)


export const uploadFile = async (file) => {  
  if (file == null) return;
  const storageRef = ref(storage, `${file.name + v4()}`);
  const metadata = {contentType: 'image/jpeg'}
  await uploadBytes(storageRef, file, metadata);
  const fileUrl = await getDownloadURL(storageRef);
  return fileUrl
}

auth.signOut();

