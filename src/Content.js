import React, { Suspense, lazy } from "react";
import { css } from "@emotion/core";

const Map = React.lazy(() => import("./Map"));
const Account = React.lazy(() => import("./Account"));

const Loading = () => {
  return (
    <div>
      <h1>LOADING....</h1>
    </div>
  );
};

const renderContent = location => {
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
              width: calc(100% - 20px);
              background-color: blue;
              margin: 10px;
            `}
          >
            boo
          </div>
        </>
      );
    case "/account":
      return <Account />;
    default:
      return <div>home home home</div>;
  }
};

const Content = props => {
  const { user, location } = props;

  return (
    <div>
      <Suspense fallback={<Loading />}>{renderContent(location)}</Suspense>
    </div>
  );
};

export default Content;
