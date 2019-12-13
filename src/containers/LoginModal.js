import React from "react";
import {
  Header,
  Modal,
  Button,
  Grid,
  Form,
  Message,
  Divider
} from "semantic-ui-react";
import { css } from "@emotion/core";
import firebaseApp, { providers } from "../../firebase";
import { googleLogin, twitterLogin, facebookLogin } from "../Auth";

const LoginModal = props => {
  const [username, updateUserName] = React.useState("");
  const [password, updatePassword] = React.useState("");
  const [loginResult, updateLoginResult] = React.useState([]);
  const [usernameError, updateUsernameError] = React.useState({});
  const [passwordError, updatePasswordError] = React.useState({});

  React.useEffect(() => {
    if (loginResult.length > 0) {
      loginResult[0] === "auth/invalid-email"
        ? updateUsernameError({
            error: true,
            message:
              "Something went wrong with your email. Check its formatting"
          })
        : null;

      loginResult[0] === "auth/wrong-password"
        ? updatePasswordError({
            error: true,
            message: "Incorrect password. Try again"
          })
        : null;

      console.log(loginResult[0]);
      console.log(loginResult[1]);
    }
  }, [loginResult]);

  const formLoginSubmit = e => {
    console.log(e);
    e.preventDefault();

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(username, password)
      .catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        updateLoginResult([errorCode, errorMessage]);
      });
  };

  return (
    <Modal
      open={props.modalState}
      onClose={() => props.updateModalState(false)}
      size="large"
    >
      <Modal.Content>
        <div
          css={css`
            height: 33vh;
            display: flex-inline;
            text-align: center;
            align-items: center;
          `}
        >
          <Grid
            columns={2}
            relaxed="very"
            textAlign="center"
            verticalAlign="middle"
          >
            <Grid.Row>
              <Grid.Column
                css={css`
                  height: 100%;
                `}
              >
                <Header
                  as="h2"
                  css={css`
                    display: flex;
                    justify-content: center;
                    height: 60px;
                  `}
                >
                  <div
                    css={css`
                      color: #000;
                      margin-left: 5px;
                      display: flex;
                      text-align: center;
                      align-items: center;
                    `}
                  >
                    Log-in to your account
                  </div>
                </Header>
                <Form
                  type=""
                  onSubmit={e => {
                    console.warn("I'm getting submitted!");
                    formLoginSubmit(e);
                  }}
                  size="large"
                >
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="Username"
                    value={username}
                    type="text"
                    onChange={e => {
                      updateUserName(e.target.value);
                      updateUsernameError(false);
                    }}
                    error={
                      usernameError.error
                        ? { content: usernameError.message, pointing: "above" }
                        : null
                    }
                  />
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => {
                      updatePassword(e.target.value);
                      updatePasswordError(false);
                    }}
                    error={
                      passwordError.error
                        ? { content: passwordError.message, pointing: "above" }
                        : null
                    }
                  />
                  <Button
                    color="green"
                    inverted
                    size="large"
                    type="submit"
                    name="submit"
                    // onClick={ (e) => {
                    //   console.log("Logging user in!");
                    //   formLoginSubmit(e)

                    // } }
                  >
                    Login
                  </Button>
                </Form>

                <Message>
                  New to us? <a href="#">Sign Up</a>
                </Message>
              </Grid.Column>
              <Grid.Column
                css={css`
                  height: 100%;
                `}
              >
                <Header
                  as="h2"
                  css={css`
                    display: flex;
                    justify-content: center;
                    height: 60px;
                  `}
                >
                  <div
                    css={css`
                      color: #000;
                      margin-left: 5px;
                      display: flex;
                      text-align: center;
                      align-items: center;
                    `}
                  >
                    Log-in with a 3rd Party provider
                  </div>
                </Header>
                <div>
                  <Grid>
                    <Grid.Row columns={3}>
                      <Grid.Column centered="true" floated="right">
                        <Button
                          color="facebook"
                          icon="facebook"
                          content="facebook"
                          onClick={() => facebookLogin()}
                        />
                      </Grid.Column>
                      <Grid.Column centered="true" width="5">
                        <Button
                          color="twitter"
                          icon="twitter"
                          content="twitter"
                          onClick={() => twitterLogin()}
                        />
                      </Grid.Column>
                      <Grid.Column centered="true" floated="left">
                        <Button
                          color="google plus"
                          icon="google"
                          content="google"
                          onClick={() => googleLogin()}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div>
              </Grid.Column>
              <Divider
                vertical
                css={css`
                  height: 100%;
                `}
              >
                Or
              </Divider>
            </Grid.Row>
          </Grid>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default LoginModal;
