export const GET_EVENT = '/event/GET_EVENT'
export const GET_EVENTS = '/group/GET_EVENTS'

const getEvent = event => ({
  type: GET_EVENT,
  event
})

const getEvents = events => ({
  type: GET_EVENTS,
  events
})

export const fetchEvent = (eventId) => async (dispatch) => {
  const req = await fetch(`/api/events/${eventId}`);
  const data = await req.json();
  const event = data;
  dispatch(getEvent(event))
}

export const fetchEventsByGroup = (groupId) => async (dispatch) => {
  const req = await fetch(`/api/groups/${groupId}/events`);
  const data = await req.json();
  const events = data;
  dispatch(getEvents(events.Events))
}

const initialState = {
  allEvents: {},
  singleEvent: {}
}

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENT: {

      return {...state, singleEvent: action.event}
    }
  //   case GET_EVENTS: {
  //     const { events } = action;
  //     const groupId = events[0]?.groupId;
  //     if (groupId) {
  //       let updatedGroups;
  //       if (Array.isArray(state.groups)) {
  //         updatedGroups = state.groups.map(group => {
  //           if (group.id === groupId) {
  //             return { ...group, events };
  //           }
  //           return group;
  //         });
  //       }
  //       else {
  //         updatedGroups = { ...state.groups, events }
  //       }
  //       return { ...state, groups: updatedGroups };
  //     }
  //     return state;
  //   }
    default:
      return state;
  }
}


export default eventsReducer
