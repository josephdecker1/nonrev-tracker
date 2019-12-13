import React from "react";
import { useHistory } from "react-router-dom";
import { css } from "@emotion/core";
import Content from "./Content";

import { colors } from "../app_css";

export const AuthenticatedUser = props => {
  const { user, userRef, navWidth } = props;
  let history = useHistory();
  // const [userData, updateUserData] = React.useState({});

  // React.useEffect(() => {
  //   userRef.get().then(doc => {
  //     if (doc.exists) {
  //       console.log(doc.data());
  //       updateUserData(doc.data());
  //       // return doc.data();
  //     }
  //   });
  // }, [user]);

  console.log("USER => " + JSON.stringify(user));
  console.log("HISTORY -> " + JSON.stringify(history));
  return (
    <div
      css={css`
        background-color: ${colors.white};
        width: calc(100vw - ${navWidth}px);
        margin-left: ${navWidth}px;
        height: 100vh;
        padding: 0px;
      `}
    >
      <Content
        user={user}
        userRef={userRef}
        location={history.location.pathname}
      />
    </div>
  );
};
