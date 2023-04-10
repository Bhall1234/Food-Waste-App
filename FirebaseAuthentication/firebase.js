import { initializeApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBFkKZUzEswIbzsRh-0jrKepw-oVlpU2Yw",
  authDomain: "fir-auth-b576b.firebaseapp.com",
  projectId: "fir-auth-b576b",
  storageBucket: "fir-auth-b576b.appspot.com",
  messagingSenderId: "140911345740",
  appId: "1:140911345740:web:567a76d0b957d7e45a74e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
const firestore = getFirestore(app);

export { auth, firestore };