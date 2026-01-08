import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUJRt7RhV6IryyqOnQWKam9cbh9ONTnYo",
  authDomain: "catan-6943e.firebaseapp.com",
  projectId: "catan-6943e",
  storageBucket: "catan-6943e.firebasestorage.app",
  messagingSenderId: "507021885382",
  appId: "1:507021885382:web:fdfe1779c9372fd5597cc7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
