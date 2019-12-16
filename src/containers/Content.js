import React, { Suspense, lazy } from "react";
import { css } from "@emotion/core";

const UserData = React.lazy(() => import("../apps/UserData"));
const Home = React.lazy(() => import("../apps/Home"));
// const Map = React.lazy(() => import("../apps/Map"));
const Map = React.lazy(() => import("../apps/MapWrapper"));
const Account = React.lazy(() => import("../apps/Account"));

import Loader from "../components/loader";

const renderContent = (user, location, userRef, navWidth) => {
  switch (location) {
    case "/map":
      return (
        <>
          <div
            css={css`
              width: 100%;
              height: 100vh;
              padding: 0px;
            `}
          >
            <Map
              center={{ lat: 32.7766642, lng: -96.7969879 }}
              zoom={5}
              flightsUploaded={false}
              flightData={[]}
              navWidth={navWidth}
            />
          </div>
        </>
      );
    case "/account":
      return <Account user={user} userRef={userRef} />;
    case "/userdata":
      return <UserData user={user} userRef={userRef} />;
    default:
      return <Home user={user} userRef={userRef} />;
  }
};

const Content = props => {
  const { user, userRef, location, userData, navWidth } = props;

  return (
    <div>
      <Suspense fallback={<Loader />}>
        {renderContent(user, location, userRef, navWidth)}
      </Suspense>
    </div>
  );
};

export default Content;
