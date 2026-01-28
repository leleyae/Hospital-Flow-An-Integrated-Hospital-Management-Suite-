<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'patient',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [currentPage, roleFilter, searchTerm]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                role: roleFilter,
                search: searchTerm
            });

            const response = await fetch(`/api/admin/users?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            setUsers(data.users);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/admin/users/${userToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setShowDeleteModal(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                setShowCreateModal(false);
                setNewUser({
                    username: '',
                    email: '',
                    password: '',
                    role: 'patient',
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    dateOfBirth: ''
                });
                fetchUsers();
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            admin: 'role-admin',
            doctor: 'role-doctor',
            patient: 'role-patient',
            nurse: 'role-nurse',
            pharmacist: 'role-pharmacist',
            receptionist: 'role-receptionist',
            lab_technician: 'role-lab'
        };

        return (
            <span className={`role-badge ${roleColors[role] || 'role-default'}`}>
                {role.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    return (
        <div className="user-management">
            <div className="page-header">
                <h1 className="page-title">User Management</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    ➕ Add New User
                </button>
            </div>

            <div className="filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <select
                    className="filter-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                    <option value="nurse">Nurse</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="lab_technician">Lab Technician</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <div className="user-info">
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.firstName} className="user-avatar" />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <strong>{user.firstName} {user.lastName}</strong>
                                            <small>{user.phoneNumber || 'No phone'}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td>
                                    <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            to={`/admin/users/edit/${user._id}`}
                                            className="btn-icon edit-btn"
                                            title="Edit"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            className="btn-icon delete-btn"
                                            onClick={() => {
                                                setUserToDelete(user._id);
                                                setShowDeleteModal(true);
                                            }}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                        {user.role === 'doctor' && (
                                            <Link
                                                to={`/admin/doctors/${user._id}`}
                                                className="btn-icon view-btn"
                                                title="View Doctor Profile"
                                            >
                                                👁️
                                            </Link>
                                        )}
=======
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
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

<<<<<<< HEAD
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    ← Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next →
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-danger"
                                onClick={handleDeleteUser}
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal create-user-modal">
                        <div className="modal-header">
                            <h3>Create New User</h3>
                            <button
                                className="close-modal"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUser.firstName}
                                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUser.lastName}
                                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={newUser.phoneNumber}
                                        onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={newUser.dateOfBirth}
                                        onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Role *</label>
                                <select
                                    required
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="nurse">Nurse</option>
                                    <option value="pharmacist">Pharmacist</option>
                                    <option value="receptionist">Receptionist</option>
                                    <option value="lab_technician">Lab Technician</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
=======
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
>>>>>>> d39be5292d9cea5a7cc1a6e046a51ab2caf0fccd
        </div>
    );
};

export default UserManagement;