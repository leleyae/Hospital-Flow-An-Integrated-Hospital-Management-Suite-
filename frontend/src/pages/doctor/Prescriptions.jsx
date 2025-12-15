import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';


const Prescription = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [instructions, setInstructions] = useState('');
    const [patientInfo, setPatientInfo] = useState(null);

    useEffect(() => {
        loadPatientInfo();
    }, [appointmentId]);

    const loadPatientInfo = async () => {
        const data = await doctorService.getPatientInfo(appointmentId);
        setPatientInfo(data);
    };

    const addMedication = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const updateMedication = (index, field, value) => {
        const updated = [...medications];
        updated[index][field] = value;
        setMedications(updated);
    };

    const handleSubmit = async () => {
        await doctorService.createPrescription({
            appointmentId,
            medications,
            instructions,
            date: new Date().toISOString()
        });
        alert('Prescription created!');
        navigate(`/doctor/consultation/${appointmentId}`);
    };

    if (!patientInfo) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create Prescription</h1>

            <div className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Patient Info */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Name:</strong> {patientInfo.name}</p>
                        <p><strong>Age:</strong> {patientInfo.age}</p>
                        <p><strong>Patient ID:</strong> {patientInfo.patientId}</p>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Medications */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Medications</h2>
                        <button
                            onClick={addMedication}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Add Medication
                        </button>
                    </div>

                    {medications.map((med, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 border rounded">
                            <input
                                type="text"
                                placeholder="Medication Name"
                                value={med.name}
                                onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Dosage"
                                value={med.dosage}
                                onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Frequency"
                                value={med.frequency}
                                onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Duration"
                                value={med.duration}
                                onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                                className="p-2 border rounded"
                            />
                        </div>
                    ))}
                </div>

                {/* Instructions */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows="4"
                        className="w-full p-3 border rounded"
                        placeholder="Additional instructions for the patient..."
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save Prescription
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Prescription;