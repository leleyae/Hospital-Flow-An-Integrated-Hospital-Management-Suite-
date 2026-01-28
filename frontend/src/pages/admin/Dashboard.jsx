// src/pages/admin/Dashboard.js
import React from 'react';
<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import UserManagement from './UserManagement';
import DepartmentManagement from './DepartmentManagement';
import SystemSettings from './SystemSettings';
import AuditLogs from './AuditLogs';
import Reports from './Reports';
=======
// import { Routes, Route } from 'react-router-dom';
// import DashboardHome from './DashboardHome';
// import UserManagement from './UserManagement';
// import StaffManagement from './StaffManagement';
// import DepartmentManagement from './DepartmentManagement';
// import SystemSettings from './SystemSettings';
// import AuditLogs from './AuditLogs';
// import Reports from './Reports';
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd

const AdminDashboard = () => {
    return (
        <Routes>
<<<<<<< HEAD
            <Route path="/" element={<DashboardHome />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/departments" element={<DepartmentManagement />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/reports" element={<Reports />} />
=======
            {/* <Route path="/" element={<DashboardHome />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/departments" element={<DepartmentManagement />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/reports" element={<Reports />} /> */}
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
        </Routes>
    );
};

export default AdminDashboard;