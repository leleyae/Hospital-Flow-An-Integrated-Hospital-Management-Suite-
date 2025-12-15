// src/pages/patient/Profile.js
import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Droplets, Scale, Heart, Edit, Save, Camera } from 'lucide-react';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (234) 567-8900',
        dateOfBirth: '1985-06-15',
        address: '123 Main St, New York, NY 10001',
        emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1 (234) 567-8901'
        },
        medicalInfo: {
            bloodGroup: 'A+',
            height: 175,
            weight: 72,
            allergies: ['Penicillin', 'Peanuts'],
            conditions: ['Hypertension', 'Type 2 Diabetes']
        }
    });

    const handleSave = () => {
        setIsEditing(false);
        // Save profile logic here
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p className="text-gray-600">Manage your personal and medical information</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="btn-primary flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-primary flex items-center"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6">Personal Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                                        <User className="w-5 h-5 text-gray-400 mr-3" />
                                        <span>{profile.firstName}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                                        <User className="w-5 h-5 text-gray-400 mr-3" />
                                        <span>{profile.lastName}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                        <span>{profile.email}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                        <span>{profile.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Date of Birth
                                </label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={profile.dateOfBirth}
                                        onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                        <span>{profile.dateOfBirth}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                                        <span>{profile.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6">Emergency Contact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.emergencyContact.name}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            emergencyContact: { ...profile.emergencyContact, name: e.target.value }
                                        })}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="p-2 border border-gray-200 rounded-lg">
                                        {profile.emergencyContact.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Relationship
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profile.emergencyContact.relationship}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            emergencyContact: { ...profile.emergencyContact, relationship: e.target.value }
                                        })}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="p-2 border border-gray-200 rounded-lg">
                                        {profile.emergencyContact.relationship}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={profile.emergencyContact.phone}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            emergencyContact: { ...profile.emergencyContact, phone: e.target.value }
                                        })}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="p-2 border border-gray-200 rounded-lg">
                                        {profile.emergencyContact.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6">Medical Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Blood Group
                                </label>
                                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <Droplets className="w-5 h-5 text-red-600 mr-3" />
                                    <span className="font-bold text-red-700">{profile.medicalInfo.bloodGroup}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Height
                                    </label>
                                    <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <Scale className="w-5 h-5 text-blue-600 mr-3" />
                                        <span>{profile.medicalInfo.height} cm</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Weight
                                    </label>
                                    <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <Scale className="w-5 h-5 text-blue-600 mr-3" />
                                        <span>{profile.medicalInfo.weight} kg</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                    BMI
                                </label>
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold">23.5</span>
                                        <span className="text-lg text-green-700">Normal</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Allergies */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Allergies</h2>
                        <div className="space-y-2">
                            {profile.medicalInfo.allergies.map((allergy, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Heart className="w-4 h-4 text-red-500 mr-2" />
                                        <span>{allergy}</span>
                                    </div>
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Severe</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4">Medical Conditions</h2>
                        <div className="space-y-2">
                            {profile.medicalInfo.conditions.map((condition, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Heart className="w-4 h-4 text-blue-500 mr-2" />
                                        <span>{condition}</span>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Managed</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Insurance Information */}
            <div className="card">
                <h2 className="text-xl font-bold mb-6">Insurance Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Insurance Provider
                        </label>
                        <div className="p-3 border border-gray-200 rounded-lg">
                            Blue Cross Blue Shield
                        </div>
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Policy Number
                        </label>
                        <div className="p-3 border border-gray-200 rounded-lg">
                            BCBS123456789
                        </div>
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Coverage Type
                        </label>
                        <div className="p-3 border border-gray-200 rounded-lg">
                            Comprehensive
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;