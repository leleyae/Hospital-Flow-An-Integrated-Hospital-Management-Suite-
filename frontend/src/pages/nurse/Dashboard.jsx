
import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import CheckupDashboard from './CheckupDashboard';
import Medication from './Medication';
import Emergency from './Emergency';
import VitalSigns from './VitalSigns';
import BedManagement from './BedManagement';
import ProtectedRoute from '../../components/ProtectedRoute';
const NurseDashboard = () => {
    return (
        <Routes element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/checkup" element={<CheckupDashboard />} />
            <Route path="/medication" element={<Medication />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/vital-signs" element={<VitalSigns />} />
            <Route path="/bed-management" element={<BedManagement />} />
        </Routes>
    );
};

export default NurseDashboard;