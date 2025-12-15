
import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import Appointments from './Appointments';
import MedicalRecords from './MedicalRecords';
import Prescriptions from './Prescriptions';
import Billing from './Billing';
import LabTests from './LabTests';
import Notifications from './Notifications';
import Telemedicine from './Telemedicine';

import ProtectedRoute from '../../components/ProtectedRoute';

const PatientDashboard = () => {
    return (
        <Routes element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/lab-tests" element={<LabTests />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/telemedicine" element={<Telemedicine />} />
        </Routes>
    );
};

export default PatientDashboard;