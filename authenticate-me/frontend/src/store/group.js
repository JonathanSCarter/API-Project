export const GET_GROUPS = '/group/GET_GROUPS'

const getGroups = groups => ({
  type: GET_GROUPS,
  groups
})

export const getAllGroups = state => {
  return state?.groups ? Object.values(state.groups) : []
}

const initialState = {
  groups: []
}

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS: {
      return {state: action.groups}
    }
    default:
      return state;
  }
}

export const fetchGroups = () => async (dispatch) => {
  const req = await fetch('/api/groups');
  const data = await req.json();
  const groups = data;
  dispatch(getGroups(groups))
}

export default groupsReducer
