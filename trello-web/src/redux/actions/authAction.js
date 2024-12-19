import { LOGIN_SUCCESS, LOGIN_FAIL } from './types'
import { loginAPI, registerAPI } from '~/apis'
import { jwtDecode } from 'jwt-decode'

// Action để đăng nhập thành công
export const loginSuccess = (user) => ({
  type: 'LOGIN_SUCCESS',
  payload: user
})

// Action để đăng xuất
export const logout = () => ({
  type: 'LOGOUT'
})


// Async action để thực hiện đăng nhập
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await loginAPI(credentials) // Gọi API từ service
    const decodedToken = jwtDecode(response.token)
    const user = decodedToken.id

    // Dispatch action LOGIN_SUCCESS nếu đăng nhập thành công
    dispatch({ type: LOGIN_SUCCESS, payload: user })

    return { success: true, user } // Trả về object để xử lý tiếp trong component
  } catch (error) {
    // Dispatch action LOGIN_FAIL nếu đăng nhập thất bại
    dispatch({ type: LOGIN_FAIL, payload: error.message || 'Đăng nhập thất bại' })
    return { success: false, message: error.message || 'Đăng nhập thất bại' }
  }
};