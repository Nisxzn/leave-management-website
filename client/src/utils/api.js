import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authAPI = {
    login: (credentials) => api.post('/auth.php', credentials),
};

export const employeeAPI = {
    getLeaveHistory: (userId) => api.get(`/employee.php?user_id=${userId}`),
    applyLeave: (leaveData) => api.post('/employee.php', leaveData),
};

export const managerAPI = {
    getAllLeaves: () => api.get('/manager.php'),
    updateLeaveStatus: (data) => api.post('/manager.php', data),
};
