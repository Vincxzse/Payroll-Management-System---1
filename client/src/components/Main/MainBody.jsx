
import { useState } from 'react'

import Sidebar from '../Sidebar/Sidebar'
import DashboardPage from './Dashboard/DashboardPage'
import EmployeesPage from './Employees/EmployeesPage'
import PayrollPage from './Payroll/Payroll-Page'

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

export default function MainBody() {
    const user = JSON.parse(localStorage.getItem("user"))
    const [sidebarData, setSidebarData] = useState(true)

    const handleSidebarAction = (data) => {
        setSidebarData(data)
    }

    return(
        <>
            <div className={`grid ${sidebarData ? 'grid-cols-6 xl:grid-cols-6' : 'grid-cols-6 xl:grid-cols-18'} w-screen h-screen bg-white overflow-hidden`}>
                <Sidebar onAction = {handleSidebarAction} />
                <Routes>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage pageLayout={sidebarData} currentUser={user} />} />
                    <Route path="employees" element={<EmployeesPage pageLayout={sidebarData} currentUser={user} />} />
                    <Route path="payroll" element={<PayrollPage pageLayout={sidebarData} currentUser={user} />} />
                </Routes>
            </div>
            {/* <div className='col-span-5 h-full w-full flex flex-col items-start justify-start'> */}
        </>
    )
}