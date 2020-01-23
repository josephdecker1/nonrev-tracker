import React from 'react';
import { css } from "@emotion/core";

import { getDistance, convertDistance, getCenterOfBounds } from "geolib";
import { Table } from "semantic-ui-react";
import { colors } from "../app_css";
import airports from "../../airports.json";

export const setLatLgnAirportsForFlights = (flight_data) => {

  let updatedData = flight_data;
  let originLatLng;
  let destinationLatLng;
  let distance;
  let flights_latlng = [];
  let milesTravelled = 0;
  let uniqueAirports = [];

  updatedData = updatedData.map(flight => {
    console.log(flight);

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

  return { updatedData, uniqueAirports, milesTravelled, flights_latlng }
}

export const renderFlightData = data => {
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

export const createMapLines = (flightData, maps, endcodePath) => {
  const flightDataWithEncodedPaths = flightData.map(flight => {
    let flight_lines = [
      { lat: flight.originLatLng.lat, lng: flight.originLatLng.lng },
      { lat: flight.destinationLatLng.lat, lng: flight.destinationLatLng.lng }
    ];

    let f = new maps.Polyline({
      path: flight_lines,
      geodesic: true,
      strokeColor: "#000",
      strokeOpacity: 1.0,
      strokeWeight: 1,
    });

    return Object.assign({}, flight, {flightPath: endcodePath(f.getPath())})

  });

  return flightDataWithEncodedPaths;
}
