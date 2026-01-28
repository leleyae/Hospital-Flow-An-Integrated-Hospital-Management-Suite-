import { Routes, Route } from 'react-router-dom';
import PharmacyDashboard from './DashboardHome';
// import MedicineList from './MedicineList';
import PharmacyInventory from './PharmacyInventory';
import PrescriptionDispensing from './PrescriptionDispensing';
import OTCSales from './OTCSales';
import AddMedicine from './AddMedicine';
<<<<<<< HEAD
import EditMedicine from './EditMedicine'
=======
import EditMedicine from './EditMedicine';
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd

import ProtectedRoute from '../../components/ProtectedRoute';

const PharmacistDashboard = () => {
    return (
        <Routes element={<ProtectedRoute />}>
            <Route path="/" element={<PharmacyDashboard />} />
            <Route path="/inventory" element={<PharmacyInventory />} />
            {/* <Route path="/pharmacy/inventory" element={<MedicineList />} /> */}
            <Route path="/inventory/add" element={<AddMedicine />} />
            <Route path="/inventory/:id/edit" element={<EditMedicine />} />
            <Route path="/prescriptions" element={<PrescriptionDispensing />} />
            <Route path="/sales/otc" element={<OTCSales />} />
        </Routes>
    );
};

export default PharmacistDashboard;