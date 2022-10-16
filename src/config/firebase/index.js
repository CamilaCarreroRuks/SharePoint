import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEDJaXmrpMtibiyf0iOOZyBeaN5T9E_zE",
  authDomain: "starbucksdb-2022.firebaseapp.com",
  databaseURL: "https://starbucksdb-2022-default-rtdb.firebaseio.com",
  projectId: "starbucksdb-2022",
  storageBucket: "starbucksdb-2022.appspot.com",
  messagingSenderId: "713610098653",
  appId: "1:713610098653:web:686bffad855b71889da834",
  measurementId: "G-NW1J0XMXN5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const firestoreDB = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const functions = getFunctions(firebaseApp);

// firebase.auth().languageCode = 'es'

export { firebaseApp, auth, functions, firestoreDB };
