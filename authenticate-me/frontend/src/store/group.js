import { csrfFetch } from "./csrf"
export const GET_EVENTS_TWO = '/group/GET_EVENTS_TWO'

export const GET_EVENTS = '/group/GET_EVENTS'
export const GET_GROUPS = '/group/GET_GROUPS'
export const GET_GROUP = '/group/GET_GROUP'
export const GET_MEMBERS = '/group/GET_MEMBERS'
export const CREATE_GROUP = '/group/CREATE_GROUP'
// export const EDIT_GROUP = '/group/EDIT_GROUP'

// const editGroup = group => ({
//   type: EDIT_GROUP
// })

const createGroup = group => ({
  type: CREATE_GROUP,
  group
})

const getGroups = groups => ({
  type: GET_GROUPS,
  groups
})

const getEvents = events => ({
  type: GET_EVENTS,
  events
})

const getEventsTwo = events => ({
  type: GET_EVENTS_TWO,
  events
})

const getGroup = group => ({
  type: GET_GROUP,
  group
})

const getMembers = members => ({
  type: GET_MEMBERS,
  members
})

export const fetchGroups = () => async (dispatch) => {
  const req = await fetch('/api/groups');
  const data = await req.json();
  const groups = data;
  dispatch(getGroups(groups.Groups))
}

export const fetchGroup = (groupId) => async (dispatch) => {
  const req = await fetch(`/api/groups/${groupId}`);
  const data = await req.json();
  const group = data;
  dispatch(getGroup(group))
}

export const fetchEventsByGroup = (groupId) => async (dispatch) => {
  const req = await fetch(`/api/groups/${groupId}/events`);
  const data = await req.json();
  const events = data;
  dispatch(getEvents(events.Events))
}

export const fetchEventsByGroupTwo = (groupId) => async (dispatch) => {
  const req = await fetch(`/api/groups/${groupId}/events`);
  const data = await req.json();
  const events = data;
  dispatch(getEventsTwo(events.Events))
}

export const fetchMembersByGroup = (groupId) => async (dispatch) => {
  const req = await fetch(`/api/groups/${groupId}/members`);
  const data = await req.json();
  const members = data;

  dispatch(getMembers(members))
}

export const fetchGroupCreate = (payload) => async (dispatch) => {
  const req = await csrfFetch('/api/groups', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  const data = await req.json();
  const group = data;
  // dispatch(createGroup(group))
  return group.id
}

export const fetchImageCreate = (payload, groupId) => async (dispatch) => {
  await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
}

export const fetchGroupDelete = (groupId) => async (dispatch) => {
  await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE"
  })
}
export const fetchGroupUpdate = (payload, groupId) => async (dispatch) => {
  await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

}
const initialState = {
  allGroups: {

  },
  singleGroup: {

  }
}

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS: {
      return { ...state, allGroups: action.groups }
    }
    case GET_GROUP: {
      return { ...state, singleGroup: action.group }
    }
    case GET_EVENTS: {
      console.log('test');
      const { events } = action;
      const groupId = Array.isArray(events) ? events[0]?.groupId : undefined;
      if (groupId) {
        console.log('this had a groupId');
        return { ...state, singleGroup: {...state.singleGroup, events} };
      }
      return state;
    }
    case GET_EVENTS_TWO: {
      const { events } = action;
      const groupId = Array.isArray(events) ? events[0]?.groupId : undefined;
      if (groupId) {
        const updatedGroups = state.allGroups.map((group) => {
          if (group.id === groupId) {
            return { ...group, events };
          }
          return group;
        });
        return { ...state, allGroups: updatedGroups };
      }
      return state;
    }
    case GET_MEMBERS: {
      const  { members } = action
      console.log({...state.singleGroup});
      return { ...state, singleGroup: { ...state.singleGroup, members } }
    }
    case CREATE_GROUP: {
      return { ...state }
    }
    default:
      return state;
  }
}


export default groupsReducer
