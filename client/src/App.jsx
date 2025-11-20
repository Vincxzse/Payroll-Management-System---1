
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LoginPage from "./components/Login/LoginPage"
import Sidebar from "./components/Sidebar/Sidebar"
import MainBody from "./components/Main/MainBody"
import EmployeeMainBody from './components/Employee_Side/Employee-MainBody'

function App() {
  return (
    <>
      <Router>
        <div className='flex flex-col w-screen h-screen bg-white'>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin/*" element={<MainBody />} />
            <Route path="/employee/*" element={<EmployeeMainBody />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
