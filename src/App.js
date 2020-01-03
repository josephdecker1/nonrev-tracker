import React, { Suspense } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import Loader from "./components/loader";

import { css } from "@emotion/core";
import { colors } from "./app_css";

import { useAuth } from "./Auth";
import { AuthenticatedUser } from "./containers/AuthenticatedUser";
// import admin from "firebase-admin";
import firebaseApp from "../firebase";
import { SideNavigation } from "./containers/SideNavigation";
// import { Button, Header, Icon, Modal } from "semantic-ui-react";

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

  const getCurrentApp = loc => {
    let activeApp = null;
    if (loc.location.pathname.length === 1) {
      activeApp = "home";
    } else {
      activeApp = loc.location.pathname.toString().split("/")[1];
    }

    return activeApp;
  };

  const renderApp = () => {
    let component;
    if (user || getCurrentApp(history) == "home") {
      component = (
        <AuthenticatedUser
          user={user}
          userRef={userRef}
          navWidth={sideNavigationWidth}
        />
      );
    } else {
      component = (
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
      );
    }
    return component;
  };

  return (
    <Suspense fallback={<Loader />}>
      <div>
        {/* The active app will determine what is displayed in the main content area */}
        <SideNavigation user={user} activeApp={getCurrentApp(history)} />
        {renderApp(user)}
      </div>
    </Suspense>
  );
};

export default App;
