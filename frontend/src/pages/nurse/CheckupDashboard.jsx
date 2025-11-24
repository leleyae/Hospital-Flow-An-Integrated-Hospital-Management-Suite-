import { useState, useEffect } from 'react';
import { FaStethoscope, FaHeartbeat, FaThermometerHalf } from 'react-icons/fa';
import nurseService from '../../services/nurse.service';

const CheckupDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [vitals, setVitals] = useState({
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        respiratoryRate: '',
        oxygenSaturation: '',
        height: '',
        weight: ''
    });

    useEffect(() => {
        loadPendingCheckups();
    }, []);

    const loadPendingCheckups = async () => {
        const data = await nurseService.getPendingCheckups();
        setAppointments(data);
    };

    const handleVitalsSubmit = async () => {
        if (!selectedAppointment) return;

        try {
            await nurseService.updateVitals(selectedAppointment.id, vitals);
            alert('Vitals recorded successfully!');
            setSelectedAppointment(null);
            setVitals({
                bloodPressure: '',
                heartRate: '',
                temperature: '',
                respiratoryRate: '',
                oxygenSaturation: '',
                height: '',
                weight: ''
            });
            loadPendingCheckups();
        } catch (error) {
            alert('Failed to record vitals');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Nurse Checkup Dashboard</h1>

            {/* Pending Checkups List */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Pending Checkups</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {appointments.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No pending checkups
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">Patient</th>
                                    <th className="px-6 py-3 text-left">Doctor</th>
                                    <th className="px-6 py-3 text-left">Scheduled Time</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(app => (
                                    <tr key={app.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{app.patientName}</td>
                                        <td className="px-6 py-4">Dr. {app.doctorName}</td>
                                        <td className="px-6 py-4">{new Date(app.appointmentDate).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedAppointment(app)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Take Vitals
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Vitals Form Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">Record Vitals for {selectedAppointment.patientName}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium mb-1">Blood Pressure</label>
                                    <input
                                        type="text"
                                        placeholder="120/80"
                                        value={vitals.bloodPressure}
                                        onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Heart Rate (BPM)</label>
                                    <input
                                        type="number"
                                        placeholder="72"
                                        value={vitals.heartRate}
                                        onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Temperature (°C)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="36.6"
                                        value={vitals.temperature}
                                        onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Height (cm)</label>
                                    <input
                                        type="number"
                                        placeholder="170"
                                        value={vitals.height}
                                        onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        placeholder="65"
                                        value={vitals.weight}
                                        onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setSelectedAppointment(null)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleVitalsSubmit}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Submit Vitals
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckupDashboard;