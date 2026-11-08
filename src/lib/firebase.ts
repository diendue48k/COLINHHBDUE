import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyAvI8WlZp6JCukBINRKeirlSh-CsoKfzDE",
  authDomain: "hbclinh.firebaseapp.com",
  projectId: "hbclinh",
  storageBucket: "hbclinh.firebasestorage.app",
  messagingSenderId: "102299246755",
  appId: "1:102299246755:web:b116ebfa02dced85489f16"
};

// Initialize Firebase (singleton)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
