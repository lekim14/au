import api from "./api"

export const odysseyService = {
    create: async (form, student) => {
        const response = await api.post('/odyssey/create', { form: form, studentId: student });
        return response.data;
    },

    archive: async (id) => {
        const response = await api.put('/odyssey/archive', { odysseyId: id });
        return response.data;
    },

    get: async (student) => {
        const response = await api.get(`/odyssey/${student}`);
        return response.data
    },

    archives: async (id) => {
        const response = await api.get(`/odyssey/archived/${id}`);
        return response.data
    }

}