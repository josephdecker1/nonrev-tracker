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

const MapWrapper = props => {
  const { userRef } = props;
  const [mapCenterBounds, updateMapCenterBounds] = React.useState({
    lat: 32.7766642,
    lng: -96.7969879
  });
  const [zoom, updateZoom] = React.useState(5);
  const [flightData, updateFlightData] = React.useState([]);
  const [totalDistanceTravelled, updateTotalDistanceTravelled] = React.useState(
    0
  );
  const [uniqueAirports, updateUniqueAirports] = React.useState([]);
  const navWidth = props.navWidth;

  React.useEffect(() => {
    userRef.get().then(doc => {
      if (doc.exists) {
        console.log("USERDATA => " + JSON.stringify(doc.data().flight_data));
        updateFlightData(doc.data().flight_data);
        updateTotalDistanceTravelled(doc.data().totalDistanceTravelled);
        updateUniqueAirports(doc.data().uniqueAirports);
        // return doc.data();
      }
    });
  }, []);

  return (
    <div
      css={css`
        width: 100%;
        height: 100vh;
        padding: 0px;
      `}
    >
      <Map
        center={mapCenterBounds}
        zoom={zoom}
        flightData={flightData || []}
        navWidth={navWidth}
        flightCount={flightData.length || 0}
        uniqueAirports={uniqueAirports}
        totalDistanceTravelled={totalDistanceTravelled}
      />
    </div>
  );
};

export default MapWrapper;
