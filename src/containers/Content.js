import React, { Suspense } from "react";
import { css } from "@emotion/core";

const UserData = React.lazy(() => import("../apps/UserData"));
const Home = React.lazy(() => import("../apps/Home"));
const Map = React.lazy(() => import("../apps/MapWrapper"));
const Account = React.lazy(() => import("../apps/Account"));

import Loader from "../components/loader";

const renderContent = (user, location, userRef, navWidth, flightData) => {
  switch (location) {
    case "/map":
      return (
        <>
          <div
            css={ css`
              width: 100%;
              height: 100vh;
              padding: 0px;
            `}
          >
            <Map user={user} navWidth={navWidth} />
          </div>
        </>
      );
    case "/account":
      return <Account user={ user } userRef={ userRef } />;
    case "/userdata":
      return <UserData user={ user } userRef={ userRef } />;
    default:
      return (
        <Home
          user={user}
          userRef={userRef}
          css={css`
            width: calc(100% - ${navWidth}px);
          `}
        />
      );
  }
};

const Content = props => {
  const { user, userRef, location, navWidth, flightData } = props;

  return (
    <div>
      <Suspense fallback={<Loader />}>
        {renderContent(user, location, userRef, navWidth, flightData)}
      </Suspense>
    </div>
  );
};

export default Content;
