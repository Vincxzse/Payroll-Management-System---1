const viewIcon = "/images/eye.png"
const editIcon = "/images/edit.png"
const deleteIcon = "/images/trashcan.png"

export default function EDItem(props) {
    return(
        <div className="grid grid-cols-9 gap-4 w-full border-t border-[rgba(0,0,0,0.1)] items-center justify-center h-10 px-2">
            <p className="col-span-2 font-normal text-sm">{props.employee.first_name} {props.employee.last_name}</p>
            <div className="col-span-1 flex flex-row items-center justify-start w-full h-full">
                <p className="font-normal text-sm border border-[rgba(0,0,0,0.2)] px-2 rounded-lg">{props.employee.employee_id}</p>
            </div>
            <p className="col-span-2 font-normal text-sm">{props.employee.position}</p>
            <p className="col-span-1 font-normal text-sm">₱{Number(props.employee.salary).toLocaleString()}</p>
            <p className="col-span-1 font-normal text-sm">{props.employee.status}</p>
            <div className="col-span-2 flex flex-row items-center justify-start gap-2">
                <button
                    className="h-auto w-auto cursor-pointer p-1 border border-[rgba(0,0,0,0.2)] rounded-lg hover:bg-[rgba(0,0,0,0.1)] transition duration-200"
                >
                    <img src={viewIcon} alt="View Icon" className="h-4" />
                </button>
                <button
                    className="h-auto w-auto cursor-pointer p-1 border border-[rgba(0,0,0,0.2)] rounded-lg hover:bg-[rgba(0,0,0,0.1)] transition duration-200"
                >
                    <img src={editIcon} alt="Edit Icon" className="h-4" />
                </button>
                <button
                    className="h-auto w-auto cursor-pointer p-1 border border-[rgba(0,0,0,0.2)] rounded-lg hover:bg-[rgba(0,0,0,0.1)] transition duration-200"
                >
                    <img src={deleteIcon} alt="Delete Icon" className="h-4" />
                </button>
            </div>
        </div>
    )
}