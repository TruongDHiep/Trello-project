import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

//boards
export const fetchBoardDetailsAPI = async (boardId) => {
  // interceptor de catch loi tap trung (nang cao)
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  // interceptor de catch loi tap trung (nang cao)
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  // interceptor de catch loi tap trung (nang cao)
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

export const createNewBoardAPI = async (newBoardData) => {
  const response = await axios.post(`${API_ROOT}/v1/boards`, newBoardData)
  return response.data
}

export const fetchUserBoardsAPI = async (id) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/user/${id}`)
  return response.data
}


//columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  // interceptor de catch loi tap trung (nang cao)
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  // interceptor de catch loi tap trung (nang cao)
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}


//cards
export const createNewCardAPI = async (newCardData) => {
  // interceptor de catch loi tap trung (nang cao)
  const response = await axios.post(`${API_ROOT}/v1/cards/`, newCardData)
  return response.data
}


//authentication

export const loginAPI = async (loginData) => {
  const response = await axios.post(`${API_ROOT}/v1/login`, loginData)
  return response.data
}

export const registerAPI = async (registerData) => {
  const response = await axios.post(`${API_ROOT}/v1/register`, registerData)
  return response.data
}

