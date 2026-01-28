
import { Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
=======
import GetDashboard from './LabDashboard';
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
// import TestManagement from './LabDashboard.jsx';
// import Equipment from './Equipment';
// import Results from './Results';
// import QualityControl from './QualityControl';
// import Samples from './Samples';
import ProtectedRoute from '../../components/ProtectedRoute';
<<<<<<< HEAD
import LabTechnicianDashboard from './LabDashboard';
import LabTestList from './LabTest';
import LabTestDetail from './LabTestDetail';
import AddTestResults from './AddTestResults';
=======
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd


const LabDashboard = () => {
    return (
        <Routes element={<ProtectedRoute />}>
<<<<<<< HEAD
            <Route path="/" element={<LabTechnicianDashboard />} />
            <Route path="/lab" element={<LabTestList />} />
            <Route path="/lab/:id" element={<LabTestDetail />} />
            <Route path="/lab/:id/results/add" element={<AddTestResults />} />
=======
            <Route path="/" element={<GetDashboard />} />
            {/* <Route path="/tests" element={<TestManagement />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/quality-control" element={<QualityControl />} />
            <Route path="/samples" element={<Samples />} /> */}
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
        </Routes>
    );
};

export default LabDashboard;