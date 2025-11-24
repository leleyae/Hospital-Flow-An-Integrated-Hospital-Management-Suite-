import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import PatientRegistration from './PatientRegistration';
import Billing from './Billing';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppointmentScheduling from './AppointmentScheduling';
import PatientList from './List';
import AppointmentList from './Appointments';
import AppointmentDetails from './AppointmentDetails';

const ReceptionistDashboard = () => {
    return (
        <Routes element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/patient-registration" element={<PatientRegistration />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/list" element={<PatientList />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/appointments/:id" element={<AppointmentDetails />} />
            <Route path="/appointments/:id/edit" element={<AppointmentDetails />} />



            <Route path="/appointment-scheduling" element={<AppointmentScheduling />} />
        </Routes>
    );
};

export default ReceptionistDashboard;