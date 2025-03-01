import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiceCard: null
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {

    clearCurrentActiveCard: (state) => {
      state.currentActiceCard = null
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload

      state.currentActiceCard = fullCard
    }
  },
  extraReducers: (builder) => {}
})

export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiceCard
}

export const activeCardReducer = activeCardSlice.reducer