// src/pages/admin/UserManagement.js
import React, { useState } from 'react';
import { Users, UserPlus, Search, Filter, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const users = [
        {
            id: 1,
            name: 'John Smith',
            email: 'john@example.com',
            role: 'patient',
            status: 'active',
            lastLogin: '2024-01-15 09:30',
            department: 'N/A'
        },
        {
            id: 2,
            name: 'Dr. Sarah Johnson',
            email: 'sarah@hospital.com',
            role: 'doctor',
            status: 'active',
            lastLogin: '2024-01-15 08:45',
            department: 'Cardiology'
        },
        {
            id: 3,
            name: 'Nurse Emma Wilson',
            email: 'emma@hospital.com',
            role: 'nurse',
            status: 'active',
            lastLogin: '2024-01-14 14:20',
            department: 'Emergency'
        },
        {
            id: 4,
            name: 'Pharmacist Mike Chen',
            email: 'mike@hospital.com',
            role: 'pharmacist',
            status: 'inactive',
            lastLogin: '2024-01-10 11:15',
            department: 'Pharmacy'
        }
    ];

    const roleColors = {
        admin: 'bg-red-100 text-red-800',
        doctor: 'bg-blue-100 text-blue-800',
        nurse: 'bg-green-100 text-green-800',
        pharmacist: 'bg-purple-100 text-purple-800',
        receptionist: 'bg-yellow-100 text-yellow-800',
        patient: 'bg-gray-100 text-gray-800',
        lab_technician: 'bg-indigo-100 text-indigo-800'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-gray-600">Manage system users and permissions</p>
                </div>
                <button className="mt-4 md:mt-0 btn-primary flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-2xl font-bold">1,248</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Active Users</p>
                            <p className="text-2xl font-bold">1,156</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Staff Members</p>
                            <p className="text-2xl font-bold">92</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <XCircle className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Inactive Users</p>
                            <p className="text-2xl font-bold">92</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        className="input-field pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select className="input-field">
                        <option>All Roles</option>
                        <option>Doctor</option>
                        <option>Nurse</option>
                        <option>Pharmacist</option>
                        <option>Patient</option>
                        <option>Admin</option>
                    </select>
                    <select className="input-field">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Suspended</option>
                    </select>
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <Users className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[user.role] || 'bg-gray-100'}`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td>{user.department}</td>
                                <td>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                            }`} />
                                        <span className={`font-medium ${user.status === 'active' ? 'text-green-700' : 'text-gray-700'
                                            }`}>
                                            {user.status.toUpperCase()}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="text-sm text-gray-900">{user.lastLogin}</div>
                                </td>
                                <td>
                                    <div className="flex space-x-2">
                                        <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Role Summary */}
            <div className="card">
                <h2 className="text-xl font-bold mb-4">User Role Distribution</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(roleColors).map(([role, colorClass]) => (
                        <div key={role} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-lg ${colorClass}`}>
                                    <Users className="w-5 h-5" />
                                </div>
                                <div className="ml-3">
                                    <p className="font-bold text-lg">156</p>
                                    <p className="text-sm text-gray-600">{role.toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;