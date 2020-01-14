import React from "react";
import firebaseApp, { providers } from "../firebase";

const db = firebaseApp.firestore();

export const useAuth = auth => {
  const [authState, setState] = React.useState({
    isLoading: true,
    user: null,
    userRef: null
  });

  const setDatabaseRef = authState => {
    let userRef = null;

    if (authState) {
      userRef = db.collection("users").doc(authState.uid);
      userRef.get().then(doc => {
        if (doc.exists) {
          //don't do anything, it exists!
        } else {
          //doc doesn't exist yet, so we're gonna make one for the user
          userRef.set({
            created: new Date(),
            userName: authState.displayName,
            flight_data: []
          });
        }
      });
    }
    return userRef;
  };

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authState =>
      setState({
        isLoading: false,
        user: authState,
        userRef: setDatabaseRef(authState)
      })
    );
    return unsubscribe;
  }, [auth]);
  return authState;
};

export const googleLogin = () => {
  firebaseApp
    .auth()
    .signInWithPopup(providers.Google)
    .then(function (result) {
      // This gives you a Google Access Token.
      let token = result.credential.accessToken;
      // The signed-in user info.
      let user = result.user;
      console.log(user);
      return user;
      // TODO: Update the user object for when they logged in
    });
};

export const facebookLogin = () => {
  firebaseApp
    .auth()
    .signInWithPopup(providers.Facebook)
    .then(function (result) {
      // This gives you a Google Access Token.
      let token = result.credential.accessToken;
      // The signed-in user info.
      let user = result.user;
      console.log(user);
      return user;
      // TODO: Update the user object for when they logged in
    });
};

export const twitterLogin = () => {
  firebaseApp
    .auth()
    .signInWithPopup(providers.Twitter)
    .then(function (result) {
      // This gives you a Google Access Token.
      let token = result.credential.accessToken;
      let secret = result.credential.secret;
      // The signed-in user info.
      let user = result.user;
      console.log(user);
      return user;
      // TODO: Update the user object for when they logged in
    });
};

export const emailPasswordLogin = (username, password) => {
  return firebaseApp
    .auth()
    .signInWithEmailAndPassword(username, password)
    .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;

      return [errorCode, errorMessage];
    });
};

export const createEmailPasswordUser = (username, password) => {
  firebaseApp
    .auth()
    .createUserWithEmailAndPassword(username, password)
    .catch(function (error) {
      // Handle Errors here.

      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(`ErrorCode: ${errorCode}\nErrorMessage: ${errorMessage}`)

      return [errorCode, errorMessage];
    });
};

export const logout = () => {
  firebaseApp.auth().signOut();
};
