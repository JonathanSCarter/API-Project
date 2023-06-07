export const GET_EVENT = '/event/GET_EVENT'

const getEvents = event => ({
  type: GET_EVENT,
  event
})

export const fetchEvent = (eventId) => async (dispatch) => {
  const req = await fetch(`/api/events/${eventId}`);
  const data = await req.json();
  const event = data;
  dispatch(getEvents(event))
}

const initialState = {
  events: []
}

const eventsReducer = (state = initialState, action) => {
  console.log('please god');
  console.log(action, 'please');
  switch (action.type) {
    case GET_EVENT: {

      return {...state, events: [...state.events, action.event]}
    }
    default:
      return state;
  }
}


export default eventsReducer
