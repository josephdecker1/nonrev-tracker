import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { uuid } from "uuidv4";
import coverter from "number-to-words";

import { Icon, Image, Statistic } from "semantic-ui-react";
import { MapAction } from "../components/MapAction";

import { MdAirplanemodeActive } from "react-icons/md";
import { css } from "@emotion/core";
import { mapMarkerStyle, iconStyle, colors } from "../app_css";

const MapIcon = () => (
  <div
    css={ css`
      ${mapMarkerStyle}
    `}
  >
    <MdAirplanemodeActive
      css={ css`
        ${iconStyle}
      `}
    />
  </div>
);

const Map = props => {
  const { userRef } = props;
  const [location, updateLocation] = useState({
    center: {
      lat: 32.7766642,
      lng: -96.7969879
    },
    zoom: 15
  });
  const [flights, updateFlights] = useState([]);
  const [flightPaths, updateFlightPaths] = useState([]);
  const [map, updateMap] = useState(null);
  const [maps, updateMaps] = useState(null);
  const [mapsLoaded, updateMapsLoaded] = useState(false);

  const [flightData, updateFlightData] = React.useState([]);

  const {
    navWidth,
    uniqueAirports,
    totalDistanceTravelled,
  } = props;

  const handleApiLoaded = (map, maps) => {
    updateMap(map);
    updateMaps(maps);
    updateMapsLoaded(true);
  };

  useEffect(() => {
    updateLocation({ center: props.center, zoom: props.zoom });
  }, [props.center, props.zoom]);

  useEffect(() => {
    userRef.get().then(doc => {
      if (doc.exists) {
        // console.log("USERDATA => " + JSON.stringify(doc.data().flight_data));
        updateFlightData(doc.data().flight_data);
        // return doc.data();
      }
    });
    updateFlights([]);
    updateFlights(createMapIcons());
    setMapLines()

    return () => {
      updateFlights([])
      updateFlightPaths([])
    }

  }, [mapsLoaded]);

  const createMapIcons = () => {
    let components = flightData.flatMap(flight => [
      <MapIcon
        key={ `${flight.PNR}-${uuid()}` }
        lat={ flight.destinationLatLng.lat }
        lng={ flight.destinationLatLng.lng }
      />,
      <MapIcon
        key={ `${flight.PNR}-${uuid()}` }
        lat={ flight.originLatLng.lat }
        lng={ flight.originLatLng.lng }
      />
    ]);
    return components;
  };

  const setMapLines = () => {
    if (flightPaths.length > 0) {
      flightPaths.map(flightPath => flightPath.setMap(null));
    }

    let new_flightPaths = flightData.map(flight => {
      let flight_lines = [
        { lat: flight.originLatLng.lat, lng: flight.originLatLng.lng },
        { lat: flight.destinationLatLng.lat, lng: flight.destinationLatLng.lng }
      ];

      return new maps.Polyline({
        path: flight_lines,
        geodesic: true,
        strokeColor: "#000",
        strokeOpacity: 1.0,
        strokeWeight: 1,
        map: map
      });
    });

    updateFlightPaths(new_flightPaths);
  };

  return (
    <div style={ { height: "100%", width: "100%" } }>
      <div
        css={ css`
          position: absolute;
          top: 7px;
          left: calc(${navWidth}px + 7px);
          z-index: 2;
        `}
      >
        <MapAction
          app="userdata"
          action="add_flight"
          actionText="Flight(s)"
          actionIcon="plus"
          color="green"
        />
      </div>
      <div
        style={ {
          height: "80%",
          width: "100%",
          position: "relative",
          zIndex: "1"
        } }
      >
        <GoogleMapReact
          bootstrapURLKeys={ { key: "AIzaSyBbPtzvE19paEy_skkz8ter4sdIP2ZRWQI" } }
          center={ location.center }
          zoom={ location.zoom }
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={ ({ map, maps }) => handleApiLoaded(map, maps) }
        >
          { flights.length > 0 ? flights.map(flight => flight) : null }
        </GoogleMapReact>
      </div>
      <div
        style={ {
          padding: "10px",
          height: "20%",
          width: "100%",
          backgroundColor: colors.yellow
        } }
      >
        <Statistic.Group widths="four">
          <Statistic>
            <Statistic.Value>
              { coverter.toWords(uniqueAirports.length) }
            </Statistic.Value>
            <Statistic.Label>Unique Airports</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              { flightData.length } <Icon name="plane" />
            </Statistic.Value>
            <Statistic.Label>Total Flights</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              { totalDistanceTravelled.toLocaleString() }
              <Icon name="flag checkered" />
            </Statistic.Value>
            <Statistic.Label>Miles Travelled</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              <Image
                src="https://react.semantic-ui.com/images/avatar/small/joe.jpg"
                className="circular inline"
              />
              1
            </Statistic.Value>
            <Statistic.Label>Random Statistic</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </div>
    </div>
  );
};

export default Map;
