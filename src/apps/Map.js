import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { uuid } from "uuidv4";
import coverter from "number-to-words";

import { Icon, Image, Statistic } from "semantic-ui-react";
import { MapAction } from "../components/MapAction";

import { MdAirplanemodeActive } from "react-icons/md";
import { css } from "@emotion/core";
import { mapMarkerStyle, iconStyle, colors } from "../app_css";

import firebaseApp from "../../firebase";

const db = firebaseApp.firestore();

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

  const {
    navWidth,
    uniqueAirports,
    totalDistanceTravelled,
    flightData,
    center,
    zoom,
    setMapLines,
    setMapIcons,
    user
  } = props;

  const maps = window.google.maps;
  const mapRef = React.useRef(null);

  useEffect(() => {
    const map = new maps.Map(document.getElementById("google-map-custom"), {
      center: center,
      zoom: zoom,
      disableDefaultUI: true, // a way to quickly hide all controls
      mapTypeControl: false,
      scaleControl: false,
      zoomControl: true
    });

    setMapLines(flightData, map);
    setMapIcons(flightData, map);
  }, [flightData]);

  useEffect(() => {
    updateLocation({ center: props.center, zoom: props.zoom });
  }, [props.center, props.zoom]);

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
        <div
          center={location.center}
          zoom={location.zoom}
          ref={mapRef}
          css={css`
            width: 100%;
            height: 100%;
          `}
          id="google-map-custom"
        ></div>
      </div>
      <div
        style={ {
          padding: "10px",
          height: "20%",
          width: "100%",
          backgroundColor: colors.yellow
        } }
      >
        <Statistic.Group widths="three">
          <Statistic>
            <Statistic.Value>
              {uniqueAirports ? coverter.toWords(uniqueAirports.length) : null}
            </Statistic.Value>
            <Statistic.Label>Unique Airports</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              {flightData ? flightData.length : null} <Icon name="plane" />
            </Statistic.Value>
            <Statistic.Label>Total Flights</Statistic.Label>
          </Statistic>

          <Statistic>
            <Statistic.Value>
              {totalDistanceTravelled
                ? totalDistanceTravelled.toLocaleString()
                : null}
              <Icon name="flag checkered" />
            </Statistic.Value>
            <Statistic.Label>Miles Travelled</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </div>
    </div>
  );
};

export default Map;
