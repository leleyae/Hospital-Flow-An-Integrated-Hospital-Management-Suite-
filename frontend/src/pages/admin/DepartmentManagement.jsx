import React, { useState, useEffect } from 'react';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [newDepartment, setNewDepartment] = useState({
        departmentName: '',
        description: '',
        totalBeds: 0,
        contactNumber: '',
        location: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/departments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setDepartments(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching departments:', error);
            setLoading(false);
        }
    };

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/departments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDepartment)
            });

            if (response.ok) {
                setShowCreateModal(false);
                setNewDepartment({
                    departmentName: '',
                    description: '',
                    totalBeds: 0,
                    contactNumber: '',
                    location: ''
                });
                fetchDepartments();
            }
        } catch (error) {
            console.error('Error creating department:', error);
        }
    };

    const handleUpdateDepartment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/departments/${currentDepartment._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentDepartment)
            });

            if (response.ok) {
                setShowEditModal(false);
                setCurrentDepartment(null);
                fetchDepartments();
            }
        } catch (error) {
            console.error('Error updating department:', error);
        }
    };

    const calculateUtilization = (dept) => {
        if (dept.totalBeds === 0) return 0;
        return Math.round((dept.occupiedBeds / dept.totalBeds) * 100);
    };

    if (loading) {
        return <div className="loading">Loading departments...</div>;
    }

    return (
        <div className="department-management">
            <div className="page-header">
                <h1 className="page-title">Department Management</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    ➕ Add Department
                </button>
            </div>

            <div className="departments-grid">
                {departments.map((dept) => (
                    <div key={dept._id} className="department-card">
                        <div className="department-header">
                            <h3>{dept.departmentName}</h3>
                            <span className={`status-badge ${dept.isActive ? 'status-active' : 'status-inactive'}`}>
                                {dept.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <p className="department-description">{dept.description}</p>

                        <div className="department-stats">
                            <div className="stat">
                                <span className="stat-label">Total Beds:</span>
                                <span className="stat-value">{dept.totalBeds}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Occupied:</span>
                                <span className="stat-value">{dept.occupiedBeds}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Utilization:</span>
                                <span className={`stat-value ${calculateUtilization(dept) > 80 ? 'high-utilization' : ''}`}>
                                    {calculateUtilization(dept)}%
                                </span>
                            </div>
                        </div>

                        <div className="department-info">
                            {dept.contactNumber && (
                                <div className="info-item">
                                    <span className="info-label">📞</span>
                                    <span>{dept.contactNumber}</span>
                                </div>
                            )}
                            {dept.location && (
                                <div className="info-item">
                                    <span className="info-label">📍</span>
                                    <span>{dept.location}</span>
                                </div>
                            )}
                            {dept.departmentHead && (
                                <div className="info-item">
                                    <span className="info-label">👨‍⚕️</span>
                                    <span>Head: {dept.departmentHead.doctorId}</span>
                                </div>
                            )}
                        </div>

                        <div className="department-actions">
                            <button
                                className="btn-secondary btn-sm"
                                onClick={() => {
                                    setCurrentDepartment(dept);
                                    setShowEditModal(true);
                                }}
                            >
                                Edit
                            </button>
                            <button className="btn-primary btn-sm">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Department Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Create New Department</h3>
                            <button
                                className="close-modal"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateDepartment}>
                            <div className="form-group">
                                <label>Department Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newDepartment.departmentName}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, departmentName: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newDepartment.description}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Total Beds</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newDepartment.totalBeds}
                                        onChange={(e) => setNewDepartment({ ...newDepartment, totalBeds: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Number</label>
                                    <input
                                        type="tel"
                                        value={newDepartment.contactNumber}
                                        onChange={(e) => setNewDepartment({ ...newDepartment, contactNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={newDepartment.location}
                                    onChange={(e) => setNewDepartment({ ...newDepartment, location: e.target.value })}
                                />
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
                                    Create Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Department Modal */}
            {showEditModal && currentDepartment && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Edit Department</h3>
                            <button
                                className="close-modal"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleUpdateDepartment}>
                            <div className="form-group">
                                <label>Department Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={currentDepartment.departmentName}
                                    onChange={(e) => setCurrentDepartment({ ...currentDepartment, departmentName: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={currentDepartment.description}
                                    onChange={(e) => setCurrentDepartment({ ...currentDepartment, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Total Beds</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={currentDepartment.totalBeds}
                                        onChange={(e) => setCurrentDepartment({ ...currentDepartment, totalBeds: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Occupied Beds</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={currentDepartment.occupiedBeds}
                                        onChange={(e) => setCurrentDepartment({ ...currentDepartment, occupiedBeds: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Contact Number</label>
                                <input
                                    type="tel"
                                    value={currentDepartment.contactNumber}
                                    onChange={(e) => setCurrentDepartment({ ...currentDepartment, contactNumber: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={currentDepartment.location}
                                    onChange={(e) => setCurrentDepartment({ ...currentDepartment, location: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={currentDepartment.isActive}
                                        onChange={(e) => setCurrentDepartment({ ...currentDepartment, isActive: e.target.checked })}
                                    />
                                    Active Department
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Update Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;