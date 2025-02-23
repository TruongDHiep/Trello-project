import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

let authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình interceptors
// can thiệp vào các req
authorizedAxiosInstance.interceptors.request.use((config) => {

  // ky thuat chan spam click
  interceptorLoadingElements(true)

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

let refreshTokenPromise = null

// can thiệp vào các res
authorizedAxiosInstance.interceptors.response.use((response) => {

  // ky thuat chan spam click
  interceptorLoadingElements(false)

  return response
}, (error) => {

  // ky thuat chan spam click
  interceptorLoadingElements(false)

  // th1:
  if (error.response?.status === 401 ) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // th2:
  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    originalRequests._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI().then( data => {
        return data?.accessToken
      }).catch((_error) => {
        axiosReduxStore.dispatch(logoutUserAPI(false))
        return Promise.reject(_error)
      }).finally(() => {
        refreshTokenPromise = null
      })
    }
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      return authorizedAxiosInstance(originalRequests)
    })

  }

  // Do something with response error
  // xử lý tập trung lỗi trả về từ api tại đây
  let errorMessage = error?.message

  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }


  return Promise.reject(error)
})

export default authorizedAxiosInstance