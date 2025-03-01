import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

// khởi tạo giá trị ban đầu cho state
const initialState = {
  currentActiveBoard: null
}

//các hành động gọi api bất đồng bộ và cập nhật dữ liệu vào redux dùng middleware createasyncthunk đi kèm với extrareducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    // interceptor de catch loi tap trung (nang cao)
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// khởi tạo một slice trong kho lưu trữ redux
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers là nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const board = action.payload

      // xử lý dữ liệu nếu cần thiết
      // ...

      // cập nhật dữ liệu mới cho state currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      //update nested data
      const incomingCard = action.payload

      // tim tu board den column den card
      const column = state.currentActiveBoard.columns.find(column => column._id === incomingCard.columnId)

      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          // card.title = incomingCard.title
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  // extraReducers: nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload chính là cái response.data
      let board = action.payload

      // thanh vien trong board se la gop lai cua 2 mang ownerIds va memberIds
      board.FE_allUsers = board.owners.concat(board.members)

      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board

    })
  }
})

// export các reducers để sử dụng
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

// selectors:
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer