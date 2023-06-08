import { csrfFetch } from "./csrf"

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
  dispatch(createGroup(group))
  return group.id
}

export const fetchGroupUpdate = (payload, groupId) => async (dispatch) => {
  await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  // const data = await req.json();
  // const group = data;
  // dispatch(editGroup(group))
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
      const { events } = action;
      const groupId = events[0]?.groupId;
      if (groupId) {
        let updatedGroups;
        if (Array.isArray(state.groups?.allGroups)) {
          updatedGroups = state.groups.map(group => {
            if (group.id === groupId) {
              return { ...group, events };
            }
            return group;
          });
        }
        else {
          updatedGroups = {...state.singleGroup, events}
          }
        return { ...state, singleGroup: {...updatedGroups } };
      }
      return state;
    }
    case GET_MEMBERS: {
      const payload = action.members
      return { ...state, singleGroup: { ...state.singleGroup, payload } }
    }
    case CREATE_GROUP: {
      return { ...state }
    }
    default:
      return state;
  }
}


export default groupsReducer
