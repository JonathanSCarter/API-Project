export const GET_EVENTS = '/group/GET_EVENTS'
export const GET_GROUPS = '/group/GET_GROUPS'
export const GET_GROUP = '/group/GET_GROUP'
export const GET_MEMBERS = '/group/GET_MEMBERS'

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
  console.log(groupId);
  const req = await fetch(`/api/groups/${groupId}/members`);
  const data = await req.json();
  const members = data;

  dispatch(getMembers(members))
}

const initialState = {
  groups: []
}

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS: {
      return { ...state, groups: action.groups }
    }
    case GET_GROUP: {
      return { ...state, groups: action.group }
    }
    case GET_EVENTS: {
      const { events } = action;
      const groupId = events[0]?.groupId;
      if (groupId) {
        let updatedGroups;
        if (Array.isArray(state.groups)) {
          updatedGroups = state.groups.map(group => {
            if (group.id === groupId) {
              return { ...group, events };
            }
            return group;
          });
        }
        else {
          updatedGroups = { ...state.groups, events }
        }
        return { ...state, groups: updatedGroups };
      }
      return state;
    }
    case GET_MEMBERS: {
      console.log('test');
      return {...state.groups, members: action.members}
    }
    default:
      return state;
  }
}


export default groupsReducer
