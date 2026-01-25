// src/services/pharmacist.service.js
import axiosInstance from '../utils/axiosConfig';


export const pharmacistService = {
    // INVENTORY
    getAllInventory: async (params = {}) => {
        const response = await axiosInstance.get('/api/pharmacy/inventory', { params });
        return response.data;
    },

    getInventoryItem: async (id) => {
        const response = await axiosInstance.get(`/api/pharmacy/inventory/${id}`);
        return response.data;
    },

    addToInventory: async (data) => {
        const response = await axiosInstance.post('/api/pharmacy/inventory', data);
        return response.data;
    },

    updateInventoryItem: async (id, data) => {
        const response = await axiosInstance.put(`/api/pharmacy/inventory/${id}`, data);
        return response.data;
    },

    deleteInventoryItem: async (id) => {
        const response = await axiosInstance.delete(`/api/pharmacy/inventory/${id}`);
        return response.data;
    },

    updateQuantity: async (id, data) => {
        const response = await axiosInstance.put(`/api/pharmacy/inventory/${id}/quantity`, data);
        return response.data;
    },

    getLowStockItems: async () => {
        const response = await axiosInstance.get('/api/pharmacy/inventory/low-stock');
        return response.data;
    },

    getExpiringSoonItems: async (days = 30) => {
        const response = await axiosInstance.get('/api/pharmacy/inventory/expiring-soon', {
            params: { days }
        });
        return response.data;
    },

    // MEDICINE SEARCH
    searchMedicines: async (query) => {
        const response = await axiosInstance.get('/api/pharmacy/medicines/search', {
            params: { query }
        });
        return response.data;
    },

    getMedicinesByCategory: async (category) => {
        const response = await axiosInstance.get(`/api/pharmacy/medicines/category/${category}`);
        return response.data;
    },

    getMedicinesByManufacturer: async (manufacturer) => {
        const response = await axiosInstance.get(`/api/pharmacy/medicines/manufacturer/${manufacturer}`);
        return response.data;
    },

    // PRESCRIPTIONS
    getPendingPrescriptions: async (urgent = false) => {
        const response = await axiosInstance.get('/api/pharmacy/api/prescriptions/pending', {
            params: { urgent }
        });
        return response.data;
    },

    dispenseMedicine: async (prescriptionId, data) => {
        const response = await axiosInstance.post(`/api/pharmacy/api/prescriptions/${prescriptionId}/dispense`, data);
        return response.data;
    },

    checkStockForPrescription: async (prescriptionId) => {
        const response = await axiosInstance.get(`/api/pharmacy/api/prescriptions/${prescriptionId}/check-stock`);
        return response.data;
    },

    // SUPPLIERS
    getAllSuppliers: async () => {
        const response = await axiosInstance.get('/api/pharmacy/suppliers');
        return response.data;
    },

    addSupplier: async (data) => {
        const response = await axiosInstance.post('/api/pharmacy/suppliers', data);
        return response.data;
    },

    updateSupplier: async (id, data) => {
        const response = await axiosInstance.put(`/api/pharmacy/suppliers/${id}`, data);
        return response.data;
    },

    deleteSupplier: async (id) => {
        const response = await axiosInstance.delete(`/api/pharmacy/suppliers/${id}`);
        return response.data;
    },

    // ORDERS
    getAllOrders: async () => {
        const response = await axiosInstance.get('/api/pharmacy/orders');
        return response.data;
    },

    createOrder: async (data) => {
        const response = await axiosInstance.post('/api/pharmacy/orders', data);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await axiosInstance.put(`/api/pharmacy/orders/${id}`, { status });
        return response.data;
    },

    deleteOrder: async (id) => {
        const response = await axiosInstance.delete(`/api/pharmacy/orders/${id}`);
        return response.data;
    },

    autoReorder: async () => {
        const response = await axiosInstance.post('/api/pharmacy/orders/auto-reorder');
        return response.data;
    },

    getPendingDeliveryOrders: async () => {
        const response = await axiosInstance.get('/api/pharmacy/orders/pending-delivery');
        return response.data;
    },

    // DRUG INFORMATION
    getDrugInformation: async (medicineName) => {
        const response = await axiosInstance.get(`/api/pharmacy/drug-info/${medicineName}`);
        return response.data;
    },

    checkPatientAllergies: async (patientId, medications) => {
        const response = await axiosInstance.post('/api/pharmacy/check-allergies', {
            patientId,
            medications
        });
        return response.data;
    },

    // PRESCRIPTION MANAGEMENT (from prescription controller)
    getAllPrescriptions: async (params = {}) => {
        const response = await axiosInstance.get('/prescriptions', { params });
        return response.data;
    },

    getPrescription: async (id) => {
        const response = await axiosInstance.get(`/api/prescriptions/${id}`);
        return response.data;
    },

    getPatientPrescriptions: async (patientId) => {
        const response = await axiosInstance.get(`/api/prescriptions/patient/${patientId}`);
        return response.data;
    },

    getTodayPrescriptions: async () => {
        const response = await axiosInstance.get('/api/prescriptions/today/new');
        return response.data;
    },

    checkDrugInteractions: async (medications, patientAllergies = []) => {
        const response = await axiosInstance.post('/api/prescriptions/check-interactions', {
            medications,
            patientAllergies
        });
        return response.data;
    },

    printPrescription: async (id) => {
        const response = await axiosInstance.get(`/api/prescriptions/${id}/print`);
        return response.data;
    }
};