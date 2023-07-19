import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {
  GoogleAuthProvider,
  getAuth
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBWnrtWvXyojGCT-0-DiL-kH3hdeqmYdho",
    authDomain: "todo-sandra.firebaseapp.com",
    projectId: "todo-sandra",
    storageBucket: "todo-sandra.appspot.com",
    messagingSenderId: "792312027273",
    appId: "1:792312027273:web:ee152819b7a4d1a1c14e58",
    measurementId: "G-X28EWD18W3"
};
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
const googleProvider = new GoogleAuthProvider()


export { db, firebaseApp, auth, googleProvider }