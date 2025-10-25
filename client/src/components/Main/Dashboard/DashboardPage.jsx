import { useEffect, useState } from "react"

import Header from "../Header"
import CardOne from "./Dashboard-Components/Card1"
import { API_URL } from "../../../config"

const upIcon = "/images/up.png"
const downIcon = "/images/down.png"

export default function DashboardPage(props) {
    const [totalEmployees, setTotalEmployees] = useState(0)
    const [addedThisMonth, setAddedThisMonth] = useState(0)
    const [percentageChange, setPercentageChange] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTotalEmployees()
    }, [])

    const fetchTotalEmployees = async () => {
        try {
            const response = await fetch(`${API_URL}/api/get-total-employees`)
            const result = await response.json()
            const total = result.totalEmployees
            const added = result.addedThisMonth
            const lastMonthTotalEmployees = total - added
            const addedEmployeesPercentage = lastMonthTotalEmployees > 0 ? ((added / lastMonthTotalEmployees) * 100).toFixed(1) : 0
            setTotalEmployees(total)
            setAddedThisMonth(added)
            setPercentageChange(addedEmployeesPercentage)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching employees: ', err)
            setLoading(false)
        }
    }

    return(
        <>
            <div className="col-span-5 flex flex-col w-full h-full">
                <Header pageTitle="Dashboard" pageDescription="Overview and key metrics" currentUser={props.currentUser} />
                <div className="flex flex-col items-center justify-start h-9/10 w-full p-5 gap-5">
                    <div className="flex flex-col items-start justify-start w-full h-auto">
                        <h2 className="text-md font-medium">Good morning, {props.currentUser.first_name}</h2>
                        <p className="font-sans text-sm text-[rgba(0,0,0,0.6)]">Here's what's happening at your company today</p>
                    </div>
                    <CardOne
                        cardTitle="Total Employees"
                        cardValue={loading ? "..." : totalEmployees}
                        cardDescription={loading ? "..." : `+${percentageChange}% from last month`}
                        cardImage={upIcon}
                        changes={loading ? "..." : `+${addedThisMonth}`}
                    />
                    <CardOne cardTitle="Monthly Payroll" cardValue="$324K" cardDescription="+4% from last month" cardImage={upIcon} changes="+2.1%" />
                </div>
            </div>
        </>
    )
}