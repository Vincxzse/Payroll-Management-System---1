

export default function SalaryInformation({ employee }) {
    return (
        <>
            <div className="col-span-2 py-10 px-5 flex flex-col items-start justify-start gap-5">
                <h2 className="text-lg font-medium">Salary Information</h2>
                <div className="flex flex-col items-start justify-center h-auto">
                    <p className="text-md font-medium text-[rgba(0,0,0,0.6)]">Salary:</p>
                    <p className="text-xl font-normal text-black">₱ { Number(employee.salary).toLocaleString() }</p>
                </div>
                <div className="flex flex-col items-start justify-center h-auto gap-1">
                    <p className="text-md font-medium text-[rgba(0,0,0,0.6)]">Pay Grade:</p>
                    <p className="text-sm font-medium text-black bg-green-200 border-2 border-green-500 px-2 py-1 rounded-full">Level { employee.pay_grade }</p>
                </div>
            </div>
        </>
    )
}