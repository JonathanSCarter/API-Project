import { csrfFetch } from "./csrf"

export const GET_EVENT = '/event/GET_EVENT'
export const GET_EVENTS = '/group/GET_EVENTS'
export const GET_EVENT_SINGLE = '/groups/GET_EVENT_SINGLE'

const getEventSingle = event => ({
  type: GET_EVENT_SINGLE,
  event
})

const getEvent = event => ({
  type: GET_EVENT,
  event
})

const getEvents = events => ({
  type: GET_EVENTS,
  events
})

export const fetchEvents = () => async (dispatch) => {
  const req = await fetch(`/api/events`);
  const data = await req.json();
  const event = data;
  dispatch(getEvents(event.Events))
}

export const fetchEvent = (eventId) => async (dispatch) => {
  const req = await fetch(`/api/events/${eventId}`);
  const data = await req.json();
  const event = data;
  dispatch(getEvent(event))
}

export const fetchEventSingle = (eventId) => async (dispatch) => {
  const req = await fetch(`/api/events/${eventId}`);
  const data = await req.json();
  const event = data;
  dispatch(getEventSingle(event))
}

export const fetchEventsByGroup = (groupId) => async (dispatch) => {
  const req = await fetch(`/api/groups/${groupId}/events`);
  const data = await req.json();
  const events = data;
  dispatch(getEvents(events.Events))
}

export const fetchEventCreate = (payload, groupId) => async (dispatch) => {
  const req = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  const data = await req.json();
  const event = data;
  return event.id
}

export const fetchEventImageCreate = (payload, eventId) => async (dispatch) => {
  await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
}

export const fetchEventDelete = (eventId) => async (dispatch) => {
  console.log(eventId);
  const req = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE"
  })
  console.log(req);
}

const initialState = {
  allEvents: [],
  singleEvent: {}
}

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENT: {
      const { event } = action;
      const updatedEvents = state.allEvents.map((existingEvent) => {
        if (existingEvent.id === event.id) {
          return { ...existingEvent, ...event };
        }
        return existingEvent;
      });
      return { ...state, allEvents: updatedEvents };
    }
    case GET_EVENTS: {
      return {...state, allEvents: action.events};
    }
    case GET_EVENT_SINGLE: {
      return{...state, singleEvent: action.event};
    }
    default:
      return state;
  }
}


export default eventsReducer
