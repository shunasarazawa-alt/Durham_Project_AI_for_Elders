import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Result } from './pages/Result'
import { Saved } from './pages/Saved'
import { TaskRunner } from './pages/TaskRunner'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task/:taskId" element={<TaskRunner />} />
        <Route path="/result" element={<Result />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
