import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { css } from "@emotion/core";
import { colors } from "./app_css";

import { useAuth, login, logout } from "./Auth";
import { AuthenticatedUser } from "./AuthenticatedUser";
// import admin from "firebase-admin";
import firebaseApp from "../firebase";
import data from "../airports.json";
import { SideNavigation } from "./SideNavigation";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

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

  React.useEffect(() => {
    updateSideNavigationWidth(
      document.getElementById("SideNavigation").clientWidth
    );
  }, []);

  return (
    <div>
      <Router>
        <SideNavigation user={user} />
        <>
          {/* AuthenticatedUser user render */}
          {isLoading && <Loading />}
          {user && (
            <>
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
      </Router>
    </div>
  );
};

export default App;
