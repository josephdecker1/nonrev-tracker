import React from "react";
import Map from "./Map";
import { css } from "@emotion/core";
import ReactDependentScript from "react-dependent-script";

const MapWrapper = props => {
  const { userRef, flightData } = props;
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
        updateTotalDistanceTravelled(doc.data().totalDistanceTravelled);
        updateUniqueAirports(doc.data().uniqueAirports);
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
          flightData={ flightData }
        />
    </div>
  );
};

export default MapWrapper;
