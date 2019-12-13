import React from "react";

const UserData = props => {
  const { user, userRef } = props;
  const [userData, updateUserData] = React.useState({});
  const [flight_Data, updateFlightData] = React.useState([]);

  React.useEffect(() => {
    userRef.get().then(doc => {
      if (doc.exists) {
        console.log("USERDATA => " + JSON.stringify(doc.data()));
        updateUserData(doc.data());
        updateFlightData(doc.data().flight_data);
        // return doc.data();
      }
    });
  }, [user]);

  return (
    <>
      <h1>hello! UserData page</h1>
      {Object.entries(userData).map(key => {
        console.log(key);
        return (
          <div key={key}>
            {key[0].toString()} :: {key[1] ? key[1].toString() : "--"}
          </div>
        );
      })}

      {userData &&
        flight_Data.map(item => {
          return <div key={item}>{item}</div>;
        })}
    </>
  );
};

export default UserData;
