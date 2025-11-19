
import { useState } from "react"
import { API_URL } from "../../../../config"

const documentIcon = "/images/document.png"

export default function PEItem({ employee, periodId }) {
    const [generating, setGenerating] = useState(false)

    const handleGeneratePayslip = async () => {
        setGenerating(true)
        try {
            const response = await fetch(
                `${API_URL}/api/payroll/generate-payslip/${employee.user_id}/${periodId}`,
                { method: 'POST' }
            )
            const data = await response.json()
            
            // Here you would typically open a PDF or download
            console.log('Payslip data:', data)
            alert('Payslip generated successfully!')
        } catch (error) {
            console.error('Error generating payslip:', error)
            alert('Failed to generate payslip')
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="grid grid-cols-7 gap-4 w-full border-t border-[rgba(0,0,0,0.1)] items-center justify-center h-10 px-2">
            <p className="col-span-1 font-normal text-sm">
                {employee.first_name} {employee.last_name}
            </p>
            <p className="col-span-1 font-normal text-sm">
                ₱{parseFloat(employee.basic_salary || 0).toLocaleString()}
            </p>
            <p className="col-span-1 font-normal text-sm">
                {parseFloat(employee.hours_worked || 0).toFixed(1)}
            </p>
            <p className="col-span-1 font-normal text-sm">
                ₱{parseFloat(employee.deductions || 0).toLocaleString()}
            </p>
            <p className="col-span-1 font-normal text-sm">
                ₱{parseFloat(employee.overtime_amount || 0).toLocaleString()}
            </p>
            <p className="col-span-1 font-normal text-sm">
                ₱{parseFloat(employee.net_pay || 0).toLocaleString()}
            </p>
            <div className="col-span-1 flex items-center justify-center w-full h-full py-1 px-5">
                <button 
                    onClick={handleGeneratePayslip}
                    disabled={generating}
                    className="h-full w-full flex flex-row items-center justify-center gap-1 border border-[rgba(0,0,0,0.2)] rounded-md font-medium text-sm cursor-pointer hover:invert transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                >
                    <img src={documentIcon} alt="" className="h-5 w-auto" />
                    {generating ? 'Generating...' : 'Generate'}
                </button>
            </div>
        </div>
    )
}