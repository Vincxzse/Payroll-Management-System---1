
import DashboardPage from './Dashboard/DashboardPage'
import EmployeesPage from './Employees/EmployeesPage'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function MainBody() {
    return(
        <>
            <Router>
                <div className='col-span-5 h-full w-full flex flex-col items-start justify-start'>
                    <Routes>
                        <Route path="/admin/dashboard" element={<DashboardPage />} />
                    </Routes>
                </div>
            </Router>
        </>
    )
}