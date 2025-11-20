
import { useState, useEffect } from "react"
import { API_URL } from "../../../config"
import Header from "../../Main/Header"

const documentIcon = "/images/document.png"
const payrollIcon = "/images/payroll.png"

export default function EmployeePayslips({ pageLayout, currentUser }) {
    const [periods, setPeriods] = useState([])
    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const [payslip, setPayslip] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPeriods()
    }, [])

    useEffect(() => {
        if (selectedPeriod) {
            fetchPayslip(selectedPeriod)
        }
    }, [selectedPeriod])

    const fetchPeriods = async () => {
        try {
            const response = await fetch(`${API_URL}/api/payroll/periods`)
            const data = await response.json()
            if (Array.isArray(data)) {
                setPeriods(data)
                if (data.length > 0) {
                    setSelectedPeriod(data[0].period_id)
                }
            }
        } catch (error) {
            console.error('Error fetching periods:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchPayslip = async (periodId) => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/api/payroll/generate-payslip/${currentUser.user_id}/${periodId}`, {
                method: 'POST'
            })
            const data = await response.json()
            setPayslip(data)
        } catch (error) {
            console.error('Error fetching payslip:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`${pageLayout ? 'col-span-5' : 'col-span-17 xl:col-start-2'} col-start-2 flex flex-col w-full min-h-full`}>
            <Header pageLayout={pageLayout} pageTitle="Payslips" pageDescription="View your payslip history" currentUser={currentUser} />
            
            <div className="flex flex-col items-center justify-start h-9/10 w-full p-5 gap-5 overflow-y-scroll">
                <div className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-col items-start justify-start">
                        <h2 className="text-md font-medium">Payslip History</h2>
                        <p className="text-sm text-[rgba(0,0,0,0.6)]">View your payment details</p>
                    </div>
                    <select
                        value={selectedPeriod || ''}
                        onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                        disabled={periods.length === 0}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-white cursor-pointer disabled:opacity-50"
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

                {loading ? (
                    <div className="w-full text-center py-10 text-gray-500">Loading payslip...</div>
                ) : payslip ? (
                    <div className="flex flex-col w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-8 gap-6">
                        {/* Header */}
                        <div className="flex flex-row items-center justify-between border-b border-[rgba(0,0,0,0.1)] pb-5">
                            <div>
                                <h2 className="text-2xl font-bold">Payslip</h2>
                                <p className="text-sm text-[rgba(0,0,0,0.6)]">{payslip.period_name}</p>
                            </div>
                            <img src={payrollIcon} className="h-12 w-auto opacity-20" alt="Payroll" />
                        </div>

                        {/* Employee Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-[rgba(0,0,0,0.6)] mb-1">Employee Name</p>
                                <p className="font-medium">{payslip.first_name} {payslip.last_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[rgba(0,0,0,0.6)] mb-1">Employee ID</p>
                                <p className="font-medium">{payslip.employee_id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[rgba(0,0,0,0.6)] mb-1">Position</p>
                                <p className="font-medium">{payslip.position}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[rgba(0,0,0,0.6)] mb-1">Pay Date</p>
                                <p className="font-medium">{new Date(payslip.pay_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Earnings */}
                        <div className="border-t border-[rgba(0,0,0,0.1)] pt-5">
                            <h3 className="font-medium mb-3">Earnings</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">Basic Salary</span>
                                    <span className="font-medium">₱{parseFloat(payslip.salary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                                {payslip.bonuses > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-sm">Bonuses</span>
                                        <span className="font-medium text-green-600">₱{parseFloat(payslip.bonuses || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                {payslip.overtime_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-sm">Overtime ({parseFloat(payslip.overtime_hours || 0).toFixed(1)} hrs)</span>
                                        <span className="font-medium text-green-600">₱{parseFloat(payslip.overtime_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-[rgba(0,0,0,0.1)]">
                                    <span className="font-medium">Gross Pay</span>
                                    <span className="font-bold">₱{parseFloat(payslip.gross_pay || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Deductions */}
                        <div className="border-t border-[rgba(0,0,0,0.1)] pt-5">
                            <h3 className="font-medium mb-3">Deductions</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">Total Deductions</span>
                                    <span className="font-medium text-red-600">₱{parseFloat(payslip.deductions || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Net Pay */}
                        <div className="border-t-2 border-black pt-5">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Net Pay</span>
                                <span className="text-2xl font-bold text-green-600">₱{parseFloat(payslip.net_pay || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {/* Work Hours */}
                        <div className="bg-gray-50 rounded-lg p-4 mt-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-[rgba(0,0,0,0.6)]">Hours Worked</span>
                                <span className="font-medium">{parseFloat(payslip.hours_worked || 0).toFixed(1)} hrs</span>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="text-xs text-[rgba(0,0,0,0.5)] italic text-center mt-4">
                            This is a digital payslip. Printing is disabled. For official copies, please contact HR.
                        </div>
                    </div>
                ) : (
                    <div className="w-full text-center py-10 text-gray-500">
                        No payslip data available for this period
                    </div>
                )}
            </div>
        </div>
    )
}