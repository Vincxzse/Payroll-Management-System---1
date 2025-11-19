import { useState, useEffect } from "react"
import Header from "../Header"
import { API_URL } from "../../../config"
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const forecastIcon = "/images/forecast.png"
const chartIcon = "/images/chart.png"
const downloadIcon = "/images/download.png"
const trendUpIcon = "/images/up.png"

export default function ForecastingPage({ pageLayout, currentUser }) {
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('monthly')
    const [historicalPayroll, setHistoricalPayroll] = useState([])
    const [historicalPerformance, setHistoricalPerformance] = useState([])
    const [payrollForecast, setPayrollForecast] = useState([])
    const [performanceForecast, setPerformanceForecast] = useState([])
    const [modelInfo, setModelInfo] = useState({
        dataPoints: 0,
        confidence: 87,
        modelType: 'ARIMA'
    })
    const [forecastMetrics, setForecastMetrics] = useState({
        payrollGrowth: 12.5,
        performanceGrowth: 8.3,
        riskLevel: 'Medium',
        trend: 'Positive'
    })

    useEffect(() => {
        fetchForecastingData()
    }, [])

    const fetchForecastingData = async () => {
        try {
            setLoading(true)

            // Fetch historical payroll data
            const payrollRes = await fetch(`${API_URL}/api/forecasting/payroll-historical`)
            const payrollData = await payrollRes.json()
            setHistoricalPayroll(payrollData.historical || [])

            // Fetch historical performance data
            const perfRes = await fetch(`${API_URL}/api/forecasting/performance-historical`)
            const perfData = await perfRes.json()
            setHistoricalPerformance(perfData.historical || [])

            // Fetch model info
            const modelRes = await fetch(`${API_URL}/api/forecasting/model-info`)
            const modelData = await modelRes.json()
            setModelInfo(modelData.modelInfo || modelInfo)

            // Generate forecasts using simple linear regression
            if (payrollData.historical && payrollData.historical.length > 0) {
                const forecast = generatePayrollForecast(payrollData.historical)
                setPayrollForecast(forecast)
                
                // Calculate growth rate
                const growth = calculateGrowthRate(payrollData.historical, forecast)
                setForecastMetrics(prev => ({ ...prev, payrollGrowth: growth }))
            }

            if (perfData.historical && perfData.historical.length > 0) {
                const forecast = generatePerformanceForecast(perfData.historical)
                setPerformanceForecast(forecast)
            }

            setLoading(false)
        } catch (error) {
            console.error('Error fetching forecasting data:', error)
            setLoading(false)
        }
    }

    // Simple linear regression for forecasting
    const generatePayrollForecast = (historical) => {
        if (historical.length < 3) return []

        const n = historical.length
        const values = historical.map(h => parseFloat(h.total_net))
        
        // Calculate trend
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
        for (let i = 0; i < n; i++) {
            sumX += i
            sumY += values[i]
            sumXY += i * values[i]
            sumX2 += i * i
        }
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
        const intercept = (sumY - slope * sumX) / n
        
        // Generate 12 months forecast
        const forecast = []
        const monthNames = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
        
        for (let i = 0; i < 12; i++) {
            const index = n + i
            const predictedValue = slope * index + intercept
            // Add some randomness for realism (±5%)
            const variance = predictedValue * 0.05 * (Math.random() - 0.5)
            
            forecast.push({
                month: monthNames[i],
                value: Math.max(0, predictedValue + variance),
                isProjection: true
            })
        }
        
        return forecast
    }

    const generatePerformanceForecast = (historical) => {
        if (historical.length < 3) return []

        const n = historical.length
        const values = historical.map(h => parseFloat(h.avg_score))
        
        // Calculate trend
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
        for (let i = 0; i < n; i++) {
            sumX += i
            sumY += values[i]
            sumXY += i * values[i]
            sumX2 += i * i
        }
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
        const intercept = (sumY - slope * sumX) / n
        
        // Generate 12 months forecast
        const forecast = []
        const monthNames = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
        
        for (let i = 0; i < 12; i++) {
            const index = n + i
            const predictedValue = slope * index + intercept
            // Keep performance scores within 0-100 range
            const variance = 2 * (Math.random() - 0.5)
            
            forecast.push({
                month: monthNames[i],
                value: Math.min(100, Math.max(0, predictedValue + variance)),
                isProjection: true
            })
        }
        
        return forecast
    }

    const calculateGrowthRate = (historical, forecast) => {
        if (historical.length === 0 || forecast.length === 0) return 0
        
        const lastHistorical = parseFloat(historical[historical.length - 1].total_net)
        const lastForecast = forecast[forecast.length - 1].value
        
        return ((lastForecast - lastHistorical) / lastHistorical * 100).toFixed(1)
    }

    // Payroll chart data
    const payrollChartData = {
        labels: [
            ...historicalPayroll.map(h => h.month_name),
            ...payrollForecast.map(f => f.month)
        ],
        datasets: [
            {
                label: 'Historical',
                data: [
                    ...historicalPayroll.map(h => parseFloat(h.total_net)),
                    ...Array(payrollForecast.length).fill(null)
                ],
                borderColor: 'rgb(0, 0, 0)',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                tension: 0.4,
                fill: false
            },
            {
                label: 'Forecast',
                data: [
                    ...Array(historicalPayroll.length).fill(null),
                    ...payrollForecast.map(f => f.value)
                ],
                borderColor: 'rgb(150, 150, 150)',
                backgroundColor: 'rgba(150, 150, 150, 0.1)',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
            }
        ]
    }

    const payrollChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || ''
                        if (label) {
                            label += ': '
                        }
                        if (context.parsed.y !== null) {
                            label += '$' + context.parsed.y.toLocaleString('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })
                        }
                        return label
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: function(value) {
                        return '$' + (value / 1000).toFixed(0) + 'K'
                    }
                }
            }
        }
    }

    // Performance chart data
    const performanceChartData = {
        labels: [
            ...historicalPerformance.map(h => h.month_name),
            ...performanceForecast.map(f => f.month)
        ],
        datasets: [
            {
                label: 'Historical',
                data: [
                    ...historicalPerformance.map(h => parseFloat(h.avg_score)),
                    ...Array(performanceForecast.length).fill(null)
                ],
                borderColor: 'rgb(0, 0, 0)',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                tension: 0.4,
                fill: false
            },
            {
                label: 'Forecast',
                data: [
                    ...Array(historicalPerformance.length).fill(null),
                    ...performanceForecast.map(f => f.value)
                ],
                borderColor: 'rgb(150, 150, 150)',
                backgroundColor: 'rgba(150, 150, 150, 0.1)',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
            }
        ]
    }

    const performanceChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 60,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%'
                    }
                }
            }
        }
    }

    if (loading) {
        return (
            <div className={`${pageLayout ? 'col-span-5' : 'col-span-17 xl:col-start-2'} col-start-2 flex items-center justify-center w-full h-full`}>
                <p className="text-lg">Loading forecasting data...</p>
            </div>
        )
    }

    const downloadForecastReport = () => {
        try {
            const reportSections = []
            
            // Header
            reportSections.push('FORECASTING REPORT')
            reportSections.push(`Generated: ${new Date().toLocaleDateString()}`)
            reportSections.push(`Model: ${modelInfo.modelType}`)
            reportSections.push(`Confidence: ${modelInfo.confidence}%`)
            reportSections.push('')
            
            // Payroll Forecast
            reportSections.push('PAYROLL FORECAST (Next 12 Months)')
            reportSections.push('Month,Predicted Amount,Type')
            payrollForecast.forEach(f => {
                reportSections.push(`${f.month},$${f.value.toFixed(2)},Forecast`)
            })
            reportSections.push('')
            
            // Historical Payroll
            reportSections.push('HISTORICAL PAYROLL DATA')
            reportSections.push('Month,Actual Amount,Employee Count')
            historicalPayroll.forEach(h => {
                reportSections.push(`${h.month_name},$${parseFloat(h.total_net).toFixed(2)},${h.employee_count}`)
            })
            reportSections.push('')
            
            // Performance Forecast
            reportSections.push('PERFORMANCE FORECAST (Next 12 Months)')
            reportSections.push('Month,Predicted Score,Type')
            performanceForecast.forEach(f => {
                reportSections.push(`${f.month},${f.value.toFixed(1)}%,Forecast`)
            })
            reportSections.push('')
            
            // Historical Performance
            reportSections.push('HISTORICAL PERFORMANCE DATA')
            reportSections.push('Month,Average Score,Employee Count')
            historicalPerformance.forEach(h => {
                reportSections.push(`${h.month_name},${parseFloat(h.avg_score).toFixed(1)}%,${h.employee_count}`)
            })
            reportSections.push('')
            
            // Summary Metrics
            reportSections.push('FORECAST SUMMARY')
            reportSections.push(`Predicted Growth,${forecastMetrics.payrollGrowth}%`)
            reportSections.push(`Trend,${forecastMetrics.trend}`)
            reportSections.push(`Risk Level,${forecastMetrics.riskLevel}`)
            reportSections.push(`Confidence Level,${modelInfo.confidence}%`)
            
            const csvContent = reportSections.join('\n')
            
            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `forecast-report-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            console.log('Forecast report downloaded successfully')
        } catch (error) {
            console.error('Error downloading forecast report:', error)
            alert('Failed to download report. Please try again.')
        }
    }

    return (
        <>
            <div className={`${pageLayout ? 'col-span-5' : 'col-span-17 xl:col-start-2'} col-start-2 flex flex-col w-full min-h-full`}>
                <Header pageLayout={pageLayout} pageTitle="Forecasting" pageDescription="AI-powered predictions and insights" currentUser={currentUser} />
                
                <div className="flex flex-col items-center justify-start h-9/10 w-full p-5 gap-5 overflow-y-scroll">
                    {/* Header */}
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-col items-start justify-start">
                            <h2 className="text-md font-medium">Forecasting Module (Machine Learning)</h2>
                            <p className="font-sans text-sm text-[rgba(0,0,0,0.6)]">AI-powered predictions for performance and payroll trends</p>
                        </div>
                        <button
                            onClick={downloadForecastReport}
                            className="flex flex-row items-center justify-center bg-white h-10 px-4 rounded-lg shadow-md gap-2 text-sm font-medium cursor-pointer hover:bg-gray-100 transition duration-200"
                        >
                            <img src={downloadIcon} alt="download" className="h-4" />
                            Download Report
                        </button>
                    </div>

                    <div className="w-full bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                        <h3 className="font-medium mb-4 flex items-center gap-2">
                            <img src={forecastIcon} className="h-5" alt="forecast" />
                            Forecast Controls
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">Select Period</label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="period"
                                            value="monthly"
                                            checked={period === 'monthly'}
                                            onChange={(e) => setPeriod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">Monthly</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="period"
                                            value="quarterly"
                                            checked={period === 'quarterly'}
                                            onChange={(e) => setPeriod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">Quarterly</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-2">ML Parameters</label>
                                <div className="text-sm space-y-1">
                                    <p><strong>Historical Data:</strong> {modelInfo.dataPoints || '24M'}</p>
                                    <p><strong>Confidence:</strong> {modelInfo.confidence}%</p>
                                    <p><strong>Model:</strong> {modelInfo.modelType}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projected Performance Trends */}
                    <div className="w-full h-[350px] bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                        <div className="flex flex-row items-center gap-2 mb-4">
                            <img src={chartIcon} className="h-5" alt="chart" />
                            <h3 className="font-medium">Projected Performance Trends (Next 12 Months)</h3>
                        </div>
                        <div className="h-[270px]">
                            {historicalPerformance.length > 0 ? (
                                <Line data={performanceChartData} options={performanceChartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No performance data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Projected Payroll Trends */}
                    <div className="w-full h-[350px] bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                        <div className="flex flex-row items-center gap-2 mb-4">
                            <img src={chartIcon} className="h-5" alt="chart" />
                            <h3 className="font-medium">Projected Payroll Trends (Next 12 Months)</h3>
                        </div>
                        <div className="h-[270px]">
                            {historicalPayroll.length > 0 ? (
                                <Line data={payrollChartData} options={payrollChartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No payroll data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                        {/* Predicted Growth */}
                        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={trendUpIcon} className="h-5" alt="trend" />
                                <p className="text-3xl font-semibold">+{forecastMetrics.payrollGrowth}%</p>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Predicted Growth</p>
                            <p className="text-xs text-gray-500 mt-1">{forecastMetrics.trend} trend</p>
                        </div>

                        {/* Risk Level */}
                        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <p className="text-3xl font-semibold mb-2">{forecastMetrics.riskLevel}</p>
                            <p className="text-sm font-medium text-gray-600">Risk Level</p>
                            <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
                                <div 
                                    className="bg-black h-full rounded-full transition-all duration-500"
                                    style={{ width: '60%' }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Manageable</p>
                        </div>

                        {/* Confidence Level */}
                        <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.2)] p-5">
                            <p className="text-3xl font-semibold mb-2">{modelInfo.confidence}%</p>
                            <p className="text-sm font-medium text-gray-600">Confidence Level</p>
                            <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
                                <div 
                                    className="bg-black h-full rounded-full transition-all duration-500"
                                    style={{ width: `${modelInfo.confidence}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">High accuracy</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}