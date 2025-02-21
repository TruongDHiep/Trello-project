import { Navigate, Route, Routes } from 'react-router-dom'
import Board from './pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/boards/66f42f65f2ee4f9e1f6625bc' replace='true'/>} />
      <Route path='/boards/:boardId' element={<Board />}/>

      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
