import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import FlightIcon from '@material-ui/icons/Flight';


const greatPlaceStyle = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
}

const iconStyle = {
  fill: 'red'
}
const AnyReactComponent = () => <div style={ greatPlaceStyle }><FlightIcon style={ iconStyle } /></div>;

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  constructor(props) {
    super(props);
    this.state = {
      flightPaths: []
    }
  }

  handleApiLoaded = (map, maps) => {
    this.setState({ map: map, maps: maps })
  }

  renderLines = () => {
    this.state.flightPaths.forEach((flight) => {
      flight.setMap(this.state.map)
    })
  }

  unRenderLines = () => {
    console.log("unrenderlines()")
    let flightPaths = [...this.state.flightPaths];

    flightPaths.map((flight) => {
      flight.setMap(null);
    })

    this.setState({ flightPaths: [] })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    if (nextProps.flightsUploaded === true) {
      // unRender the flight_lines if the data changes
      if (nextProps.flightData.length != this.props.flightData.length && this.props.flightData.length > 0) {
        this.unRenderLines();
      }

      let flightPaths = nextProps.flightData.map((flight) => {

        let flight_lines = [
          { lat: flight.originLatLng.lat, lng: flight.originLatLng.lng },
          { lat: flight.destinationLatLng.lat, lng: flight.destinationLatLng.lng }
        ]

        let flightPath = new this.state.maps.Polyline({
          path: flight_lines,
          geodesic: true,
          strokeColor: '#000',
          strokeOpacity: 1.0,
          strokeWeight: 1
        })

        return flightPath

      })
      this.setState({ flightPaths: flightPaths })
    }
  }

  render() {

    if (this.props.flightsUploaded) {
      this.renderLines();
    }

    return (
      // Important! Always set the container height explicitly
      <div style={ { height: '100%', width: '100%' } }>
        <GoogleMapReact
          bootstrapURLKeys={ { key: "AIzaSyCWt71FcC8lNGEHuvImYyG8fWZQoasHGnA" } }
          center={ this.props.center }
          zoom={ this.props.zoom }
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={ ({ map, maps }) => this.handleApiLoaded(map, maps) }
        >
          { this.props.flightsUploaded ? (
            this.props.flightData.map((flight) => {
              return (
                <AnyReactComponent
                  key={ `${flight["PNR"]}-${Math.floor(Math.random() * 10000) + 1}` }
                  lat={ flight.originLatLng.lat }
                  lng={ flight.originLatLng.lng }
                />)
            }),
            this.props.flightData.map((flight) => {
              return (
                <AnyReactComponent
                  key={ `${flight["PNR"]}-${Math.floor(Math.random() * 10000) + 1}` }
                  lat={ flight.destinationLatLng.lat }
                  lng={ flight.destinationLatLng.lng }
                />)
            })
          ) : null }
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;