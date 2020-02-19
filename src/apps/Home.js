import React, { Suspense } from "react";
import { useHistory } from "react-router-dom";
import { css } from "@emotion/core";
import { Container } from "semantic-ui-react";

import Loader from "../components/loader";
import { colors } from "../app_css";
const AccountCreation = React.lazy(() => import("../containers/AccountCreation"));

const Home = props => {
  const renderContent = location => {
    let component = null;
    if (location.hash.replace("#", "") === "sign-up") {
      component = (
        <>
          <div>
            Signing you up!
            <div>
              <AccountCreation userRef={ props.userRef || null } />
            </div>
          </div>

        </>
      )
    } else {
      component = (<div>
      <div css={ css` background: url(https://image.businessinsider.com/5db803d8dee01914e3699423?width=1100&format=jpeg&auto=webp) center 80%;
           background-size: 100% 600px;
            margin-bottom: 10px;
            height: 600px;
            transition: 0.5s ease all;
            &.blurred {
              filter: blur(2px);
            }`}>
            <div className="ui center aligned container">
              <h1 css={css`padding-top: 50px; font-size: 30px; font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>Welcome to the Non-Revenue Visualization Tool</h1>
            </div>
      </div>

          <div className="ui center aligned container">

            <h2 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>Ready to visualize your travels?  </h2>
            <h3 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>You have come to the right place!</h3>
            <h4 css={css`margin-bottom: 50px; font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>Click on Login to get started</h4>

            <div className="ui divided three column grid">
              <div className="row">
                <div className="column">
                  <i aria-hidden="true" className="red paper plane huge icon"></i>
                  <h3 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>View Previous Non-Rev Flights</h3>
                  <h4 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>A beautiful map will demonstrate where your travels have taken you</h4>
                </div>
                <div className="column">
                  <i aria-hidden="true" className="red calendar check huge icon"></i>
                  <h3 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>Automatic Check-in</h3>
                  <h3 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>(COMING SOON in V2)</h3>
                  <h4 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>Get automatically checked in for your non-rev flights 24 hours before so you can have the best place in line!</h4>
                </div>
                <div className="column">
                  <i aria-hidden="true" className="red trophy huge icon"></i>
                  <h3 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>Leaderboard</h3>
                  <h3 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>(COMING SOON in V2)</h3>
                  <h4 css={css`font-family: SouthwestSans,Arial,Helvetica,sans-serif; color: #1a2c80;`}>Who has traveled the most? You, your boss or your coworker? Find out here on our leaderboard!</h4>
                </div>
              </div>
              </div>

            </div>
        </div>
      )
    }

    return component;
  }

  let history = useHistory();
  console.log(history)
  return (
    <Suspense fallback={ <Loader /> }>
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
