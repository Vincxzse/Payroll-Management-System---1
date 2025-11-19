import { useState, useEffect } from "react"
import Header from "../Header"
import { API_URL } from "../../../config"
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const settingsIcon = "/images/settings.png"
const kpiIcon = "/images/kpi.png"
const departmentIcon = "/images/department.png"
const targetIcon = "/images/performance.png"
const rightIcon = "/images/right.png"
const upIcon = "/images/up.png"

export default function PerformancePage({ pageLayout, currentUser }) {
    const [kpiTrends, setKpiTrends] = useState([])
    const [departmentPerformance, setDepartmentPerformance] = useState([])
    const [employeePerformance, setEmployeePerformance] = useState([])
    const [overallStats, setOverallStats] = useState({
        average: 0,
        change: 0,
        activeEmployees: 0,
        topPerformers: 0
    })
    const [loading, setLoading] = useState(true)
    const [showKPIModal, setShowKPIModal] = useState(false)

    useEffect(() => {
        fetchPerformanceData()
    }, [])

    const fetchPerformanceData = async () => {
        try {
            const trendsRes = await fetch(`${API_URL}/api/performance/kpi-trends`)
            const trendsData = await trendsRes.json()
            setKpiTrends(trendsData.trends || [])

            const deptRes = await fetch(`${API_URL}/api/performance/department-summary`)
            const deptData = await deptRes.json()
            setDepartmentPerformance(deptData.departments || [])

            const empRes = await fetch(`${API_URL}/api/performance/top-employees`)
            const empData = await empRes.json()
            setEmployeePerformance(empData.employees || [])

            const statsRes = await fetch(`${API_URL}/api/performance/overall-stats`)
            const statsData = await statsRes.json()
            setOverallStats(statsData.stats || overallStats)

            setLoading(false)
        } catch (error) {
            console.error('Error fetching performance data:', error)
            setLoading(false)
        }
    }

    const handleConfigureKPIs = () => {
        setShowKPIModal(true)
    }

    const downloadPerformanceReport = () => {
        try {
            const headers = ['Employee Name', 'Employee ID', 'Position', 'Average Score', 'Status']
            const rows = employeePerformance.map(emp => [
                `${emp.first_name} ${emp.last_name}`,
                emp.user_id,
                emp.position || 'N/A',
                Math.round(emp.avg_score),
                emp.avg_score >= 90 ? 'Excellent' : emp.avg_score >= 75 ? 'Good' : 'Needs Improvement'
            ])
            
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n')
            
            const summary = [
                '',
                'SUMMARY STATISTICS',
                `Overall Average,${overallStats.average.toFixed(1)}%`,
                `Active Employees,${overallStats.activeEmployees}`,
                `Top Performers (90%+),${overallStats.topPerformers}`,
                `Change from Last Month,${overallStats.change.toFixed(1)}%`,
                '',
                'DEPARTMENT PERFORMANCE',
                'Department,Average Score,Employee Count'
            ]
            
            departmentPerformance.forEach(dept => {
                summary.push(`${dept.name},${Math.round(dept.avg_score)}%,${dept.employee_count}`)
            })
            
            const fullCsvContent = csvContent + '\n' + summary.join('\n')
            
            const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8;' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `performance-report-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            console.log('Performance report downloaded successfully')
        } catch (error) {
            console.error('Error downloading report:', error)
            alert('Failed to download report. Please try again.')
        }
    }

    const chartData = {
        labels: kpiTrends.map(t => t.month_name || `Month ${t.month}`),
        datasets: [{
            label: 'Average KPI Score',
            data: kpiTrends.map(t => parseFloat(t.avg_score) || 0),
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1
        }]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%'
                    }
                }
            }
        }
    }

    const getStatusIcon = (score) => {
        if (score >= 90) return <span className="text-green-500">↑</span>
        if (score >= 75) return <span className="text-yellow-500">→</span>
        return <span className="text-red-500">↓</span>
    }

    if (loading) {
        return (
            <div className={`${pageLayout ? 'col-span-5' : 'col-span-17 xl:col-start-2'} col-start-2 flex items-center justify-center w-full h-full`}>
                <p className="text-lg">Loading performance data...</p>
            </div>
        )
    }

    return (
        <>
            <div className={`${pageLayout ? 'col-span-5' : 'col-span-17 xl:col-start-2'} col-start-2 flex flex-col w-full min-h-full`}>
                <Header pageLayout={pageLayout} pageTitle="Performance" pageDescription="Track performance and goals" currentUser={currentUser} />
                <div className="flex flex-col items-center justify-start h-9/10 w-full p-5 gap-5 overflow-y-scroll">
                    <div className="flex flex-row items-center justify-between w-full h-auto">
                        <div className="flex flex-col items-start justify-start w-full h-auto">
                            <h2 className="text-md font-medium">KPI & Performance Monitoring</h2>
                            <p className="font-sans text-sm text-[rgba(0,0,0,0.6)]">Track and analyze employee performance metrics</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={downloadPerformanceReport}
                                className="flex flex-row items-center justify-center bg-white h-10 px-4 rounded-lg shadow-md gap-2 text-sm font-medium cursor-pointer hover:bg-gray-100 transition duration-200"
                            >
                                <span>📥</span>
                                Export CSV
                            </button>
                            <button
                                onClick={handleConfigureKPIs}
                                className="flex flex-row items-center justify-center bg-white h-10 px-4 rounded-lg shadow-md gap-2 text-sm font-medium cursor-pointer hover:bg-gray-100 transition duration-200"
                            >
                                <img src={settingsIcon} alt="settings icon" className="h-4" />
                                Configure KPIs
                            </button>
                        </div>
                    </div>

                    <div className="w-full min-h-[360px] flex flex-col items-start justify-between rounded-2xl overflow-hidden border-1 border-[rgba(0,0,0,0.2)] p-5">
                        <div className="flex flex-row items-center justify-start w-full h-15 gap-2 mb-4">
                            <img src={kpiIcon} className="h-5" alt="kpi" />
                            <h2 className="font-medium">KPI Trend Analysis</h2>
                        </div>
                        <div className="h-[280px] w-full">
                            {kpiTrends.length > 0 ? (
                                <Bar data={chartData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No KPI data available
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full h-auto flex flex-col items-start justify-between rounded-2xl border-1 border-[rgba(0,0,0,0.2)] p-5">
                        <div className="flex flex-row items-center justify-start w-full h-15 gap-2 mb-3">
                            <img src={departmentIcon} className="h-5" alt="department" />
                            <h2 className="font-medium">Performance by Department</h2>
                        </div>
                        <div className="flex flex-col items-center justify-start w-full gap-3">
                            {departmentPerformance.length > 0 ? (
                                departmentPerformance.map((dept, index) => (
                                    <div key={index} className="flex flex-col w-full">
                                        <div className="flex flex-row items-center justify-between w-full">
                                            <p className="text-sm font-medium">{dept.code || dept.name}</p>
                                            <p className="text-sm">{Math.round(dept.avg_score)}%</p>
                                        </div>
                                        <div className="flex flex-row items-center justify-start bg-gray-200 h-2 w-full rounded-full overflow-hidden">
                                            <div 
                                                className="bg-black h-full transition-all duration-500" 
                                                style={{ width: `${dept.avg_score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">No department data available</p>
                            )}
                        </div>
                    </div>

                    <div className="w-full h-auto flex flex-col items-start justify-between rounded-2xl border-1 border-[rgba(0,0,0,0.2)] p-5">
                        <div className="flex flex-row items-center justify-start w-full h-15 gap-2 mb-3">
                            <img src={targetIcon} className="h-5" alt="target" />
                            <h2 className="font-medium">Employee Performance</h2>
                        </div>
                        <div className="flex flex-col items-center justify-start w-full gap-3">
                            <div className="w-full overflow-x-auto">
                                <div className="flex flex-col min-w-[600px]">
                                    <div className="grid grid-cols-4 gap-4 w-full items-center justify-center h-10 px-2 bg-gray-50">
                                        <p className="col-span-1 font-medium text-sm">Employee</p>
                                        <p className="col-span-1 font-medium text-sm">Score</p>
                                        <p className="col-span-1 font-medium text-sm">Status</p>
                                        <p className="col-span-1 font-medium text-sm">Action</p>
                                    </div>
                                    {employeePerformance.length > 0 ? (
                                        employeePerformance.map((emp, index) => (
                                            <div key={index} className="grid grid-cols-4 gap-4 w-full border-t border-[rgba(0,0,0,0.1)] items-center justify-center h-10 px-2 hover:bg-gray-50">
                                                <p className="col-span-1 font-normal text-sm">
                                                    {emp.first_name} {emp.last_name}
                                                </p>
                                                <p className="font-normal text-sm py-0 px-2 border-1 border-[rgba(0,0,0,0.2)] w-10 text-center rounded-lg">
                                                    {Math.round(emp.avg_score)}
                                                </p>
                                                <div className="col-span-1 font-normal text-sm flex items-center">
                                                    {getStatusIcon(emp.avg_score)}
                                                </div>
                                                <button 
                                                    className="border-1 border-[rgba(0,0,0,0.2)] flex items-center justify-center w-10 h-7 rounded-lg cursor-pointer hover:bg-gray-100 bg-white transition duration-200"
                                                    onClick={() => window.location.href = `/employees/${emp.user_id}`}
                                                >
                                                    <img src={rightIcon} className="h-3" alt="view" />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-4 text-center py-4 text-gray-400 text-sm">
                                            No employee performance data available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                        <div className="relative flex flex-col items-start justify-between h-30 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <div className="flex flex-col items-start justify-center">
                                <p className="text-2xl font-semibold">{overallStats.average.toFixed(1)}%</p>
                                <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">Overall Average</p>
                                <p className="text-sm font-medium text-[rgba(0,0,0,0.6)] flex flex-row items-center justify-start gap-2">
                                    <img src={upIcon} className="h-3" alt="up" />
                                    {overallStats.change.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                        <div className="relative flex flex-col items-start justify-between h-30 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <div className="flex flex-col items-start justify-center">
                                <p className="text-2xl font-semibold">{overallStats.activeEmployees}</p>
                                <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">Active Employees</p>
                                <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">All tracked</p>
                            </div>
                        </div>
                        <div className="relative flex flex-col items-start justify-between h-30 w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <div className="flex flex-col items-start justify-center">
                                <p className="text-2xl font-semibold">{overallStats.topPerformers}</p>
                                <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">Top Performers</p>
                                <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">90%+ Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showKPIModal && (
                <div 
                    className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50"
                    onClick={() => setShowKPIModal(false)}
                >
                    <div 
                        className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Configure KPI Metrics</h3>
                            <button 
                                onClick={() => setShowKPIModal(false)}
                                className="text-3xl hover:text-gray-600 leading-none"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-3">Current KPI Metrics</h4>
                                <div className="space-y-4">
                                    {/* Productivity */}
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Metric Name</label>
                                                <input 
                                                    type="text"
                                                    defaultValue="Productivity"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Description</label>
                                                <input 
                                                    type="text"
                                                    defaultValue="Task completion rate"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Weight (%)</label>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    defaultValue="30"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Target Score</label>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    defaultValue="85"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                                                    <span>Active</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quality */}
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Metric Name</label>
                                                <input 
                                                    type="text"
                                                    defaultValue="Quality"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Description</label>
                                                <input 
                                                    type="text"
                                                    defaultValue="Code quality and bug rate"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Weight (%)</label>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    defaultValue="30"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Target Score</label>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    defaultValue="90"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                                                    <span>Active</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Teamwork */}
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Metric Name</label>
                                                <input 
                                                    type="text"
                                                    defaultValue="Teamwork"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Description</label>
                                                <input 
                                                    type="text"
                                                    defaultValue="Collaboration score"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Weight (%)</label>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    defaultValue="20"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Target Score</label>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    defaultValue="85"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                                                    <span>Active</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Innovation */}
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Metric Name</label>
                                                <input 
                                                    type="text"
                                                    defaultValue="Innovation"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Description</label>
                                                <input 
                                                    type="text"
                                                    defaultValue="New ideas and improvements"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Weight (%)</label>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    defaultValue="20"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Target Score</label>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    defaultValue="80"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                                                    <span>Active</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => alert('Add new metric functionality - you can implement this to add more KPI metrics dynamically')}
                                    className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition text-sm font-medium"
                                >
                                    + Add New Metric
                                </button>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Total weight should equal 100%. Current total: 100%
                                </p>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setShowKPIModal(false)}
                                    className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('KPI configuration saved successfully!')
                                        setShowKPIModal(false)
                                    }}
                                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}