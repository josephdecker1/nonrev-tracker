import React from "react";
import Map from "./Map";
// import MapChart from "./mapChart"

import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { getDistance, convertDistance, getCenterOfBounds } from "geolib";
import { css } from "@emotion/core";

import {
  colors,
  mapContainer,
  flightsContainer,
  uploadButton,
  uploadFormInput,
  mainContent,
  flightStats,
  gridStyles,
  flightStatsContent,
  gridStylesPaper
} from "./app_css";

import data from "../airports.json";

/* example data 
{
  "Name": "Goroka Airport",
  "City": "Goroka",
  "Country": "Papua New Guinea",
  "IATA": "GKA",
  "ICAO": "AYGA",
  "LAT": -6.081689835,
  "LNG": 145.3919983,
  "Altitude": 5282,
  "TimeZone": "10",
  "DST": "U",
  "Tz database time zone": "Pacific/Port_Moresby",
  "Type": "airport"
}
*/

let user = "Joseph";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flights_uploaded: false,
      airports: data,
      mapCenterBounds: { lat: 32.7766642, lng: -96.7969879 },
      zoom: 4,
      flightData: []
    };
  }

  noop = () => null;

  componentDidMount() {
    // console.log("I was mounted!");
  }

  handleChange = e => {
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
            lat: this.state.airports[flight["Origin"]].LAT,
            lng: this.state.airports[flight["Origin"]].LNG
          };
          destinationLatLng = {
            lat: this.state.airports[flight["Destination"]].LAT,
            lng: this.state.airports[flight["Destination"]].LNG
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

        this.setState(
          {
            flightData: updatedData,
            flights_uploaded: true,
            mapCenterBounds: {
              lat: flight_center_bound.latitude,
              lng: flight_center_bound.longitude
            },
            totalDistanceTravelled: milesTravelled,
            uniqueAirports: uniqueAirports,
            zoom: 5
          },
          () => {
            console.log(this.state);
          }
        );
      };
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    console.log(this.state.flightData);
  };

  renderData = () => {
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
              {this.state.flightData.map(row => (
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

  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar
            css={css`
              background-color: ${colors.blue};
            `}
          >
            Yo {user}
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="lg"
          css={css`
            ${mainContent}
          `}
        >
          <Container
            maxWidth="lg"
            css={css`
              ${mapContainer}
            `}
          >
            <Map
              center={this.state.mapCenterBounds}
              zoom={this.state.zoom}
              flightsUploaded={this.state.flights_uploaded}
              flightData={this.state.flightData}
            />
          </Container>
          <Container
            maxWidth="lg"
            css={css`
              ${flightStats};
              ${flightStatsContent}
            `}
          >
            <Grid
              container
              spacing={1}
              css={css`
                ${gridStyles}
              `}
            >
              <Grid
                item
                xs
                css={css`
                  ${gridStyles}
                `}
              >
                <Paper
                  css={css`
                    ${gridStylesPaper}
                  `}
                >
                  <Typography variant="h5" gutterBottom>
                    Total Flights:{" "}
                    {this.state.flights_uploaded
                      ? this.state.flightData.length.toLocaleString()
                      : "-"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid
                item
                xs
                css={css`
                  ${gridStyles}
                `}
              >
                <Paper
                  css={css`
                    ${gridStylesPaper}
                  `}
                >
                  <Typography variant="h5" gutterBottom>
                    Total Unique Airports:{" "}
                    {this.state.flights_uploaded
                      ? this.state.uniqueAirports.length.toLocaleString()
                      : "-"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid
                item
                xs
                css={css`
                  ${gridStyles}
                `}
              >
                <Paper
                  css={css`
                    ${gridStylesPaper}
                  `}
                >
                  <Typography variant="h5" gutterBottom>
                    Total Miles Travelled:{" "}
                    {this.state.flights_uploaded
                      ? this.state.totalDistanceTravelled.toLocaleString()
                      : "-"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Container>

        <Container
          maxWidth="lg"
          css={css`
            ${flightsContainer}
          `}
        >
          <div
            css={css`
              padding-top: 10px;
              display: inline-block;
            `}
          >
            <form onSubmit={this.handleSubmit} id="flightForm">
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
                onChange={this.handleChange}
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
          <div>{this.state.flights_uploaded && this.renderData()}</div>
        </Container>
      </div>
    );
  }
}

export default App;
