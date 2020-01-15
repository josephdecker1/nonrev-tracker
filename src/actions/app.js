
/*
 * Action Types
*/
export const ADD_FLIGHTS_TO_PROFILE = "ADD_FLIGHTS_TO_PROFILE";
export const ADD_FLIGHT_TO_PROFILE = "ADD_FLIGHT_TO_PROFILE";

export const RETRIEVE_FLIGHTS = "RETRIEVE_FLIGHTS";

/* 
 * Action Creators
*/
export const addFlightToProfile = (flight) => {
  return {
    type: ADD_FLIGHT_TO_PROFILE,
    flight
  }
}

export const addFlightsToProfile = (flights) => {
  return {
    type: ADD_FLIGHTS_TO_PROFILE,
    flights
  }
}

export const retrieveFlights = () => {
  return {
    type: RETRIEVE_FLIGHTS,
  }
}