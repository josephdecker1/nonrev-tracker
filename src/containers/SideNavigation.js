import React from "react";
import { Menu, Sidebar, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";

import { logout } from "../Auth";

export const SideNavigation = props => {
  const [modalState, updateModalState] = React.useState(false);
  const { user, activeApp } = props;

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
      >
        <Menu.Item
          as={Link}
          to="/"
          active={activeApp === "home"}
          color={"green"}
        >
          <Icon name="home" />
          Home
        </Menu.Item>

        {user && (
          <>
            <Menu.Item
              as={Link}
              to="/map"
              active={activeApp === "map"}
              color={"green"}
            >
              <Icon name="map" />
              Map
            </Menu.Item>

            <Menu.Item
              as={Link}
              to="/account"
              active={activeApp === "account"}
              color={"green"}
            >
              <Icon name="cog" />
              Account
            </Menu.Item>

            <Menu.Item
              as={Link}
              to="/userdata"
              active={activeApp === "userdata"}
              color={"green"}
            >
              <Icon name="database" />
              User Data
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
