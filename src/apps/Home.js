import React, { Suspense } from "react";
import { css } from "@emotion/core";
import { Container } from "semantic-ui-react";

import Loader from "../components/loader";
import { colors } from "../app_css";

const Home = props => {
  return (
    <Suspense fallback={<Loader />}>
      <div
        css={css`
          background-color: ${colors.green};
          width: 100vw;
          padding: 10px;
        `}
      >
        <h1>hello! Home page</h1>
      </div>
    </Suspense>
  );
};

export default Home;
