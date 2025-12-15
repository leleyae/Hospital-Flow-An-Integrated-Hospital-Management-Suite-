import React, { useState, useEffect } from 'react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        action: '',
        entity: '',
        userId: ''
    });

    useEffect(() => {
        fetchLogs();
    }, [currentPage, filters]);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: currentPage,
                limit: 20,
                ...filters
            });

            const response = await fetch(`/api/admin/audit-logs?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            setLogs(data.logs);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        if (action.includes('CREATE')) return 'action-create';
        if (action.includes('UPDATE')) return 'action-update';
        if (action.includes('DELETE')) return 'action-delete';
        return 'action-default';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) {
        return <div className="loading">Loading audit logs...</div>;
    }

    return (
        <div className="audit-logs">
            <div className="page-header">
                <h1 className="page-title">Audit Logs</h1>
                <button
                    className="btn-secondary"
                    onClick={fetchLogs}
                >
                    🔄 Refresh
                </button>
            </div>

            <div className="filters">
                <div className="form-row">
                    <div className="form-group">
                        <label>Action</label>
                        <input
                            type="text"
                            placeholder="Filter by action..."
                            value={filters.action}
                            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Entity</label>
                        <input
                            type="text"
                            placeholder="Filter by entity..."
                            value={filters.entity}
                            onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>User ID</label>
                        <input
                            type="text"
                            placeholder="Filter by user ID..."
                            value={filters.userId}
                            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>Entity ID</th>
                            <th>Details</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>{formatDate(log.timestamp)}</td>
                                <td>
                                    {log.userId ? (
                                        <div className="user-info-small">
                                            <div className="avatar-placeholder-small">
                                                {log.userId.firstName?.charAt(0)}{log.userId.lastName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div>{log.userId.firstName} {log.userId.lastName}</div>
                                                <small>{log.userId.email}</small>
                                            </div>
                                        </div>
                                    ) : 'System'}
                                </td>
                                <td>
                                    <span className={`action-badge ${getActionColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td>{log.entity}</td>
                                <td className="entity-id">{log.entityId || 'N/A'}</td>
                                <td>
                                    {log.details ? (
                                        <div className="details-tooltip">
                                            <span className="details-icon">📋</span>
                                            <div className="tooltip-content">
                                                <pre>{JSON.stringify(log.details, null, 2)}</pre>
                                            </div>
                                        </div>
                                    ) : 'No details'}
                                </td>
                                <td>{log.ipAddress || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    ← Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default AuditLogs;