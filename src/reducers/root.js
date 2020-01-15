const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_FLIGHT_TO_PROFILE':
      console.log("adding flight to profile")
      return { ...state, flight_data: [...state.flight_data, { ...action.flight }] };
    default:
      console.log("action action default action ", JSON.stringify(state))
  }

  return state
}

export default reducer