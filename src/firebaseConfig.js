import {initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBO-e9yfuBzTDsrtcN5GI8xkXFDrVDlm4c",
  authDomain: "weathersenseplus.firebaseapp.com",
  projectId: "weathersenseplus",
  storageBucket: "weathersenseplus.firebasestorage.app",
  messagingSenderId: "968437728601",
  appId: "1:968437728601:web:b4bbbee9a898cbe38df848"
};

const app=initializeApp(firebaseConfig);
export const db=getFirestore(app);
export default app;