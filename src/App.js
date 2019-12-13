import React from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { css } from "@emotion/core";
import { colors } from "./app_css";

import { useAuth } from "./Auth";
import { AuthenticatedUser } from "./containers/AuthenticatedUser";
// import admin from "firebase-admin";
import firebaseApp from "../firebase";
import { SideNavigation } from "./containers/SideNavigation";
// import { Button, Header, Icon, Modal } from "semantic-ui-react";

const Loading = () => {
  return (
    <div>
      <h1>LOADING....</h1>
    </div>
  );
};

const App = () => {
  const { isLoading, user, userRef } = useAuth(firebaseApp.auth());
  const [sideNavigationWidth, updateSideNavigationWidth] = React.useState(0);
  const [flightData, updateFlightData] = React.useState();
  let userData = null;
  let history = useHistory();

  React.useEffect(() => {
    updateSideNavigationWidth(
      document.getElementById("SideNavigation").clientWidth
    );
  }, []);

  // React.useEffect(() => {
  //   if (user) {
  //     userData = getUserData(firebaseApp.auth().currentUser.uid);
  //     console.log(
  //       "USERDATA FOR => " +
  //         firebaseApp.auth().currentUser.uid +
  //         " " +
  //         JSON.stringify(getUserData(firebaseApp.auth().currentUser.uid))
  //     );
  //   }
  // }, [user]);

  const getCurrentApp = loc => {
    let activeApp = null;
    if (loc.location.pathname.length === 1) {
      activeApp = "home";
    } else {
      activeApp = loc.location.pathname.toString().split("/")[1];
    }

    return activeApp;
  };

  return (
    <div>
      {/* The active app will determine what is displayed in the main content area */}
      <SideNavigation user={user} activeApp={getCurrentApp(history)} />
      <>
        {/* AuthenticatedUser user render */}
        {isLoading && <Loading />}
        {user && (
          <>
            {console.log(firebaseApp.auth().currentUser.uid)}
            <AuthenticatedUser
              user={user}
              userRef={userRef}
              navWidth={sideNavigationWidth}
            />
          </>
        )}
      </>

      {/* Anonymous user render */}
      {!user && (
        <div
          css={css`
            background-color: ${colors.white};
            width: calc(100vw - ${sideNavigationWidth}px);
            margin-left: ${sideNavigationWidth}px;
            height: 100vh;
          `}
        >
          <h1>You aren't logged in. Please login!</h1>
        </div>
      )}
    </div>
  );
};

export default App;
