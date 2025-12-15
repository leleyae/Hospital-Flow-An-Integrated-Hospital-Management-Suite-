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
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
        </div>
    );
};

export default UserManagement;