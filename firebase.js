import firebase from "firebase";

export const firebaseConfig = {
  apiKey: process.env.GOOGLE_API_KEY || "google_api_key",
  authDomain: "nonrev-tracker.firebaseapp.com",
  databaseURL: "https://nonrev-tracker.firebaseio.com",
  projectId: "nonrev-tracker",
  storageBucket: "nonrev-tracker.appspot.com",
  messagingSenderId: "34847143661",
  appId: "1:34847143661:web:0ccf03706a54b6f008bee4",
  measurementId: "G-BJ12CCPN84"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;

export const providers = {
  Google: new firebase.auth.GoogleAuthProvider(),
  Twitter: new firebase.auth.TwitterAuthProvider(),
  Facebook: new firebase.auth.FacebookAuthProvider()
};
