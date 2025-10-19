import NavLink from "./Nav-Link"

const menuIcon = "/images/menu.png"
const dashboardIcon = "/images/dashboard.png"
const employeesIcon = "/images/employees.png"
const payrollIcon = "/images/payroll.png"
const performanceIcon = "/images/performance.png"
const forecastingIcon = "/images/forecasting.png"
const reportsIcon = "/images/reports.png"
const employeePortalIcon = "/images/employee-portal.png"
const settingsIcon = "/images/settings.png"
const helpIcon = "/images/help.png"
const signoutIcon = "/images/signout.png"

export default function Sidebar() {
    return(
        <>
            <div className="flex flex-col items-center justify-start bg-gray-50 w-full h-full col-span-1 border-r border-[rgba(0,0,0,0.2)]">
                <div className="h-1/10 w-full border-b border-[rgba(0,0,0,0.2)] px-5">
                    <div className="flex flex-row w-full h-full items-center justify-between">
                        <div className="flex flex-row h-full w-auto items-center justify-start gap-2">
                            <div className="bg-gray-300 h-10 w-10 rounded-lg"></div>
                            <h2 className="text-sans font-medium text-lg">Company</h2>
                        </div>
                        <button className="flex flex-col items-center justify-center h-10 w-10 cursor-pointer rounded-lg hover:bg-gray-100 transition duration-200">
                            <img src={menuIcon} className="h-5 w-auto" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center h-1/2 w-full px-5">
                    <div className="h-full w-full items-center justify-center flex flex-col border-b border-[rgba(0,0,0,0.2)] py-5">
                        <div className="flex flex-col items-center justify-start gap-2 w-full h-full">
                            <NavLink image={dashboardIcon} title="Dashboard" link="/admin/dashboard" />
                            <NavLink image={employeesIcon} title="Employees" link="/admin/employees" />
                            <NavLink image={payrollIcon} title="Payroll" link="/admin/payroll" />
                            <NavLink image={performanceIcon} title="Performance" link="/admin/performance" />
                            <NavLink image={forecastingIcon} title="Forecasting" link="/admin/forecasting" />
                            <NavLink image={reportsIcon} title="Reports" link="/admin/reports" />
                            {/* <NavLink image={employeePortalIcon} title="Employee Portal" /> */}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center h-3/10 w-full p-5 border-b border-[rgba(0,0,0,0.2)]">
                    <div className="flex flex-col items-center justify-start w-full h-full gap-2">
                        <NavLink image={settingsIcon} title="Settings" />
                        <NavLink image={helpIcon} title="Help" />
                    </div>
                </div>
                <div className="h-1/10 w-full border-b border-[rgba(0,0,0,0.2)] px-5">
                    <div className="flex flex-row w-full h-full items-center justify-between">
                        <div className="flex flex-row h-full w-auto items-center justify-start gap-2">
                            <div className="bg-gray-300 h-10 w-10 rounded-full"></div>
                            <div className="flex flex-col items-start justify-start h-10">
                                <h2 className="text-sans font-medium text-sm">Username</h2>
                                <p className="text-sm text-[rgba(0,0,0,0.5)] text-sans">User Role</p>
                            </div>
                        </div>
                        <button className="flex flex-col items-center justify-center h-10 w-10 cursor-pointer rounded-lg hover:bg-gray-100 transition duration-200">
                            <img src={signoutIcon} className="h-5 w-auto" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}