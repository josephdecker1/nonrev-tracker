import React, { Suspense } from "react";
import { useHistory } from "react-router-dom";
import Loader from "./components/loader";

import { css } from "@emotion/core";
import { colors } from "./app_css";

import { useAuth } from "./Auth";
import { AuthenticatedUser } from "./containers/AuthenticatedUser";
import firebaseApp from "../firebase";
import keys from "../keys";
import { SideNavigation } from "./containers/SideNavigation";

const App = () => {
  const { user, userRef } = useAuth(firebaseApp.auth());
  const [sideNavigationWidth, updateSideNavigationWidth] = React.useState(0);
  let history = useHistory();

  React.useEffect(() => {
    updateSideNavigationWidth(
      document.getElementById("SideNavigation").clientWidth
    );

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${keys.GOOGLE_API_KEY}`;
    // //For head
    document.head.appendChild(script);
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
