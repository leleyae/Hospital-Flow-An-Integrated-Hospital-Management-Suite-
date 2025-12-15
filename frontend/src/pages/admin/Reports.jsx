import React, { useState, useEffect } from 'react';


const Reports = () => {
    const [reportType, setReportType] = useState('user-registration');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [chartData, setChartData] = useState(null);

    const reportTypes = [
        { id: 'user-registration', name: 'User Registration', icon: '👥' },
        { id: 'appointments', name: 'Appointments', icon: '📅' },
        { id: 'revenue', name: 'Revenue', icon: '💰' },
        { id: 'department-utilization', name: 'Department Utilization', icon: '🏥' }
    ];

    const fetchReport = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (dateRange.startDate) params.append('startDate', dateRange.startDate);
            if (dateRange.endDate) params.append('endDate', dateRange.endDate);

            const response = await fetch(`/api/admin/reports/${reportType}?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setReportData(data);
            prepareChartData(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = (data) => {
        if (!data || data.length === 0) {
            setChartData(null);
            return;
        }

        switch (reportType) {
            case 'user-registration':
                setChartData({
                    labels: data.map(item => item._id),
                    datasets: [{
                        label: 'User Registrations',
                        data: data.map(item => item.count),
                        backgroundColor: '#4CAF50'
                    }]
                });
                break;

            case 'revenue':
                setChartData({
                    labels: data.map(item => item._id),
                    datasets: [
                        {
                            label: 'Total Revenue',
                            data: data.map(item => item.totalRevenue),
                            backgroundColor: '#2196F3'
                        },
                        {
                            label: 'Amount Collected',
                            data: data.map(item => item.totalCollected),
                            backgroundColor: '#4CAF50'
                        }
                    ]
                });
                break;

            default:
                setChartData(null);
        }
    };

    const exportToCSV = () => {
        if (!reportData.length) return;

        const headers = Object.keys(reportData[0]);
        const csvContent = [
            headers.join(','),
            ...reportData.map(row =>
                headers.map(header => {
                    const value = row[header];
                    return typeof value === 'object' ? JSON.stringify(value) : value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    useEffect(() => {
        fetchReport();
    }, [reportType]);

    return (
        <div className="reports">
            <h1 className="page-title">System Reports</h1>

            <div className="report-controls">
                <div className="report-type-selector">
                    {reportTypes.map(type => (
                        <button
                            key={type.id}
                            className={`report-type-btn ${reportType === type.id ? 'active' : ''}`}
                            onClick={() => setReportType(type.id)}
                        >
                            <span className="report-icon">{type.icon}</span>
                            <span>{type.name}</span>
                        </button>
                    ))}
                </div>

                <div className="date-range">
                    <div className="form-group">
                        <label>From</label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>To</label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        />
                    </div>
                    <button
                        className="btn-primary"
                        onClick={fetchReport}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Apply Filter'}
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={exportToCSV}
                        disabled={!reportData.length}
                    >
                        📊 Export CSV
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Generating report...</div>
            ) : (
                <>
                    {chartData && (
                        <div className="chart-container">
                            <div className="chart">
                                {/* In a real app, you would use a charting library like Chart.js or Recharts */}
                                <div className="mock-chart">
                                    <h3>Visualization</h3>
                                    <p>Chart would appear here using data:</p>
                                    <pre>{JSON.stringify(chartData, null, 2)}</pre>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="report-table">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        {reportData.length > 0 && Object.keys(reportData[0]).map(key => (
                                            <th key={key}>{key.toUpperCase()}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((row, index) => (
                                        <tr key={index}>
                                            {Object.values(row).map((value, i) => (
                                                <td key={i}>
                                                    {typeof value === 'object'
                                                        ? JSON.stringify(value)
                                                        : String(value)
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="report-summary">
                        <h3>Report Summary</h3>
                        <div className="summary-cards">
                            {reportType === 'user-registration' && reportData.length > 0 && (
                                <>
                                    <div className="summary-card">
                                        <h4>Total Registrations</h4>
                                        <p className="summary-number">
                                            {reportData.reduce((sum, item) => sum + item.count, 0)}
                                        </p>
                                    </div>
                                    <div className="summary-card">
                                        <h4>Peak Day</h4>
                                        <p className="summary-text">
                                            {reportData.reduce((max, item) =>
                                                item.count > max.count ? item : max
                                            )._id}
                                        </p>
                                    </div>
                                </>
                            )}

                            {reportType === 'revenue' && reportData.length > 0 && (
                                <>
                                    <div className="summary-card">
                                        <h4>Total Revenue</h4>
                                        <p className="summary-number">
                                            ${reportData.reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="summary-card">
                                        <h4>Average Bill</h4>
                                        <p className="summary-number">
                                            ${(reportData.reduce((sum, item) => sum + item.averageBill, 0) / reportData.length).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="summary-card">
                                        <h4>Collection Rate</h4>
                                        <p className="summary-number">
                                            {((reportData.reduce((sum, item) => sum + item.totalCollected, 0) /
                                                reportData.reduce((sum, item) => sum + item.totalRevenue, 0)) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </>
                            )}

                            {reportType === 'appointments' && reportData.length > 0 && (
                                <>
                                    <div className="summary-card">
                                        <h4>Total Appointments</h4>
                                        <p className="summary-number">
                                            {reportData.reduce((sum, item) => sum + item.count, 0)}
                                        </p>
                                    </div>
                                </>
                            )}

                            {reportType === 'department-utilization' && reportData.length > 0 && (
                                <>
                                    <div className="summary-card">
                                        <h4>Highest Utilization</h4>
                                        <p className="summary-text">
                                            {reportData.reduce((max, item) =>
                                                item.utilizationRate > max.utilizationRate ? item : max
                                            ).department}
                                        </p>
                                        <p className="summary-number">
                                            {reportData.reduce((max, item) =>
                                                item.utilizationRate > max.utilizationRate ? item : max
                                            ).utilizationRate}%
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;