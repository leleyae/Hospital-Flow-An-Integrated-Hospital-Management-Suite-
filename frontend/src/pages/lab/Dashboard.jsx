
import { Routes, Route } from 'react-router-dom';
import GetDashboard from './LabDashboard';
// import TestManagement from './LabDashboard.jsx';
// import Equipment from './Equipment';
// import Results from './Results';
// import QualityControl from './QualityControl';
// import Samples from './Samples';
import ProtectedRoute from '../../components/ProtectedRoute';


const LabDashboard = () => {
    return (
        <Routes element={<ProtectedRoute />}>
            <Route path="/" element={<GetDashboard />} />
            {/* <Route path="/tests" element={<TestManagement />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/quality-control" element={<QualityControl />} />
            <Route path="/samples" element={<Samples />} /> */}
        </Routes>
    );
};

export default LabDashboard;