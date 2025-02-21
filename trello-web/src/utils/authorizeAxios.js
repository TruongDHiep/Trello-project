import axios from 'axios'

let authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000*60*10

authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình interceptors
// can thiệp vào các req
authorizedAxiosInstance.interceptors.request.use( (config) => {
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// can thiệp vào các res
authorizedAxiosInstance.interceptors.response.use( (response) => {
  return response
}, function (error) {
  // Do something with response error
  // xử lý tập trung lỗi trả về từ api tại đây
  return Promise.reject(error)
})

export default authorizedAxiosInstance