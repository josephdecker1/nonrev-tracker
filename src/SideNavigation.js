import React from "react";
import { Menu, Sidebar, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";

import { login, logout } from "./Auth";
import firebaseApp from "../firebase";

export const SideNavigation = props => {
  const [modalState, updateModalState] = React.useState(false);
  const user = props.user;
  console.log("USER => " + JSON.stringify(user));

  // [
  //   "red",
  //   "orange",
  //   "yellow",
  //   "olive",
  //   "green",
  //   "teal",
  //   "blue",
  //   "violet",
  //   "purple",
  //   "pink",
  //   "brown",
  //   "grey",
  //   "black"
  // ];

  React.useEffect(() => {
    user ? updateModalState(false) : null;
  }, [user]);

  return (
    <div>
      <Sidebar
        id="SideNavigation"
        as={Menu}
        direction="left"
        inverted
        vertical
        visible={true}
        width="thin"
        color="blue"
      >
        <Menu.Item as={Link} to="/">
          <Icon name="home" />
          Home
        </Menu.Item>

        <Menu.Item as={Link} to="/map">
          <Icon name="map" />
          Map
        </Menu.Item>

        {user && (
          <>
            <Menu.Item as={Link} to="/account">
              <Icon name="cog" />
              Account
            </Menu.Item>
            <Menu.Item as={Link} to="/" onClick={() => logout()}>
              <Icon name="log out" />
              Log Out
            </Menu.Item>
          </>
        )}

        {!user && (
          <Menu.Item
            as="a"
            onClick={() => {
              console.log("I was clicked");
              updateModalState(!modalState);
            }}
          >
            <Icon name="angle right" />
            Login
          </Menu.Item>
        )}
      </Sidebar>
      {modalState ? (
        <LoginModal
          modalState={modalState}
          updateModalState={updateModalState}
        />
      ) : null}
    </div>
  );
};
