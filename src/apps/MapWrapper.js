import React from "react";
import Map from "./Map";
import { css } from "@emotion/core";

import firebaseApp from "../../firebase";

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
    for (let i = 0; i < data.length; i++) {
      let path = data[i].flightPath
        ? maps.geometry.encoding.decodePath(data[i].flightPath)
        : [
            { lat: data[i].originLatLng.lat, lng: data[i].originLatLng.lng },
            {
              lat: data[i].destinationLatLng.lat,
              lng: data[i].destinationLatLng.lng
            }
          ];

      let line = new maps.Polyline({
        path: path,
        strokeColor: "#000000",
        strokeOpacity: 1.2,
        strokeWeight: 1.0,
        zIndex: 3
      });

      line.setMap(map);
    }
  };

  const setMapIcons = (data, map) => {
    let markers = [];
    let bounds = new maps.LatLngBounds();

    for (let i = 0; i < data.length; i++) {
      var marker = new maps.Marker({
        position: new maps.LatLng(
          data[i].originLatLng.lat,
          data[i].originLatLng.lng
        ),
        map: map,
        icon: {
          anchor: new google.maps.Point(14, 15),
          scaledSize: new google.maps.Size(30, 30),
          url:
            'data:image/svg+xml;utf-8, \
      <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill: darkblue;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 672l0-80L576 384 576 158.4c0-35.366-29.64-62.4-64-62.4-34.358 0-64 27.036-64 62.4L448 384 128 592l0 80 320-96 0 227.204-96 62.398L352 928l160-32 160 32 0-62.398-96-62.398L576 576 896 672z" /></svg>'
        }
      });

      var marker2 = new maps.Marker({
        position: new maps.LatLng(
          data[i].destinationLatLng.lat,
          data[i].destinationLatLng.lng
        ),
        map: map,
        icon: {
          anchor: new google.maps.Point(14, 15),
          scaledSize: new google.maps.Size(30, 30),
          url:
            'data:image/svg+xml;utf-8, \
      <svg class="icon" style="width: 1em; height: 1em;vertical-align: middle;fill:  darkblue;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 672l0-80L576 384 576 158.4c0-35.366-29.64-62.4-64-62.4-34.358 0-64 27.036-64 62.4L448 384 128 592l0 80 320-96 0 227.204-96 62.398L352 928l160-32 160 32 0-62.398-96-62.398L576 576 896 672z" /></svg>'
        }
      });
      bounds.extend(marker.getPosition());
      bounds.extend(marker2.getPosition());
    }

    map.fitBounds(bounds);
  };

  React.useEffect(() => {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          updateFlightData(doc.data().flight_data);
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
        center={mapCenterBounds}
        zoom={zoom}
        navWidth={navWidth}
        uniqueAirports={uniqueAirports}
        totalDistanceTravelled={totalDistanceTravelled}
        flightData={flightData}
        flightLines={flightLines}
        user={user}
        setMapLines={decodeFlightPathsAndAddToMap}
        setMapIcons={setMapIcons}
      />
    </div>
  );
};

export default MapWrapper;
