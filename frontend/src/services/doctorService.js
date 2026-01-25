import axiosInstance from '../utils/axiosConfig';

const doctorService = {
    // ===== Dashboard & Profile =====
    // Get doctor's dashboard data
    async getDashboardData() {
        try {
            const response = await axiosInstance.get('/doctors/me/dashboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    },

    // Get doctor profile
    async getProfile() {
        try {
            const response = await axiosInstance.get('/doctors/me');
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor profile:', error);
            throw error;
        }
    },

    // Update doctor profile
    async updateProfile(data) {
        try {
            const response = await axiosInstance.put('/doctors/me', data);
            return response.data;
        } catch (error) {
            console.error('Error updating doctor profile:', error);
            throw error;
        }
    },

    // ===== Appointments =====
    // Get today's appointments for doctor
    async getTodayAppointments() {
        try {
            const response = await axiosInstance.get('/doctors/me/appointments/today');
            return response.data;
        } catch (error) {
            console.error('Error fetching today appointments:', error);
            throw error;
        }
    },

    // Get upcoming appointments
    async getUpcomingAppointments(params) {
        try {
            const response = await axiosInstance.get('/doctors/me/appointments', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching upcoming appointments:', error);
            throw error;
        }
    },

    // Get all appointments with filters
    async getAppointments(params) {
        try {
            const response = await axiosInstance.get('/doctors/me/appointments', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    // Get appointment by ID
    async getAppointment(appointmentId) {
        try {
            const response = await axiosInstance.get(`/appointments/${appointmentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching appointment:', error);
            throw error;
        }
    },

    // Update appointment status
    async updateAppointmentStatus(appointmentId, status) {
        try {
            const response = await axiosInstance.put(`/appointments/${appointmentId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating appointment status:', error);
            throw error;
        }
    },

    // ===== Patient Management =====
    // Get patient information for appointment
    async getPatientInfo(appointmentId) {
        try {
            // First get appointment to get patientId
            const appointment = await this.getAppointment(appointmentId);
            // Then get patient details
            const response = await axiosInstance.get(`/patients/${appointment.patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching patient info:', error);
            throw error;
        }
    },
    getPatientById: async (patientId) => {
        const response = await axiosInstance.get(`/doctor/patients/${patientId}`);
        return response.data.data;
    },

    getPatientAppointments: async (patientId) => {
        const response = await axiosInstance.get(`/doctor/patients/${patientId}/appointments`);
        return response.data;
    },

    // Get patients list
    async getPatients(params) {
        try {
            const response = await axiosInstance.get('/doctors/me/patients', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    },

    // Get patient details
    async getPatientDetails(patientId) {
        try {
            const response = await axiosInstance.get(`/patients/${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching patient details:', error);
            throw error;
        }
    },

    // Get patient medical history
    async getMedicalHistory(patientId) {
        try {
            const response = await axiosInstance.get(`/medical-records/patient/${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching medical history:', error);
            throw error;
        }
    },

    // ===== Consultation =====
    // Update consultation notes
    async updateConsultation(appointmentId, notes) {
        try {
            const response = await axiosInstance.put(`/appointments/${appointmentId}/consultation`, {
                consultationNotes: notes
            });
            return response.data;
        } catch (error) {
            console.error('Error updating consultation:', error);
            throw error;
        }
    },

    // Complete consultation
    async completeConsultation(appointmentId) {
        try {
            const response = await axiosInstance.put(`/appointments/${appointmentId}/complete`);
            return response.data;
        } catch (error) {
            console.error('Error completing consultation:', error);
            throw error;
        }
    },

    // ===== Lab Tests =====
    // Order lab test
    async orderLabTest(labTestData) {
        try {
            const response = await axiosInstance.post('/lab-tests', labTestData);
            return response.data;
        } catch (error) {
            console.error('Error ordering lab test:', error);
            throw error;
        }
    },

    // Get lab tests for appointment
    async getLabTests(appointmentId) {
        try {
            const response = await axiosInstance.get('/lab-tests', {
                params: { appointmentId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching lab tests:', error);
            throw error;
        }
    },

    // Get lab test results
    async getLabResults(testId) {
        try {
            const response = await axiosInstance.get(`/lab-tests/${testId}/results`);
            return response.data;
        } catch (error) {
            console.error('Error fetching lab results:', error);
            throw error;
        }
    },

    // ===== Prescriptions =====
    // Create prescription
    async createPrescription(prescriptionData) {
        try {
            const response = await axiosInstance.post('/prescriptions', prescriptionData);
            return response.data;
        } catch (error) {
            console.error('Error creating prescription:', error);
            throw error;
        }
    },

    // Get prescription history for patient
    async getPrescriptionHistory(patientId) {
        try {
            const response = await axiosInstance.get('/prescriptions', {
                params: { patientId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching prescription history:', error);
            throw error;
        }
    },

    // Get all prescriptions
    async getPrescriptions(params) {
        try {
            const response = await axiosInstance.get('/prescriptions', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            throw error;
        }
    },

    // ===== Schedule & Availability =====
    // Get doctor's availability
    async getAvailability() {
        try {
            const response = await axiosInstance.get('/doctors/me/availability');
            return response.data;
        } catch (error) {
            console.error('Error fetching availability:', error);
            throw error;
        }
    },

    // Update doctor's availability
    async updateAvailability(availability) {
        try {
            const response = await axiosInstance.put('/doctors/me/availability', { availability });
            return response.data;
        } catch (error) {
            console.error('Error updating availability:', error);
            throw error;
        }
    },

    // Get doctor schedule
    async getSchedule(params) {
        try {
            const response = await axiosInstance.get('/doctors/me/schedule', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching schedule:', error);
            throw error;
        }
    },

    // Update doctor schedule
    async updateSchedule(data) {
        try {
            const response = await axiosInstance.put('/doctors/me/schedule', data);
            return response.data;
        } catch (error) {
            console.error('Error updating schedule:', error);
            throw error;
        }
    },

    // Check availability for specific date/time
    async checkAvailability(date, time) {
        try {
            const response = await axiosInstance.get('/doctors/me/availability/check', {
                params: { date, time }
            });
            return response.data;
        } catch (error) {
            console.error('Error checking availability:', error);
            throw error;
        }
    },

    // ===== Medical Records =====
    // Create medical record
    async createMedicalRecord(data) {
        try {
            const response = await axiosInstance.post('/medical-records', data);
            return response.data;
        } catch (error) {
            console.error('Error creating medical record:', error);
            throw error;
        }
    },

    // Get medical records for patient
    async getMedicalRecords(patientId) {
        try {
            const response = await axiosInstance.get(`/medical-records/patient/${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching medical records:', error);
            throw error;
        }
    }
};

export default doctorService;