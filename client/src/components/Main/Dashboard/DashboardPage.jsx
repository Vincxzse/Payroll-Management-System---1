
import Header from "../Header";

export default function DashboardPage() {
    return(
        <>
            <div className="col-span-5 flex flex-col w-full h-full">
                <Header pageTitle="Dashboard" pageDescription="Overview and key metrics" />
                <div className="flex flex-col items-center justify-start h-9/10 w-full p-5">
                    <div className="flex flex-col items-start justify-start w-full h-auto">
                        <h2 className="text-md font-medium">Good morning, Username</h2>
                        <p className="font-sans text-sm text-[rgba(0,0,0,0.6)]">Here's what's happening at your company today</p>
                    </div>
                </div>
            </div>
        </>
    )
}