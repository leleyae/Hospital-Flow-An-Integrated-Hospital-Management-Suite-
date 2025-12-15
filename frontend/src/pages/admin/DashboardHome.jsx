import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalNurses: 0,
        totalLabTechnicians: 0,
        totalPharmacists: 0,
        totalReceptionists: 0,
        totalAdmins: 0,
        totalAppointments: 0,
        totalDepartments: 0,
        revenueStats: { totalRevenue: 0, totalPaid: 0, pendingAmount: 0 }
    });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Alternative: Fetch all users and count by role
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [statsResponse, usersResponse] = await Promise.all([
                fetch('/api/admin/dashboard-stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch('/api/admin/users?limit=1000', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]);

            const statsData = await statsResponse.json();
            const usersData = await usersResponse.json();

            // Count users by role on the frontend
            const roleCounts = usersData.users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {});

            setStats({
                ...statsData,
                totalNurses: roleCounts.nurse || 0,
                totalLabTechnicians: roleCounts.lab_technician || 0,
                totalPharmacists: roleCounts.pharmacist || 0,
                totalReceptionists: roleCounts.receptionist || 0,
                totalAdmins: roleCounts.admin || 0
            });

            setRecentAppointments(statsData.recentAppointments || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'status-completed';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-default';
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-home">
            <h1 className="page-title">Admin Dashboard</h1>


            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon user-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon doctor-icon">👨‍⚕️</div>
                    <div className="stat-content">
                        <h3>Doctors</h3>
                        <p className="stat-number">{stats.totalDoctors}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon nurse-icon">👩‍⚕️</div>
                    <div className="stat-content">
                        <h3>Nurses</h3>
                        <p className="stat-number">{stats.totalNurses}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon lab-icon">🔬</div>
                    <div className="stat-content">
                        <h3>Lab Technicians</h3>
                        <p className="stat-number">{stats.totalLabTechnicians}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon patient-icon">😷</div>
                    <div className="stat-content">
                        <h3>Patients</h3>
                        <p className="stat-number">{stats.totalPatients}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon appointment-icon">📅</div>
                    <div className="stat-content">
                        <h3>Appointments</h3>
                        <p className="stat-number">{stats.totalAppointments}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue-icon">💰</div>
                    <div className="stat-content">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">${stats.revenueStats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Optional: Add more stat cards for other roles if needed */}
                <div className="stat-card">
                    <div className="stat-icon pharmacist-icon">💊</div>
                    <div className="stat-content">
                        <h3>Pharmacists</h3>
                        <p className="stat-number">{stats.totalPharmacists}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon admin-icon">👨‍💼</div>
                    <div className="stat-content">
                        <h3>Admins</h3>
                        <p className="stat-number">{stats.totalAdmins}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="section recent-appointments">
                    <div className="section-header">
                        <h2>Recent Appointments</h2>
                        <Link to="/admin/appointments" className="view-all">View All</Link>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient ID</th>
                                    <th>Doctor ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAppointments.map((appt, index) => (
                                    <tr key={index}>
                                        <td>{appt.patientId?.patientId || 'N/A'}</td>
                                        <td>{appt.doctorId?.doctorId || 'N/A'}</td>
                                        <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusColor(appt.appointmentStatus)}`}>
                                                {appt.appointmentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="section quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/admin/users/create" className="action-card">
                            <div className="action-icon">➕</div>
                            <h3>Add New User</h3>
                            <p>Create new user account</p>
                        </Link>


                        <Link to="/admin/settings" className="action-card">
                            <div className="action-icon">⚙️</div>
                            <h3>System Settings</h3>
                            <p>Configure system</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;