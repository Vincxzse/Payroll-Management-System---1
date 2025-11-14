
const addEmployeeIcon = "/images/add-employee.png"

export default function AddEmployee() {
    return(
        <>
            <div className="absolute flex flex-row items-center justify-center h-screen w-screen top-0 left-0 bg-[rgba(0,0,0,0.2)] z-100">
                <div className="flex flex-col items-start justify-start w-1/3 h-2/3 bg-white rounded-md p-5 gap-5">
                    <div className="flex flex-row items-center justify-start gap-2">
                        <img src={addEmployeeIcon} alt="add employee icon" className="h-5" />
                        <h2 className="text-lg font-medium">Add Employee</h2>
                    </div>
                    <form
                        className="flex flex-col w-full h-full"
                    >
                        <div className="grid grid-cols-2 w-full">
                            
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}