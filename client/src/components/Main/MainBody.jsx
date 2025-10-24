
import Sidebar from '../Sidebar/Sidebar'
import DashboardPage from './Dashboard/DashboardPage'
import EmployeesPage from './Employees/EmployeesPage'

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

export default function MainBody() {
    return(
        <>
            <div className='grid grid-cols-6 w-screen h-screen bg-white'>
                <Sidebar />
                <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                </Routes>
            </div>
            {/* <div className='col-span-5 h-full w-full flex flex-col items-start justify-start'> */}
        </>
    )
}