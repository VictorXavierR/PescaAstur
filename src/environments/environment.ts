// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAcCB2YHDAu1J6Rch4h2f3lrR-SyaLWnyo",
  authDomain: "pescaastur-160f4.firebaseapp.com",
  projectId: "pescaastur-160f4",
  storageBucket: "pescaastur-160f4.appspot.com",
  messagingSenderId: "914560656948",
  appId: "1:914560656948:web:7063233166dffdc7f34c61",
  measurementId: "G-5NS06HHQKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;