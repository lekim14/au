import api from "./api"

export const semesterService = {
    create: async (semester) => {
        const response = await api.post('/semester/create', semester);
        return response.data;
    },

    status: async (status, id) => {
        const response = await api.put('/semester/status', { status, id });
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/semester');
        return response.data
    }

}