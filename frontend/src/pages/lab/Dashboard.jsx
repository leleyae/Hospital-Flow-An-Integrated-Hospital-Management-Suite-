
import { Routes, Route } from 'react-router-dom';
// import TestManagement from './LabDashboard.jsx';
// import Equipment from './Equipment';
// import Results from './Results';
// import QualityControl from './QualityControl';
// import Samples from './Samples';
import ProtectedRoute from '../../components/ProtectedRoute';
import LabTechnicianDashboard from './LabDashboard';
import LabTestList from './LabTest';
import LabTestDetail from './LabTestDetail';
import AddTestResults from './AddTestResults';


const LabDashboard = () => {
    return (
        <Routes element={<ProtectedRoute />}>
            <Route path="/" element={<LabTechnicianDashboard />} />
            <Route path="/lab" element={<LabTestList />} />
            <Route path="/lab/:id" element={<LabTestDetail />} />
            <Route path="/lab/:id/results/add" element={<AddTestResults />} />
        </Routes>
    );
};

export default LabDashboard;