
import { useState, useEffect } from "react"
import { API_URL } from "../../../config"
import Header from "../../Main/Header"

const attendanceIcon = "/images/performance.png"
const calendarIcon = "/images/dashboard.png"

export default function EmployeeAttendance({ pageLayout, currentUser }) {
    const [attendanceData, setAttendanceData] = useState(null)
    const [attendanceRecords, setAttendanceRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    useEffect(() => {
        fetchAttendance()
        fetchAttendanceRecords()
    }, [selectedMonth, selectedYear])

    const fetchAttendance = async () => {
        try {
            const response = await fetch(`${API_URL}/api/attendance/${currentUser.user_id}`)
            const data = await response.json()
            setAttendanceData(data)
        } catch (error) {
            console.error('Error fetching attendance:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAttendanceRecords = async () => {
        try {
            const response = await fetch(`${API_URL}/api/attendance/records/${currentUser.user_id}?month=${selectedMonth}&year=${selectedYear}`)
            const data = await response.json()
            if (Array.isArray(data)) {
                setAttendanceRecords(data)
            }
        } catch (error) {
            console.error('Error fetching attendance records:', error)
        }
    }

    const getStatusBadge = (status) => {
        const badges = {
            present: 'bg-green-100 text-green-800',
            absent: 'bg-red-100 text-red-800',
            on_leave: 'bg-yellow-100 text-yellow-800'
        }
        return badges[status] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className={`${pageLayout ? 'col-span-5' : 'col-span-17 xl:col-start-2'} col-start-2 flex flex-col w-full min-h-full`}>
            <Header pageLayout={pageLayout} pageTitle="Attendance" pageDescription="Track your attendance records" currentUser={currentUser} />
            
            <div className="flex flex-col items-center justify-start h-9/10 w-full p-5 gap-5 overflow-y-scroll">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                    <div className="flex flex-col items-start justify-between h-32 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                        <p className="text-sm text-[rgba(0,0,0,0.6)]">This Month</p>
                        {loading ? (
                            <p className="text-sm">Loading...</p>
                        ) : (
                            <>
                                <p className="text-3xl font-bold">{attendanceData?.currentMonth?.present_days || 0}</p>
                                <p className="text-sm text-[rgba(0,0,0,0.6)]">
                                    out of {attendanceData?.currentMonth?.total_days || 0} days
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col items-start justify-between h-32 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                        <p className="text-sm text-[rgba(0,0,0,0.6)]">Last Month</p>
                        {loading ? (
                            <p className="text-sm">Loading...</p>
                        ) : (
                            <>
                                <p className="text-3xl font-bold">{attendanceData?.lastMonth?.present_days || 0}</p>
                                <p className="text-sm text-[rgba(0,0,0,0.6)]">
                                    out of {attendanceData?.lastMonth?.total_days || 0} days
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col items-start justify-between h-32 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                        <p className="text-sm text-[rgba(0,0,0,0.6)]">Total Hours (This Month)</p>
                        {loading ? (
                            <p className="text-sm">Loading...</p>
                        ) : (
                            <>
                                <p className="text-3xl font-bold">{parseFloat(attendanceData?.currentMonth?.total_hours || 0).toFixed(1)}</p>
                                <p className="text-sm text-[rgba(0,0,0,0.6)]">hours worked</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Attendance Records */}
                <div className="flex flex-col w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5 gap-4">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-3">
                            <img src={calendarIcon} className="h-6 w-auto" alt="Calendar" />
                            <h2 className="text-lg font-medium">Attendance Records</h2>
                        </div>
                        <div className="flex flex-row gap-2">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-black bg-white"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-black bg-white"
                            >
                                {Array.from({ length: 5 }, (_, i) => (
                                    <option key={i} value={new Date().getFullYear() - i}>
                                        {new Date().getFullYear() - i}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                                    <th className="text-left py-3 px-2 text-sm font-medium">Date</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium">Status</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium">Check In</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium">Check Out</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium">Hours</th>
                                    <th className="text-left py-3 px-2 text-sm font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRecords.length > 0 ? (
                                    attendanceRecords.map((record, index) => (
                                        <tr key={index} className="border-b border-[rgba(0,0,0,0.05)] hover:bg-gray-50">
                                            <td className="py-3 px-2 text-sm">
                                                {new Date(record.date).toLocaleDateString('en-US', { 
                                                    weekday: 'short', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </td>
                                            <td className="py-3 px-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>
                                                    {record.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-sm">{record.check_in_time || '-'}</td>
                                            <td className="py-3 px-2 text-sm">{record.check_out_time || '-'}</td>
                                            <td className="py-3 px-2 text-sm">
                                                {record.total_hours ? parseFloat(record.total_hours).toFixed(1) : '-'}
                                            </td>
                                            <td className="py-3 px-2 text-sm text-[rgba(0,0,0,0.6)]">
                                                {record.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            No attendance records found for this period
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}