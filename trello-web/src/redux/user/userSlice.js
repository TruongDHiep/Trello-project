import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'


// khởi tạo giá trị ban đầu cho state
const initialState = {
  currentUser: null
}

//các hành động gọi api bất đồng bộ và cập nhật dữ liệu vào redux dùng middleware createasyncthunk đi kèm với extrareducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    // interceptor de catch loi tap trung (nang cao)
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully')
    }
    return response.data
  }
)


// khởi tạo một slice trong kho lưu trữ redux
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers là nơi xử lý dữ liệu đồng bộ
  reducers: {},
  // extraReducers: nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload chính là cái response.data
      const user = action.payload

      state.currentUser = user
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
  }
})

// export các reducers để sử dụng
// export const {} = userSlice.actions

// selectors:
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer