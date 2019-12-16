import React from "react";
import Map from "./Map";
import { css } from "@emotion/core";

import { colors } from "../app_css";

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
      mapCenterBounds: { lat: 32.7766642, lng: -96.7969879 },
      zoom: 4,
      flightData: [],
      navWidth: props.navWidth
    };
  }

  noop = () => null;

  componentDidMount() {
    // console.log("I was mounted!");
  }

  render() {
    return (
      <div
        css={css`
          width: 100%;
          height: 100vh;
          padding: 0px;
        `}
      >
        <Map
          center={this.state.mapCenterBounds}
          zoom={this.state.zoom}
          flightsUploaded={this.state.flights_uploaded}
          flightData={this.state.flightData}
          navWidth={this.state.navWidth}
        />
      </div>
    );
  }
}

export default App;
