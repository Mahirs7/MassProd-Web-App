import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDiYzVMqaHrugcyXOd27LDgnc4ONEpZWQs",
  authDomain: "massprod-17650.firebaseapp.com",
  projectId: "massprod-17650",
  storageBucket: "massprod-17650.appspot.com",
  messagingSenderId: "876013829409",
  appId: "1:876013829409:web:c0b4bd60f5eef80eb05260",
  measurementId: "G-1BRHFP1V03"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
