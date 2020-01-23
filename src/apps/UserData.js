import React from "react";
import { uuid } from "uuidv4";
import { css } from "@emotion/core";
import { Table, } from "semantic-ui-react";
import { colors } from "../app_css";
import firebaseApp from "../../firebase";

const db = firebaseApp.firestore();

const UserData = props => {
  const { user, userRef } = props;
  const [userData, updateUserData] = React.useState({});
  const [flight_Data, updateFlight_Data] = React.useState([]);
  const [flightData, updateFlightData] = React.useState([]);
  const [flights_uploaded, updateFlightsUploaded] = React.useState(false);

  React.useEffect(() => {
    db.collection("users").doc(user.uid).get().then(doc => {
      if (doc.exists) {
        updateUserData(doc.data());
        updateFlight_Data(doc.data().flight_data);
      }
    });
  }, [user]);


  const renderData = data => {
    return (
      <Table
        aria-label="flight table"
        size="small"
        css={ css`
          width: 100%;
        `}
      >
        <Table.Header
          css={ css`
            background-color: ${colors.green};
          `}
        >
          <Table.Row>
            <Table.Cell>Flight PNR</Table.Cell>
            <Table.Cell align="center">Flight Date</Table.Cell>
            <Table.Cell align="center">Flight Number</Table.Cell>
            <Table.Cell align="center">Origin</Table.Cell>
            <Table.Cell align="center">Origin Location</Table.Cell>
            <Table.Cell align="right">Destination</Table.Cell>
            <Table.Cell align="center">Destination Location</Table.Cell>
            <Table.Cell align="center">Distance (Miles)</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { data.map(row => (
            <Table.Row
              key={ `${row["PNR"]}-${Math.floor(Math.random() * 10000) + 1}` }
            >
              <Table.Cell component="th" scope="row">
                { row["PNR"] }
              </Table.Cell>
              <Table.Cell align="right">{ row["Flight Date"] }</Table.Cell>
              <Table.Cell align="right">{ row["Flight Number"] }</Table.Cell>
              <Table.Cell align="right">{ row["Origin"] }</Table.Cell>
              <Table.Cell center="right">
                { JSON.stringify(row["originLatLng"]) }
              </Table.Cell>
              <Table.Cell align="center">{ row["Destination"] }</Table.Cell>
              <Table.Cell center="right">
                { JSON.stringify(row["destinationLatLng"]) }
              </Table.Cell>
              <Table.Cell align="right">{ row["distance"] }</Table.Cell>
            </Table.Row>
          )) }
        </Table.Body>
      </Table>
    );
  };

  return (
    <>
      <h1>Hey, here's your flight data.</h1>
      { Object.entries(userData).map(key => {
        if (key[0] == "flight_data") {
          return (
            <div key={ `--${uuid()}` }>
              { key[0].toString() } :: { "flight data; lots of it" }
            </div>
          );
        }
        return (
          <div key={ `--${uuid()}` }>
            { key[0].toString() } :: { key[1] ? key[1].toString() : "--" }
          </div>
        );
      }) }

      { flights_uploaded
        ? flights_uploaded && renderData(flightData)
        : flight_Data.length > 0 && renderData(flight_Data) }
    </>
  );
};

export default UserData;
