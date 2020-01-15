import React from "react";
import Map from "./Map";
import { css } from "@emotion/core";

const MapWrapper = props => {
  const { userRef } = props;
  const [mapCenterBounds, updateMapCenterBounds] = React.useState({
    lat: 32.7766642,
    lng: -96.7969879
  });
  const [zoom, updateZoom] = React.useState(5);
  const [totalDistanceTravelled, updateTotalDistanceTravelled] = React.useState(
    0
  );
  const [uniqueAirports, updateUniqueAirports] = React.useState([]);
  const navWidth = props.navWidth;

  React.useEffect(() => {
    userRef.get().then(doc => {
      if (doc.exists) {
        // console.log("USERDATA => " + JSON.stringify(doc.data().flight_data));
        updateTotalDistanceTravelled(doc.data().totalDistanceTravelled);
        updateUniqueAirports(doc.data().uniqueAirports);
        // return doc.data();
      }
    });
  }, []);

  return (
    <div
      css={ css`
        width: 100%;
        height: 100vh;
        padding: 0px;
      `}
    >
      <Map
        center={ mapCenterBounds }
        zoom={ zoom }
        navWidth={ navWidth }
        uniqueAirports={ uniqueAirports }
        totalDistanceTravelled={ totalDistanceTravelled }
        userRef={ userRef }
      />
    </div>
  );
};

export default MapWrapper;
