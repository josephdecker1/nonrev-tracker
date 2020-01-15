import React from "react";
import { uuid } from "uuidv4";
import { css } from "@emotion/core";
import { Button, Table, Container } from "semantic-ui-react";
import { uploadButton, uploadFormInput, colors } from "../app_css";
import { getDistance, convertDistance, getCenterOfBounds } from "geolib";
import { setLatLgnAirportsForFlights } from '../utils/flight_data'

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

        updatedData = setLatLgnAirportsForFlights(updatedData)

        let flight_center_bound = getCenterOfBounds(updatedData.flights_latlng);
        console.log(updatedData.uniqueAirports);

        updateFlightsUploaded(true);
        updateMapCenterBounds({
          lat: flight_center_bound.latitude,
          lng: flight_center_bound.longitude
        });
        updateFlightData(updatedData.updatedData);
        updateTotalDistanceTravelled(updatedData.milesTravelled);
        updateUniqueAirports(updatedData.uniqueAirports);
        updateZoom(5);
      };
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    userRef.update({ flight_data: flightData });
    userRef.update({ totalDistanceTravelled: totalDistanceTravelled });
    userRef.update({ uniqueAirports: uniqueAirports });

    console.log(flightData);
  };

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
      <h1>Hello, { userData?.user?.split(" ")[0] }, Here's your flight data.</h1>
      { Object.entries(userData).map(key => {
        console.log(key);
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

      <div
        css={ css`
          padding-top: 10px;
          display: inline-block;
        `}
      >
        <form onSubmit={ handleSubmit } id="flightForm">
          <Button
            color="green"
            htmlFor="file"
            id="fileUpload"
            css={ css`
              ${uploadButton}
            `}
          >
            <label htmlFor="file">Upload New Flights</label>
          </Button>
          <input
            type="file"
            onChange={ handleChange }
            css={ css`
              ${uploadFormInput}
            `}
            id="file"
          />
          { flights_uploaded && (
            <Button
              type="submit"
              form="flightForm"
              value="Submit"
              css={ css`
                ${uploadButton} margin-left: 5px;
                padding: 6px 2px 6px 2px;
              `}
            >
              Submit Flights
            </Button>
          ) }
        </form>
      </div>
      { flights_uploaded
        ? flights_uploaded && renderData(flightData)
        : flight_Data.length > 0 && renderData(flight_Data) }
    </>
  );
};

export default UserData;
