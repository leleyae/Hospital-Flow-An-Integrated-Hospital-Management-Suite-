
import { Routes, Route } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import Schedule from './Schedule';
import Patients from './Patients';
import Appointments from './Appointments';
import Prescriptions from './Prescriptions';
import LabOrders from './LabOrders';
import MedicalRecords from './MedicalRecords';
import Telemedicine from './Telemedicine';
import Triage from './Triage';
import ProtectedRoute from '../../components/ProtectedRoute';
import Consultation from './Consultation';
import DoctorAppointmentDetails from './DocAppointemtDetail';
import PatientAppointments from './PatientAppointments';

const DoctorDashboard = () => {
    return (
        <Routes element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/consultation" element={<Consultation />} />


            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/:appointmentId" element={<DoctorAppointmentDetails />} />
            <Route path="/patient-appointments/:patientId" element={<PatientAppointments />} />


            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/lab-orders" element={<LabOrders />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/telemedicine" element={<Telemedicine />} />
            <Route path="/triage" element={<Triage />} />
        </Routes>
    );
};

export default DoctorDashboard;