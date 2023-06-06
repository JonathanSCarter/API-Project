export const GET_EVENTS = '/event/GET_EVENTS'

const getEvents = events => ({
  type: GET_EVENTS,
  events
})
export const getAllEvents = state => {
  return state?.events ? Object.values(state.events) : []
}

const initialState = {
  events: []
}

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS: {
      return {state: action.events}
    }
    default:
      return state;
  }
}

export const fetchEvents = () => async (dispatch) => {
  const req = await fetch('/api/events');
  const data = await req.json();
  const events = data;
  dispatch(getEvents(events))
}

export default eventsReducer
