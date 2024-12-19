// App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home/_id'
import Board from './pages/Boards/_id'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Auth isLogin={true} />} />
          <Route path="/register" element={<Auth isLogin={false} />} />
          <Route path="/" element={<Navigate to="/login" />} /> {/* Chuyển hướng từ / đến /login */}
          <Route path="/user/:id" element={<Home />} />
          <Route path="/board/:boardId" element={<Board />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
