import React, { Suspense } from "react";
import { Icon, Table, Container, Button, Form } from "semantic-ui-react";
import Loader from "../components/loader";
import Editable from "../components/Editable";

const Account = props => {
  const { user, userRef } = props;
  const [userData, updateUserData] = React.useState({});
  const [editState, updateEditState] = React.useState(false);

  const [accountData, updateAccountData] = React.useState({
    email: user.email,
    verified: user.emailVerified.toString() || false,
    photoURL: user.photoURL || "",
    home_base: userData.home_base || "dal",
    department: userData.department || "swa"
  });

  const updateField = e => {
    updateAccountData({
      ...accountData,
      [e.target.name]: e.target.value
    });
  };

  React.useEffect(() => {
    userRef.get().then(doc => {
      if (doc.exists) {
        updateAccountData({
          ...accountData,
          home_base: doc.data().home_base,
          department: doc.data().department || "swa"
        });
      }
    });
  }, []);

  const handleEditClick = () => {
    updateEditState(!editState);
  };

  const handleSubmit = () => {
    console.info("SUBMIT WAS CLICKED!");
  };

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        {editState && (
          <div>
            <h1>Here's the editable data</h1>

            {Object.keys(accountData).map(item => {
              return (
                <div key={item}>
                  {item} ::
                  <Editable
                    updateValue={updateField}
                    value={accountData[item]}
                    name={item}
                  />
                </div>
              );
            })}
          </div>
        )}

        {!editState && (
          <div>
            <h1>
              Hey
              {user?.displayName
                ? ` ${user.displayName.toString().split(" ")[0]}`
                : ""}
              , here's your data <Icon name="id badge outline" />
            </h1>
            {Object.keys(accountData).map(item => {
              return (
                <div key={item}>
                  {console.log(item, accountData[item])}
                  {item} :: {accountData[item]}
                </div>
              );
            })}
          </div>
        )}

        {/* {editState ? (
          <Button color="red" onClick={handleEditClick}>
            CANCEL
          </Button>
        ) : (
          <Button color="green" onClick={handleEditClick}>
            EDIT
          </Button>
        )} */}
      </Container>
    </Suspense>
  );
};

export default Account;
