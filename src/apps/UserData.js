import React from "react";
import { css } from "@emotion/core";
import { Button } from "semantic-ui-react";
import { uploadButton, uploadFormInput, colors } from "../app_css";
import { getDistance, convertDistance, getCenterOfBounds } from "geolib";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import airport_data from "../../airports.json";

const UserData = props => {
  const { user, userRef } = props;
  const [userData, updateUserData] = React.useState({});
  const [flight_Data, updateFlight_Data] = React.useState([]);
  const [flightData, updateFlightData] = React.useState([]);
  const [flights_uploaded, updateFlightsUploaded] = React.useState(false);
  const [mapCenterBounds, updateMapCenterBounds] = React.useState({});
  const [totalDistanceTravelled, updateTotalDistanceTravelled] = React.useState(
    null
  );
  const [uniqueAirports, updateUniqueAirports] = React.useState(null);
  const [zoom, updateZoom] = React.useState(null);
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
            height: 500px;
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
            <TableHead
              css={css`
                background-color: ${colors.green};
              `}
            >
              <TableRow>
                <TableCell>Flight PNR</TableCell>
                <TableCell align="center">Flight Date</TableCell>
                <TableCell align="center">Flight Number</TableCell>
                <TableCell align="center">Origin</TableCell>
                <TableCell align="center">Origin Location</TableCell>
                <TableCell align="right">Destination</TableCell>
                <TableCell align="center">Destination Location</TableCell>
                <TableCell align="center">Distance (Miles)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flightData.map(row => (
                <TableRow
                  key={`${row["PNR"]}-${Math.floor(Math.random() * 10000) + 1}`}
                >
                  <TableCell component="th" scope="row">
                    {row["PNR"]}
                  </TableCell>
                  <TableCell align="right">{row["Flight Date"]}</TableCell>
                  <TableCell align="right">{row["Flight Number"]}</TableCell>
                  <TableCell align="right">{row["Origin"]}</TableCell>
                  <TableCell center="right">
                    {JSON.stringify(row["originLatLng"])}
                  </TableCell>
                  <TableCell align="center">{row["Destination"]}</TableCell>
                  <TableCell center="right">
                    {JSON.stringify(row["destinationLatLng"])}
                  </TableCell>
                  <TableCell align="right">{row["distance"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  };

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

      <div
        css={css`
          padding-top: 10px;
          display: inline-block;
        `}
      >
        <form onSubmit={handleSubmit} id="flightForm">
          <Button
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
