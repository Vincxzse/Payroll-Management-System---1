


export default function KPIPerformance({ employee }) {
    return (
        <>
            <div className="col-span-2 py-10 px-5 flex flex-col items-start justify-start gap-5">
                <h2 className="text-lg font-medium">KPI Performance</h2>
                <div className="flex flex-rows items-center justify-between h-auto w-full">
                    <p className="text-md font-medium text-[rgba(0,0,0,0.6)]">Overall Score:</p>
                    <p className="text-md font-medium text-black">Score / Max Score</p>
                </div>
            </div>
        </>
    )
}