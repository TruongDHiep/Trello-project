import { CREATE_SUCCESS, CREATE_FAIL } from './types'
import { createNewBoardAPI } from '~/apis'

// Action để đăng nhập thành công
export const CreateSuccess = (user) => ({
  type: 'CREATE_SUCCESS',
  payload: user
})


// Async action để thực hiện đăng nhập
export const CreateNewBoard = (CreateData) => async (dispatch) => {
  try {
    const response = await createNewBoardAPI(CreateData) // Gọi API từ service
    const newId = response._id

    // Dispatch action LOGIN_SUCCESS nếu đăng nhập thành công
    dispatch({ type: CREATE_SUCCESS, payload: newId })

    return { success: true, newId } // Trả về object để xử lý tiếp trong component
  } catch (error) {
    // Dispatch action LOGIN_FAIL nếu đăng nhập thất bại
    dispatch({ type: CREATE_FAIL, payload: error.message || 'Tạo thất bại' })
    return { success: false, message: error.message || 'Tạo thất bại' }
  }
}