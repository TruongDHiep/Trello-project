import { createStore, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk' 
import rootReducer from './reducers/rootReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Cấu hình redux-persist
const persistConfig = {
  key: 'root',      // Khóa chính để lưu trữ
  storage,          // Sử dụng localStorage để lưu state
  whitelist: ['auth']  // Bạn có thể thêm reducer nào cần được lưu trữ
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Middleware
const middleware = [thunk]

// Cấu hình store với persistReducer
const store = createStore(
  persistedReducer,
  compose(applyMiddleware(...middleware))
)

// Tạo persistor để đồng bộ state với localStorage
export const persistor = persistStore(store)

export default store
