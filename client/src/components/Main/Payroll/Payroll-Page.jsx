
import { useState, useEffect } from "react"
import { API_URL } from "../../../config"
import Header from "../Header"
import PEItem from "./Payroll-Components/PE-Item"

const downloadIcon = "/images/download.png"
const payrollIcon = "/images/payroll.png"

export default function PayrollPage({ pageLayout, currentUser }) {
    const [periods, setPeriods] = useState([])
    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const [payrollData, setPayrollData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchPeriods()
    }, [])

    useEffect(() => {
        if (selectedPeriod) {
            fetchPayrollData(selectedPeriod)
        }
    }, [selectedPeriod])

    const fetchPeriods = async () => {
        try {
            const response = await fetch(`${API_URL}/api/payroll/periods`)
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to fetch periods')
            }
            
            const data = await response.json()
            
            // Ensure data is an array
            if (Array.isArray(data)) {
                setPeriods(data)
                if (data.length > 0) {
                    setSelectedPeriod(data[0].period_id)
                }
            } else {
                console.error('Periods data is not an array:', data)
                setPeriods([])
                setError('Invalid data format received')
            }
        } catch (error) {
            console.error('Error fetching periods:', error)
            setError(error.message)
            setPeriods([])
        } finally {
            setLoading(false)
        }
    }

    const fetchPayrollData = async (periodId) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_URL}/api/payroll/${periodId}`)
            
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to fetch payroll data')
            }
            
            const data = await response.json()
            setPayrollData(data)
        } catch (error) {
            console.error('Error fetching payroll data:', error)
            setError(error.message)
            setPayrollData(null)
        } finally {
            setLoading(false)
        }
    }

    const handleExport = () => {
        if (!payrollData || !payrollData.employees) {
            alert('No data to export')
            return
        }
        
        // CSV export logic
        const headers = ['Employee Name', 'Employee ID', 'Basic Salary', 'Hours Worked', 'Deductions', 'Overtime', 'Net Pay']
        const rows = payrollData.employees.map(emp => [
            `${emp.first_name} ${emp.last_name}`,
            emp.employee_id,
            emp.basic_salary,
            emp.hours_worked,
            emp.deductions,
            emp.overtime_amount,
            emp.net_pay
        ])
        
        let csvContent = headers.join(',') + '\n'
        rows.forEach(row => {
            csvContent += row.join(',') + '\n'
        })
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `payroll-${selectedPeriod}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className={`${pageLayout ? 'col-span-5' : 'col-span-17 xl:col-start-2'} col-start-2 flex flex-col w-full min-h-full`}>
            <Header pageLayout={pageLayout} pageTitle="Payroll" pageDescription="Process payments and manage compensation" currentUser={currentUser} />
            <div className="flex flex-col items-center justify-start h-9/10 w-full p-5 gap-5 overflow-y-scroll">
                <div className="flex flex-row items-center justify-between w-full h-auto">
                    <div className="flex flex-col items-start justify-start w-full h-auto">
                        <h2 className="text-md font-medium">Payroll Module</h2>
                        <p className="font-sans text-sm text-[rgba(0,0,0,0.6)]">Manage payroll processing and calculations</p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={!payrollData}
                        className="flex flex-row items-center justify-center bg-white w-auto h-10 rounded-lg shadow-[rgba(0,0,0,0.2)] shadow-md gap-1 text-sm font-medium cursor-pointer hover:invert transition duration-200 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <img src={downloadIcon} alt="export icon" className="h-5" />
                        Export
                    </button>
                </div>

                {error && (
                    <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        Error: {error}
                    </div>
                )}

                <div className="relative flex flex-col w-full min-h-[400px] bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5 gap-2">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center lg:justify-between w-full h-auto gap-2">
                        <div className="flex flex-row items-center justify-start w-auto h-auto gap-2">
                            <img src={payrollIcon} alt="payroll icon" className="h-5 w-auto" />
                            <h2>Payroll Processing</h2>
                        </div>
                        <div className="flex flex-row items-center justify-center w-auto h-auto gap-2">
                            <p>Period:</p>
                            <select
                                value={selectedPeriod || ''}
                                onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                                disabled={periods.length === 0}
                                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-black bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {periods.length === 0 ? (
                                    <option value="">No periods available</option>
                                ) : (
                                    periods.map(period => (
                                        <option key={period.period_id} value={period.period_id}>
                                            {period.period_name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <div className="flex flex-col min-w-[1000px]">
                            <div className="grid grid-cols-7 gap-4 w-full items-center justify-center h-10 px-2">
                                <p className="col-span-1 font-medium text-sm">Employee Name</p>
                                <p className="col-span-1 font-medium text-sm">Basic Salary</p>
                                <p className="col-span-1 font-medium text-sm">Hours Worked</p>
                                <p className="col-span-1 font-medium text-sm">Deductions</p>
                                <p className="col-span-1 font-medium text-sm">Overtime</p>
                                <p className="col-span-1 font-medium text-sm">Net Pay</p>
                                <p className="col-span-1 font-medium text-sm text-center">Generate Payslip</p>
                            </div>
                            {loading ? (
                                <div className="text-center py-8 text-gray-500">Loading payroll data...</div>
                            ) : payrollData?.employees && payrollData.employees.length > 0 ? (
                                payrollData.employees.map(employee => (
                                    <PEItem 
                                        key={employee.user_id} 
                                        employee={employee} 
                                        periodId={selectedPeriod}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {periods.length === 0 ? 'No payroll periods found' : 'No employee data found for this period'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {payrollData && payrollData.totals && (
                    <>
                        <div className="relative flex flex-col items-start justify-between h-50 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <p className="absolute text-xl top-2 right-5">₱</p>
                            <p>Total Deductions</p>
                            <div className="flex flex-col items-start justify-center">
                                <p className="text-lg">₱{payrollData.totals.totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                <p className="text-sm font-medium">
                                    {payrollData.totals.totalGross > 0 
                                        ? ((payrollData.totals.totalDeductions / payrollData.totals.totalGross) * 100).toFixed(1) 
                                        : '0.0'}% of gross
                                </p>
                            </div>
                        </div>

                        <div className="relative flex flex-col items-start justify-between h-50 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <p className="absolute text-xl top-2 right-5">₱</p>
                            <p>Total Net Pay</p>
                            <div className="flex flex-col items-start justify-center">
                                <p className="text-lg">₱{payrollData.totals.totalNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                <p className="text-sm font-medium">Ready to process</p>
                            </div>
                        </div>

                        <div className="relative flex flex-col items-start justify-between h-30 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <div className="flex flex-col items-start justify-center">
                                <p className="text-lg">{payrollData.totals.totalHours.toFixed(1)}</p>
                                <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">Total Hours</p>
                            </div>
                        </div>

                        <div className="relative flex flex-col items-start justify-between h-30 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <div className="flex flex-col items-start justify-center">
                                <p className="text-lg">₱{payrollData.totals.totalOvertime.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">Total Overtime</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}