
import Header from "../Header";

export default function EmployeesPage(props) {
    return(
        <>
            <div className="col-span-5 flex flex-col w-full h-full">
                <Header pageTitle="Employees" pageDescription="Manage team members and profiles" currentUser={props.currentUser} />
                <div className="flex flex-col items-center justify-start h-9/10 w-full p-5">
                    <div className="flex flex-col items-start justify-start w-full h-auto">
                        <h2 className="text-md font-medium">Employee Management</h2>
                        <p className="font-sans text-sm text-[rgba(0,0,0,0.6)]">Manage your team members and their information</p>
                    </div>
                </div>
            </div>
        </>
    )
}