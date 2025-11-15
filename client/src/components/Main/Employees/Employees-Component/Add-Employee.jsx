import { useState } from 'react'

import { API_URL } from '../../../../config'

const addEmployeeIcon = '/images/add-employee.png'
const hiddenIcon = "/images/hide-password.png"
const visibleIcon = "/images/show-password.png"

export default function AddEmployee({ setAddEmployeeModal }) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [responseBox, setResponseBox] = useState(false)
    const [responseMessage, setResponseMessage] = useState("")
    const [responseStatus, setResponseStatus] = useState(true)
    const [passwordsMatched, setPasswordsMatched] = useState(true)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [employeeId, setEmployeeId] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState("")
    const [phone, setPhone] = useState("")
    const [position, setPosition] = useState("")

    const sendData = (e) => {
        e.preventDefault()
        setAddEmployeeModal(false)
    }

    const handleBackdropClick = () => {
        setAddEmployeeModal(false)
    }

    const handleModalClick = (e) => {
        e.stopPropagation()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (password !== confirmPassword) return setPasswordsMatched(false)
            if (password === confirmPassword) return setPasswordsMatched(true)
            const body = {firstName, lastName, email, employeeId, password, role, phone, position}
            const response = await fetch(`${API_URL}/api/create-account`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            // if (!response.ok) return setResponseMessage()
        } catch (err) {
            
        }
    }

    return(
        <>
            <div
                onClick={handleBackdropClick}
                className="absolute flex flex-row items-center justify-center h-screen w-screen top-0 left-0 bg-[rgba(0,0,0,0.3)] z-100"
            >
                <div 
                    onClick={handleModalClick}
                    className="flex flex-col items-start justify-start w-full m-10 xl:w-2/5 max-h-[90vh] bg-white rounded-lg overflow-hidden"
                >
                    <div className="flex flex-row items-center justify-between gap-2 h-16 w-full bg-black px-6">
                        <div className="flex flex-row items-center gap-3">
                            <img src={addEmployeeIcon} alt="add employee icon" className="h-5 w-auto invert-100" />
                            <h2 className="text-xl text-white font-medium">Add Employee</h2>
                        </div>
                        <button 
                            onClick={handleBackdropClick}
                            className="text-white hover:text-gray-300 text-2xl cursor-pointer"
                        >
                            ×
                        </button>
                    </div>
                    <form
                        onSubmit={sendData}
                        className="flex flex-col w-full h-full px-6 py-5 gap-4 overflow-y-auto"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700">First Name *</label>
                                <input
                                    onChange={(e) => setFirstName(e.target.value)}
                                    type="text"
                                    required 
                                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700">Last Name *</label>
                                <input 
                                    onChange={(e) => setLastName(e.target.value)}
                                    type="text" 
                                    required 
                                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-700">Email *</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email" 
                                required 
                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-700">Employee ID *</label>
                            <input
                                onChange={(e) => setEmployeeId(e.target.value)}
                                type="text" 
                                required 
                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                            />
                        </div>

                        <div className='flex flex-col w-full h-auto gap-2'>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-700">Password *</label>
                                    <div className="flex flex-row w-full border border-gray-300 rounded px-3 py-2">
                                        <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={showPassword ? "text" : "password"}
                                            required 
                                            className="text-sm w-full focus:outline-none focus:border-black pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-500 hover:text-black text-sm cursor-pointer"
                                        >
                                            <img src={showPassword ? visibleIcon : hiddenIcon} className="h-4 w-auto" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-gray-700">Confirm Password *</label>
                                    <div className="flex flex-row w-full border border-gray-300 rounded px-3 py-2">
                                        <input
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            type={showConfirmPassword ? "text" : "password"}
                                            required 
                                            className="text-sm w-full focus:outline-none focus:border-black pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-500 hover:text-black text-sm cursor-pointer"
                                        >
                                            <img src={showConfirmPassword ? visibleIcon : hiddenIcon} className="h-4 w-auto" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className={`text-red-500 w-full text-center rounded-sm border-2 border-red-500 bg-red-100 ${passwordsMatched ? 'hidden' : 'block'}`}>Passwords did not match *</p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-700">Role *</label>
                            <select
                                onChange={(e) => setRole(e.target.value)}
                                required 
                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black bg-white cursor-pointer"
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="employee">Employee</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700">Phone</label>
                                <input 
                                    onChange={(e) => setPhone(e.target.value)}
                                    type="tel"
                                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700">Position</label>
                                <input
                                    onChange={(e) => setPosition(e.target.value)}
                                    type="text" 
                                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 justify-end pt-3 mt-2 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleBackdropClick}
                                className="px-5 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className="px-5 py-2 bg-black text-white rounded text-sm hover:bg-gray-800 cursor-pointer"
                            >
                                Add Employee
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}