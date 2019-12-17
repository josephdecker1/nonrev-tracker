import React from "react";
import { uuid } from "uuidv4";
import { css } from "@emotion/core";
import { Button, Table } from "semantic-ui-react";
import { uploadButton, uploadFormInput, colors } from "../app_css";
import { getDistance, convertDistance, getCenterOfBounds } from "geolib";

import Paper from "@material-ui/core/Paper";

import airport_data from "../../airports.json";

const UserData = props => {
  const { user, userRef } = props;
  const [userData, updateUserData] = React.useState({});
  const [flight_Data, updateFlight_Data] = React.useState([]);
  const [flightData, updateFlightData] = React.useState([]);
  const [flights_uploaded, updateFlightsUploaded] = React.useState(false);
  const [mapCenterBounds, updateMapCenterBounds] = React.useState({});
  const [totalDistanceTravelled, updateTotalDistanceTravelled] = React.useState(
    0
  );
  const [uniqueAirports, updateUniqueAirports] = React.useState([]);
  const [zoom, updateZoom] = React.useState(4);
  const [airports, updateAirports] = React.useState(airport_data);

  React.useEffect(() => {
    userRef.get().then(doc => {
      if (doc.exists) {
        console.log("USERDATA => " + JSON.stringify(doc.data()));
        updateUserData(doc.data());
        updateFlight_Data(doc.data().flight_data);
        // return doc.data();
      }
    });
  }, [user]);

  React.useEffect(() => {
    flightData.length > 0
      ? userRef.update({ flight_data: flightData })
      : console.log("no flight data yet!");
  }, [flightData]);

  React.useEffect(() => {
    console.log("TOTALDISTANCETRAVELED " + totalDistanceTravelled);
    totalDistanceTravelled > 0
      ? userRef.update({ totalDistanceTravelled: totalDistanceTravelled })
      : console.log("no totalDistanceTravelled data yet!");
  }, [totalDistanceTravelled]);

  React.useEffect(() => {
    uniqueAirports.length > 0
      ? userRef.update({ uniqueAirports: uniqueAirports })
      : console.log("no uniqueAirports data yet!");
  }, [uniqueAirports]);

  const handleChange = e => {
    console.log(e.target.files[0]);

    let jsonFile = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(jsonFile);

    if (jsonFile) {
      reader.onloadend = e => {
        let updatedData = JSON.parse(reader.result);
        let originLatLng;
        let destinationLatLng;
        let distance;
        let flights_latlng = [];
        let milesTravelled = 0;
        let uniqueAirports = [];

        updatedData = updatedData.map(flight => {
          originLatLng = {
            lat: airports[flight["Origin"]].LAT,
            lng: airports[flight["Origin"]].LNG
          };
          destinationLatLng = {
            lat: airports[flight["Destination"]].LAT,
            lng: airports[flight["Destination"]].LNG
          };
          distance = Math.floor(
            convertDistance(
              getDistance(originLatLng, destinationLatLng, 1),
              "mi"
            )
          );

          flights_latlng.push(originLatLng);
          flights_latlng.push(destinationLatLng);
          milesTravelled += distance;
          if (uniqueAirports.indexOf(flight["Origin"]) < 0) {
            uniqueAirports.push(flight["Origin"]);
          }
          if (uniqueAirports.indexOf(flight["Destination"]) < 0) {
            uniqueAirports.push(flight["Destination"]);
          }

          return { ...flight, originLatLng, destinationLatLng, distance };
        });

        let flight_center_bound = getCenterOfBounds(flights_latlng);
        console.log(uniqueAirports);

        updateFlightsUploaded(true);
        updateMapCenterBounds({
          lat: flight_center_bound.latitude,
          lng: flight_center_bound.longitude
        });
        updateFlightData(updatedData);
        updateTotalDistanceTravelled(milesTravelled);
        updateUniqueAirports(uniqueAirports);
        updateZoom(5);
      };
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    console.log(flightData);
  };

  const renderData = () => {
    return (
      <div
        css={css`
          width: 100%;
        `}
      >
        <Paper
          css={css`
            margin-top: 10px;
            width: 100%;
            overflow-x: auto;
            margin-bottom: 5px;
            overflow-y: auto;
          `}
        >
          <Table
            aria-label="flight table"
            size="small"
            css={css`
              minwidth: 650;
            `}
          >
            <Table.Header
              css={css`
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
              {flightData.map(row => (
                <Table.Row
                  key={`${row["PNR"]}-${Math.floor(Math.random() * 10000) + 1}`}
                >
                  <Table.Cell component="th" scope="row">
                    {row["PNR"]}
                  </Table.Cell>
                  <Table.Cell align="right">{row["Flight Date"]}</Table.Cell>
                  <Table.Cell align="right">{row["Flight Number"]}</Table.Cell>
                  <Table.Cell align="right">{row["Origin"]}</Table.Cell>
                  <Table.Cell center="right">
                    {JSON.stringify(row["originLatLng"])}
                  </Table.Cell>
                  <Table.Cell align="center">{row["Destination"]}</Table.Cell>
                  <Table.Cell center="right">
                    {JSON.stringify(row["destinationLatLng"])}
                  </Table.Cell>
                  <Table.Cell align="right">{row["distance"]}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Paper>
      </div>
    );
  };

  return (
    <>
      <h1>Hello, {userData?.user?.split(" ")[0]}, Here's your flight data.</h1>
      {Object.entries(userData).map(key => {
        console.log(key);
        if (key[0] == "flight_data") {
          return (
            <div key={`--${uuid()}`}>
              {key[0].toString()} :: {"flight data; lots of it"}
            </div>
          );
        }
        return (
          <div key={`--${uuid()}`}>
            {key[0].toString()} :: {key[1] ? key[1].toString() : "--"}
          </div>
        );
      })}

      <div
        css={css`
          padding-top: 10px;
          display: inline-block;
        `}
      >
        <form onSubmit={handleSubmit} id="flightForm">
          <Button
            color="green"
            htmlFor="file"
            id="fileUpload"
            css={css`
              ${uploadButton}
            `}
          >
            <label htmlFor="file">Upload Flights</label>
          </Button>
          <input
            type="file"
            onChange={handleChange}
            css={css`
              ${uploadFormInput}
            `}
            id="file"
          />
          <Button
            type="submit"
            form="flightForm"
            value="Submit"
            css={css`
              ${uploadButton} margin-left: 5px;
              padding: 6px 2px 6px 2px;
            `}
          >
            Submit Flights
          </Button>
        </form>
      </div>
      <div>{flights_uploaded && renderData()}</div>
    </>
  );
};

export default UserData;
