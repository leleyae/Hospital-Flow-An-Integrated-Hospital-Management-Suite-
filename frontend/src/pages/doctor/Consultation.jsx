import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import doctorService from '../../services/doctorService';

const Consultation = () => {
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [notes, setNotes] = useState('');
    const [labTestType, setLabTestType] = useState('blood');
    const [testName, setTestName] = useState('');
    const [labTests, setLabTests] = useState([]);

    useEffect(() => {
        loadAppointment();
        loadLabTests();
    }, [appointmentId]);

    const loadAppointment = async () => {
        const data = await doctorService.getAppointment(appointmentId);
        setAppointment(data);
        setNotes(data.consultationNotes || '');
    };

    const loadLabTests = async () => {
        const data = await doctorService.getLabTests(appointmentId);
        setLabTests(data);
    };

    const handleSaveNotes = async () => {
        await doctorService.updateConsultation(appointmentId, notes);
        alert('Notes saved!');
    };

    const handleOrderLabTest = async () => {
        if (!testName) {
            alert('Please enter test name');
            return;
        }

        await doctorService.orderLabTest({
            appointmentId,
            patientId: appointment.patientId,
            testName,
            testType: labTestType,
            priority: 'routine'
        });
        alert('Lab test ordered!');
        loadLabTests();
        setTestName('');
    };

    const handleCompleteConsultation = async () => {
        await doctorService.completeConsultation(appointmentId);
        alert('Consultation completed!');
        window.history.back();
    };

    if (!appointment) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Consultation</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                        <p><strong>Name:</strong> {appointment.patientName}</p>
                        <p><strong>Age:</strong> {appointment.patientAge}</p>
                        <p><strong>Blood Group:</strong> {appointment.patientBloodGroup}</p>

                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Vitals</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <p>BP: {appointment.vitals?.bloodPressure || 'N/A'}</p>
                                <p>HR: {appointment.vitals?.heartRate || 'N/A'} BPM</p>
                                <p>Temp: {appointment.vitals?.temperature || 'N/A'}°C</p>
                                <p>Height: {appointment.vitals?.height || 'N/A'} cm</p>
                                <p>Weight: {appointment.vitals?.weight || 'N/A'} kg</p>
                            </div>
                        </div>
                    </div>

                    {/* Consultation Notes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Consultation Notes</h2>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="8"
                            className="w-full p-3 border rounded"
                            placeholder="Enter consultation notes..."
                        />
                        <button
                            onClick={handleSaveNotes}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save Notes
                        </button>
                    </div>

                    {/* Lab Tests */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Lab Tests</h2>
                        <div className="flex space-x-3 mb-4">
                            <select
                                value={labTestType}
                                onChange={(e) => setLabTestType(e.target.value)}
                                className="p-2 border rounded"
                            >
                                <option value="blood">Blood Test</option>
                                <option value="urine">Urine Test</option>
                                <option value="imaging">Imaging</option>
                                <option value="other">Other</option>
                            </select>
                            <input
                                type="text"
                                value={testName}
                                onChange={(e) => setTestName(e.target.value)}
                                placeholder="Test name"
                                className="flex-1 p-2 border rounded"
                            />
                            <button
                                onClick={handleOrderLabTest}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Order Test
                            </button>
                        </div>

                        {labTests.length > 0 && (
                            <div>
                                <h3 className="font-medium mb-2">Ordered Tests</h3>
                                <ul className="space-y-2">
                                    {labTests.map(test => (
                                        <li key={test.id} className="p-2 border rounded">
                                            {test.testName} - <span className={`px-2 py-1 rounded text-xs ${test.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {test.status}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold mb-4">Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.href = `/doctor/prescribe/${appointmentId}`}
                                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                Write Prescription
                            </button>
                            <button
                                onClick={handleCompleteConsultation}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Complete Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Consultation;