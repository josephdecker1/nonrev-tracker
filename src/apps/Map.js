import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { uuid } from "uuidv4";
import coverter from "number-to-words";
// import FlightIcon from "@material-ui/icons/Flight";
import { Icon, Image, Statistic, Button } from "semantic-ui-react";
import { MapAction } from "../components/MapAction";

// import data from "../airports.json";

import { MdAirplanemodeActive } from "react-icons/md";
import { css } from "@emotion/core";
import { mapMarkerStyle, iconStyle, colors } from "../app_css";

// make sure to use Statistic from semantic-ui-react

const MapIcon = () => (
  <div
    css={css`
      ${mapMarkerStyle}
    `}
  >
    <MdAirplanemodeActive
      css={css`
        ${iconStyle}
      `}
    />
  </div>
);

const Map = props => {
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
  const [flightStats, updateFlightStats] = useState({});
  const {
    navWidth,
    uniqueAirports,
    totalDistanceTravelled,
    flightCount
  } = props;

  const handleApiLoaded = (map, maps) => {
    updateMap(map);
    updateMaps(maps);
  };

  useEffect(() => {
    updateLocation({ center: props.center, zoom: props.zoom });
  }, [props.center, props.zoom]);

  useEffect(() => {
    updateFlights([]);
    updateFlights(createMapIcons());
    setMapLines();
  }, [props.flightData]);

  const createMapIcons = () => {
    let components = props.flightData.flatMap(flight => [
      <MapIcon
        key={`${flight.PNR}-${uuid()}`}
        lat={flight.destinationLatLng.lat}
        lng={flight.destinationLatLng.lng}
      />,
      <MapIcon
        key={`${flight.PNR}-${uuid()}`}
        lat={flight.originLatLng.lat}
        lng={flight.originLatLng.lng}
      />
    ]);
    return components;
  };

  const setMapLines = () => {
    if (flightPaths.length > 0) {
      flightPaths.map(flightPath => flightPath.setMap(null));
    }

    let new_flightPaths = props.flightData.map((flight, index) => {
      setTimeout(() => {
        // console.log("Animating flight! " + flight);
        animateFlight(flight);
      }, index * 500);
    });

    updateFlightPaths(new_flightPaths);
  };

  const animateFlight = flight => {
    let flight_lines = [
      { lat: flight.originLatLng.lat, lng: flight.originLatLng.lng },
      { lat: flight.destinationLatLng.lat, lng: flight.destinationLatLng.lng }
    ];

    let flightPath = new maps.Polyline({
      path: flight_lines,
      icons: [
        {
          icon: {
            path:
              "m32,1.9l0.3,0.1l0.8,1.2l0.9,3.1l0.6,3.1l0.5,5.2l0,9.1l2.9,2.4l-0.1,-1l0,-1.5l0.1,-1.2l0.2,-0.4l2.7,0l0.2,0.4l0.1,1.2l0,1.5l-0.3,2.3l-0.4,0l-0.1,0.3l1.8,1l15.9,8.3l0.9,0.8l0.5,1.2l0,1.9l-0.4,-0.9l-0.7,-0.9l-11.4,-3.6l-0.1,0.8l-0.3,0.7l-0.3,-0.7l-0.1,-1l-4.2,-1l-0.1,0.8l-0.3,0.7l-0.3,-0.7l-0.1,-1l-1.2,-0.2l-0.6,0l-0.1,0.9l-0.3,0.7l-0.3,-0.7l-0.1,-0.9l-3.5,0l0,11.6l-0.1,2.7l-0.3,2.5l-0.7,2.4l9.1,7l0,2l-10.7,-3.2l-0.3,1l-0.2,0l-0.3,-1l-10.7,3.2l0,-2l9.2,-7l-0.7,-2.4l-0.4,-2.5l-0.1,-2.7l0,-11.6l-3.5,0l-0.1,0.9l-0.3,0.7l-0.3,-0.7l-0.1,-0.9l-0.6,0l-1.2,0.2l-0.1,1l-0.3,0.7l-0.3,-0.7l-0.1,-0.8l-4.2,1l-0.1,1l-0.3,0.7l-0.3,-0.7l-0.1,-0.8l-11.4,3.6l-0.7,0.9l-0.4,0.9l0,-1.9l0.5,-1.2l0.9,-0.8l15.9,-8.3l1.8,-1l-0.1,-0.3l-0.5,0l-0.2,-2.3l0,-1.5l0.1,-1.2l0.2,-0.4l2.7,0l0.2,0.4l0.1,1.2l0,1.5l-0.1,1l2.9,-2.4l0,-9.1l0.5,-5.2l0.6,-3.1l1,-3.1l0.7,-1.2l0.3,-0.1z",
            anchor: new maps.Point(27, 10),
            fillColor: colors.deepSilver,
            fillOpacity: 0.8,
            strokeColor: colors.deepSilver,
            scale: 0.5
          },
          offset: "0%"
        }
      ],
      geodesic: true,
      strokeColor: "#000",
      strokeOpacity: 1.0,
      strokeWeight: 1,
      map: map
    });

    var step = 0;
    var numSteps = 100; //Change this to set animation resolution
    var timePerStep = 5; //Change this to alter animation speed
    var interval = setInterval(function() {
      step += 1;
      if (step > numSteps) {
        clearInterval(interval);
        flightPath.set("icons", null);
      } else {
        var are_we_there_yet = maps.geometry.spherical.interpolate(
          new maps.LatLng(flight_lines[0]),
          new maps.LatLng(flight_lines[1]),
          step / numSteps
        );
        var plane = flightPath.get("icons");
        plane[0].offset = are_we_there_yet + "%";
        flightPath.set("icons", plane);
        flightPath.setPath([flight_lines[0], are_we_there_yet]);
      }
    }, timePerStep);

    return flightPath;
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div
        css={css`
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
        style={{
          height: "80%",
          width: "100%",
          position: "relative",
          zIndex: "1"
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBbPtzvE19paEy_skkz8ter4sdIP2ZRWQI" }}
          center={location.center}
          zoom={location.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        >
          {flights.length > 0 ? flights.map(flight => flight) : null}
        </GoogleMapReact>
      </div>
      <div
        style={{
          padding: "10px",
          height: "20%",
          width: "100%",
          backgroundColor: colors.yellow
        }}
      >
        <Statistic.Group widths="four">
          <Statistic>
            <Statistic.Value>
              {coverter.toWords(uniqueAirports.length)}
            </Statistic.Value>
            <Statistic.Label>Unique Airports</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              {flightCount} <Icon name="plane" />
            </Statistic.Value>
            <Statistic.Label>Total Flights</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              {totalDistanceTravelled.toLocaleString()}
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
