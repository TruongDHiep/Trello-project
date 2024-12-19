
const initialState = {
  isCreated: false,
  newId: null,
  error: null
}

const boardReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'CREATE_SUCCESS':
    return {
      ...state,
      isCreated: true,
      newId: action.payload,
      error: null
    }
  case 'CREATE_FAIL':
    return {
      ...state,
      isCreated: false,
      newId: null,
      error: action.payload
    }
  default:
    return state
  }
}

export default boardReducer
