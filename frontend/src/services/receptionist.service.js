import api from "../config/api";


const receptionistService = {
  // Register a new patient (creates User + Patient records)
  async registerPatient(patientData) {
    try {

      const userResponse = await api.post('/patients/register', {
        username: patientData.email || `${patientData.firstName.toLowerCase()}.${patientData.lastName.toLowerCase()}`,
        email: patientData.email,
        password: 'Welcome123', // Default password, can be changed
        role: 'patient',
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        phoneNumber: patientData.phone,
        dateOfBirth: patientData.dateOfBirth,
        address: {
          street: patientData.address,
          city: patientData.city,
          state: patientData.state,
          zipCode: patientData.zipCode,
          country: 'USA' // Default
        }
      });
      // Then create the Patient record with userId
      const patientResponse = await api.post('/patients', {
        userId: userResponse.data._id,
        patientId: `PAT${Date.now()}${Math.floor(Math.random() * 1000)}`, // Generate unique ID
        bloodGroup: patientData.bloodGroup,
        height: patientData.height,
        weight: patientData.weight,
        emergencyContact: {
          name: patientData.emergencyContact.name,
          relationship: patientData.emergencyContact.relationship,
          phoneNumber: patientData.emergencyContact.phone
        },
        insuranceProvider: {
          company: patientData.insuranceProvider,
          policyNumber: patientData.policyNumber
        },
        medicalConditions: patientData.medicalConditions ? [{
          condition: patientData.medicalConditions,
          diagnosedDate: new Date(),
          status: 'Active'
        }] : [],
        allergies: patientData.allergies ? [{
          allergen: patientData.allergies,
          reaction: 'Not specified',
          severity: 'Medium'
        }] : []
      });

      return { user: userResponse.data, patient: patientResponse.data };
    } catch (error) {
      throw error;
    }
  },


  // Get all patients
  async getPatients(search = '') {
    const response = await api.get(`/patients${search ? `?search=${search}` : ''}`);
    return response.data;
  },
  getDashboardStats: async () => {
    return await api.get('/receptionist/dashboard/stats');
  },
  // Update appointment status (for appointment details page)
  updateAppointmentStatus: async (id, data) => {
    return await api.patch(`/receptionist/appointments/${id}/status`, data);
  },

  // Get appointments with filters
  getAppointments: async (filters = {}) => {
    return await api.get('/receptionist/appointments', { params: filters });
  },

  // For search functionality in appointment scheduling
  searchPatients: async (searchTerm) => {
    return await api.get('/receptionist/patients', { params: { search: searchTerm } });
  },

  // Get patient by ID
  async getPatient(id) {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Update patient
  async updatePatient(id, data) {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  // Get available doctors
  async getDoctors() {
    const response = await api.get('/doctors/available');
    return response.data;
  },



  // Get today's appointments
  async getTodayAppointments() {
    const response = await api.get('/appointments/today');
    return response.data;
  },
  getAllPatients: async () => {
    return await api.get('/patients');
  },

  // Delete patient
  deletePatient: async (patientId) => {
    return await api.delete(`/patients/${patientId}`);
  },

  // Get patient by ID
  getPatientById: async (patientId) => {
    return await api.get(`/receptionist/patients/${patientId}`);
  }
  ,
  updatePatient: async (id, data) => {
    return await api.put(`/receptionist/patients/${id}`, data);
  },

  deletePatient: async (id) => {
    return await api.delete(`/receptionist/patients/${id}`);
  },

  // Doctor endpoints
  getAllDoctors: async () => {
    return await api.get('/receptionist/doctors');
  },

  getDoctorById: async (id) => {
    return await api.get(`/receptionist/doctors/${id}`);
  },

  // Appointment endpoints
  scheduleAppointment: async (data) => {
    return await api.post('/receptionist/appointments', data);
  },

  getAllAppointments: async (params = {}) => {
    return await api.get('/receptionist/appointments', { params });
  },

  getAppointmentById: async (id) => {
    return await api.get(`/receptionist/appointments/${id}`);
  },

  updateAppointment: async (id, data) => {
    return await api.put(`/receptionist/appointments/${id}`, data);
  },

  deleteAppointment: async (id) => {
    return await api.delete(`/receptionist/appointments/${id}`);
  }


  // Update patient
};

export default receptionistService;