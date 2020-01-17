import React, { Suspense } from "react";
import { useHistory } from "react-router-dom";
import { css } from "@emotion/core";
import { Container } from "semantic-ui-react";

import Loader from "../components/loader";
import { colors } from "../app_css";

const AccountCreation = React.lazy(() =>
  import("../containers/AccountCreation")
);

const Home = props => {
  const renderContent = location => {
    let component = null;
    if (location.hash.replace("#", "") === "sign-up") {
      component = (
        <>
          <div>
            Signing you up!
            <div>
              <AccountCreation userRef={props.userRef || null} />
            </div>
          </div>
        </>
      );
    } else {
      component = <h1>hello! Home page</h1>;
    }

    return component;
  };

  let history = useHistory();

  return (
    <Suspense fallback={<Loader />}>
      <div
        css={css`
          background-color: ${colors.white};
          padding: 10px;
        `}
      >
        {renderContent(history.location)}
      </div>
    </Suspense>
  );
};

export default Home;
