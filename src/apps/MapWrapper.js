import React from "react";
import Map from "./Map";
import { css } from "@emotion/core";

import firebaseApp from "../../firebase";
import image from '../../plane.png'

const db = firebaseApp.firestore();
const maps = window.google.maps;

const MapWrapper = props => {
  const { user } = props;
  const [mapCenterBounds, updateMapCenterBounds] = React.useState({
    lat: 32.7766642,
    lng: -96.7969879
  });
  const [zoom, updateZoom] = React.useState(5);
  const [totalDistanceTravelled, updateTotalDistanceTravelled] = React.useState(
    0
  );
  const [uniqueAirports, updateUniqueAirports] = React.useState([]);
  const [flightLines, updateFlightLines] = React.useState([]);
  const [flightData, updateFlightData] = React.useState([]);
  const navWidth = props.navWidth;

  const decodeFlightPathsAndAddToMap = (data, map) => {
    for(let i = 0; i < data.length; i++) {
      let line = new maps.Polyline({
        path: maps.geometry.encoding.decodePath(data[i].flightPath),
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 2.2,
        zIndex: 3
      })

      line.setMap(map)
    }
  }

  const setMapIcons = (data, map) => {
    for (let i = 0; i < data.length; i++) {
      var marker = new maps.Marker({
        position: new maps.LatLng(data[i].originLatLng.lat, data[i].originLatLng.lng),
        map: map,
        icon: image
      })

      var marker2 = new maps.Marker({
        position: new maps.LatLng(data[i].destinationLatLng.lat, data[i].destinationLatLng.lng),
        map: map,
        icon: image
      })
    }
  }

  React.useEffect(() => {
    db.collection("users").doc(user.uid).get().then(doc => {
      if (doc.exists) {
        console.log(doc.data().flight_data)
        updateFlightData(doc.data().flight_data)
        updateTotalDistanceTravelled(doc.data().totalDistanceTravelled);
        updateUniqueAirports(doc.data().uniqueAirports);
        updateFlightLines(flightLines.concat(doc.data().flight_lines));
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
          flightData={ flightData }
          flightLines={flightLines}
          user={user}
          setMapLines={ decodeFlightPathsAndAddToMap }
          setMapIcons={ setMapIcons}
        />
    </div>
  );
};

export default MapWrapper;
