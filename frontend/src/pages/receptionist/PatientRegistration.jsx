import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserPlus,
    FaSave,
    FaArrowRight,
    FaArrowLeft,
    FaUser,
    FaHome,
    FaHeartbeat,
    FaFileMedical,
    FaShieldAlt,
    FaClipboardCheck
} from 'react-icons/fa';
import { FiCopy, FiRefreshCw } from 'react-icons/fi';
import { MdEmergency } from 'react-icons/md';
import receptionistService from '../../services/receptionist.service';

const PatientRegistration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        // Personal Info
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        username: '',

        // Address
        address: '',
        city: '',
        state: '',
        zipCode: '',

        // Emergency Contact
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        },

        // Medical Info
        bloodGroup: '',
        height: '',
        weight: '',

        // Insurance
        insuranceProvider: {
            providerName: '',
            policyNumber: '',
            validUntil: ''
        },

        // Medical History
        allergies: '',
        medicalConditions: '',
        familyHistory: ''
    });

    // Validation states
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Steps configuration
    const steps = [
        { number: 1, title: 'Personal Info', icon: <FaUser />, color: 'bg-blue-500' },
        { number: 2, title: 'Address', icon: <FaHome />, color: 'bg-green-500' },
        { number: 3, title: 'Emergency Contact', icon: <MdEmergency />, color: 'bg-red-500' },
        { number: 4, title: 'Medical Info', icon: <FaHeartbeat />, color: 'bg-purple-500' },
        { number: 5, title: 'Insurance', icon: <FaShieldAlt />, color: 'bg-yellow-500' },
        { number: 6, title: 'Medical History', icon: <FaFileMedical />, color: 'bg-pink-500' },
        { number: 7, title: 'Review & Submit', icon: <FaClipboardCheck />, color: 'bg-indigo-500' }
    ];

    // Generate a secure random password
    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setGeneratedPassword(password);
        setShowPassword(true);
    };

    // Copy password to clipboard
    const copyPassword = () => {
        navigator.clipboard.writeText(generatedPassword);
        alert('Password copied to clipboard!');
    };

    // Initialize password on component mount
    useEffect(() => {
        generatePassword();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        // Clear error when field is modified
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleBlur = (field) => {
        setTouched({
            ...touched,
            [field]: true
        });
    };

    // Validate current step
    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1: // Personal Info
                if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
                if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
                if (!formData.gender) newErrors.gender = 'Gender is required';
                if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
                if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
                if (!formData.email.trim()) newErrors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
                if (!formData.username.trim()) newErrors.username = 'Username is required';
                break;
            case 2: // Address
                if (!formData.address.trim()) newErrors.address = 'Address is required';
                if (!formData.city.trim()) newErrors.city = 'City is required';
                if (!formData.state.trim()) newErrors.state = 'State is required';
                if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
                break;
            case 3: // Emergency Contact
                if (!formData.emergencyContact.name.trim()) newErrors['emergencyContact.name'] = 'Contact name is required';
                if (!formData.emergencyContact.relationship) newErrors['emergencyContact.relationship'] = 'Relationship is required';
                if (!formData.emergencyContact.phone.trim()) newErrors['emergencyContact.phone'] = 'Phone number is required';
                break;
            case 4: // Medical Info
                if (formData.height && (formData.height < 30 || formData.height > 250)) newErrors.height = 'Height must be between 30-250 cm';
                if (formData.weight && (formData.weight < 2 || formData.weight > 300)) newErrors.weight = 'Weight must be between 2-300 kg';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        setLoading(true);

        try {
            // Prepare the data for API
            const patientData = {
                ...formData,
                password: generatedPassword,
                emergencyContact: {
                    name: formData.emergencyContact.name,
                    relationship: formData.emergencyContact.relationship,
                    phoneNumber: formData.emergencyContact.phone
                },
                insuranceProvider: {
                    providerName: formData.insuranceProvider.providerName,
                    policyNumber: formData.insuranceProvider.policyNumber,
                    validUntil: formData.insuranceProvider.validUntil || null
                },
                medicalConditions: formData.medicalConditions ? formData.medicalConditions.split('\n').filter(c => c.trim()) : [],
                allergies: formData.allergies ? formData.allergies.split('\n').filter(a => a.trim()) : [],
                familyHistory: formData.familyHistory ? formData.familyHistory.split('\n').filter(f => f.trim()) : []
            };

            // Register the patient
            const result = await receptionistService.registerPatient(patientData);

            // Show success modal with patient ID and password
            alert(
                `✅ Patient Registered Successfully!\n\n` +
                `Patient ID: ${result.data.patient.patientId}\n` +
                `Username: ${result.data.patient.userDetails.username}\n` +
                `Password: ${generatedPassword}\n\n` +
                `Please provide these credentials to the patient.`
            );

            // Ask if they want to schedule appointment
            const scheduleAppointment = window.confirm(
                'Would you like to schedule an appointment for this patient now?'
            );

            if (scheduleAppointment) {
                // Navigate to appointment scheduling with patient ID
                navigate(`/receptionist/schedule-appointment?patientId=${result.data.patient.patientId}`);
            } else {
                // Reset form and go back to step 1
                setFormData({
                    firstName: '',
                    lastName: '',
                    gender: '',
                    dateOfBirth: '',
                    phone: '',
                    email: '',
                    username: '',
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    emergencyContact: {
                        name: '',
                        relationship: '',
                        phone: ''
                    },
                    bloodGroup: '',
                    height: '',
                    weight: '',
                    insuranceProvider: {
                        providerName: '',
                        policyNumber: '',
                        validUntil: ''
                    },
                    allergies: '',
                    medicalConditions: '',
                    familyHistory: ''
                });
                setCurrentStep(1);
                generatePassword(); // Generate new password for next patient
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message;
            alert(`❌ Registration failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-700">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('firstName')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('lastName')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender *
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('gender')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth *
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('dateOfBirth')}
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('phone')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('email')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="patient@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('username')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="john.doe"
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Auto-generated Password
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={generatedPassword}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={copyPassword}
                                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                        title="Copy password"
                                    >
                                        <FiCopy />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                        title="Generate new password"
                                    >
                                        <FiRefreshCw />
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Password will be auto-generated and provided to the patient
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-green-700">Address Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('address')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('city')}
                                        required
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('state')}
                                        required
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.state ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('zipCode')}
                                        required
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-red-700">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Name *
                                </label>
                                <input
                                    type="text"
                                    name="emergencyContact.name"
                                    value={formData.emergencyContact.name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('emergencyContact.name')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${errors['emergencyContact.name'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors['emergencyContact.name'] && <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.name']}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Relationship *
                                </label>
                                <select
                                    name="emergencyContact.relationship"
                                    value={formData.emergencyContact.relationship}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('emergencyContact.relationship')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${errors['emergencyContact.relationship'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select Relationship</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Child">Child</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Friend">Friend</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors['emergencyContact.relationship'] && <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.relationship']}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="emergencyContact.phone"
                                    value={formData.emergencyContact.phone}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('emergencyContact.phone')}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${errors['emergencyContact.phone'] ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors['emergencyContact.phone'] && <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.phone']}</p>}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-700">Medical Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Blood Group
                                </label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Height (cm)
                                </label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('height')}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.height ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="170"
                                    min="30"
                                    max="250"
                                />
                                {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('weight')}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.weight ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="70"
                                    min="2"
                                    max="300"
                                />
                                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-yellow-700">Insurance Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Insurance Provider
                                </label>
                                <input
                                    type="text"
                                    name="insuranceProvider.providerName"
                                    value={formData.insuranceProvider.providerName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="e.g., Blue Cross, Aetna"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Policy Number
                                </label>
                                <input
                                    type="text"
                                    name="insuranceProvider.policyNumber"
                                    value={formData.insuranceProvider.policyNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="POL-XXXXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valid Until
                                </label>
                                <input
                                    type="date"
                                    name="insuranceProvider.validUntil"
                                    value={formData.insuranceProvider.validUntil}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-pink-700">Medical History</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Allergies
                                </label>
                                <textarea
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="List any allergies (one per line):
Penicillin
Peanuts
Dust"
                                />
                                <p className="mt-1 text-xs text-gray-500">Enter one allergy per line</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Medical Conditions
                                </label>
                                <textarea
                                    name="medicalConditions"
                                    value={formData.medicalConditions}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="List any existing conditions (one per line):
Hypertension
Diabetes Type 2
Asthma"
                                />
                                <p className="mt-1 text-xs text-gray-500">Enter one condition per line</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Family History
                                </label>
                                <textarea
                                    name="familyHistory"
                                    value={formData.familyHistory}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="List family medical history (one per line):
Father - Heart Disease (Age 55)
Mother - Diabetes (Age 60)"
                                />
                                <p className="mt-1 text-xs text-gray-500">Enter one history item per line</p>
                            </div>
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-indigo-700">Review & Submit</h3>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700">Personal Information</h4>
                                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                                    <p><strong>Gender:</strong> {formData.gender}</p>
                                    <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                                    <p><strong>Phone:</strong> {formData.phone}</p>
                                    <p><strong>Email:</strong> {formData.email}</p>
                                    <p><strong>Username:</strong> {formData.username}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700">Address</h4>
                                    <p>{formData.address}</p>
                                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700">Emergency Contact</h4>
                                    <p><strong>Name:</strong> {formData.emergencyContact.name}</p>
                                    <p><strong>Relationship:</strong> {formData.emergencyContact.relationship}</p>
                                    <p><strong>Phone:</strong> {formData.emergencyContact.phone}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700">Medical Info</h4>
                                    <p><strong>Blood Group:</strong> {formData.bloodGroup || 'Not specified'}</p>
                                    <p><strong>Height:</strong> {formData.height || 'Not specified'} cm</p>
                                    <p><strong>Weight:</strong> {formData.weight || 'Not specified'} kg</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700">Insurance</h4>
                                    <p><strong>Provider:</strong> {formData.insuranceProvider.providerName || 'Not specified'}</p>
                                    <p><strong>Policy No:</strong> {formData.insuranceProvider.policyNumber || 'Not specified'}</p>
                                    {formData.insuranceProvider.validUntil && (
                                        <p><strong>Valid Until:</strong> {formData.insuranceProvider.validUntil}</p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700">Credentials</h4>
                                    <p><strong>Username:</strong> {formData.username}</p>
                                    <p><strong>Password:</strong> {showPassword ? generatedPassword : '••••••••••••'}</p>
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            {showPassword ? 'Hide' : 'Show'} Password
                                        </button>
                                        <button
                                            type="button"
                                            onClick={copyPassword}
                                            className="text-sm text-green-600 hover:text-green-800"
                                        >
                                            Copy Password
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {(formData.allergies || formData.medicalConditions || formData.familyHistory) && (
                                <div className="pt-4 border-t">
                                    <h4 className="font-semibold text-gray-700">Medical History Summary</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                        {formData.allergies && (
                                            <div>
                                                <h5 className="font-medium text-gray-600">Allergies:</h5>
                                                <p className="text-sm">{formData.allergies.split('\n').filter(a => a.trim()).join(', ')}</p>
                                            </div>
                                        )}
                                        {formData.medicalConditions && (
                                            <div>
                                                <h5 className="font-medium text-gray-600">Conditions:</h5>
                                                <p className="text-sm">{formData.medicalConditions.split('\n').filter(c => c.trim()).join(', ')}</p>
                                            </div>
                                        )}
                                        {formData.familyHistory && (
                                            <div>
                                                <h5 className="font-medium text-gray-600">Family History:</h5>
                                                <p className="text-sm">{formData.familyHistory.split('\n').filter(f => f.trim()).join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-700 mb-2">⚠️ Important Notes:</h4>
                            <ul className="text-sm text-blue-600 space-y-1">
                                <li>• Patient will receive auto-generated Patient ID upon registration</li>
                                <li>• Username and password will be provided to the patient</li>
                                <li>• Patient can change their password after first login</li>
                                <li>• All information will be stored securely in the database</li>
                            </ul>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Registration</h1>
                    <p className="text-gray-600">Complete the form below to register a new patient</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step) => (
                            <div key={step.number} className="flex flex-col items-center relative flex-1">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full h-0.5 bg-gray-200 z-0"></div>
                                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${step.number <= currentStep ? step.color : 'bg-gray-300'} text-white font-semibold`}>
                                    {step.number <= currentStep ? step.icon : step.number}
                                </div>
                                <span className={`mt-2 text-sm font-medium ${step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm font-medium text-gray-700">
                            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit}>
                            {renderStep()}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t">
                                <div>
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                            disabled={loading}
                                        >
                                            <FaArrowLeft className="mr-2" />
                                            Previous
                                        </button>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/receptionist')}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>

                                    {currentStep < steps.length ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                            disabled={loading}
                                        >
                                            Next
                                            <FaArrowRight className="ml-2" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Registering...
                                                </>
                                            ) : (
                                                <>
                                                    <FaUserPlus className="mr-2" />
                                                    Register Patient
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>All fields marked with * are required. Patient credentials will be auto-generated.</p>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;