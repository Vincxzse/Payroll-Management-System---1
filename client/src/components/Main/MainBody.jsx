
import Sidebar from '../Sidebar/Sidebar'
import DashboardPage from './Dashboard/DashboardPage'
import EmployeesPage from './Employees/EmployeesPage'

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

export default function MainBody() {
    const user = JSON.parse(localStorage.getItem("user"))

    return(
        <>
            <div className='grid grid-cols-6 w-screen h-screen bg-white overflow-hidden'>
                <Sidebar />
                <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage currentUser={user} />} />
                    <Route path="employees" element={<EmployeesPage currentUser={user} />} />
                </Routes>
            </div>
            {/* <div className='col-span-5 h-full w-full flex flex-col items-start justify-start'> */}
        </>
    )
}