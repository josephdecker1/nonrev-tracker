import React, { Suspense, lazy } from "react";
import { css } from "@emotion/core";

const UserData = React.lazy(() => import("../apps/UserData"));
const Home = React.lazy(() => import("../apps/Home"));
const Map = React.lazy(() => import("../apps/Map"));
const Account = React.lazy(() => import("../apps/Account"));

import Loader from "../components/loader";

const renderContent = (user, location, userRef) => {
  switch (location) {
    case "/map":
      return (
        <>
          <div
            css={css`
              width: 100%;
              height: 50vh;
              padding: 0px;
            `}
          >
            <Map
              center={{ lat: 32.7766642, lng: -96.7969879 }}
              zoom={4}
              flightsUploaded={false}
              flightData={[]}
            />
          </div>

          <div
            css={css`
              height: 100px;
              width: calc(100% - 10px);
              background-color: blue;
              margin: 5px;
              color: white;
            `}
          >
            boo
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
  const { user, userRef, location, userData } = props;

  return (
    <div>
      <Suspense fallback={<Loader />}>
        {renderContent(user, location, userRef, userData)}
      </Suspense>
    </div>
  );
};

export default Content;
