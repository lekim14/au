import api from "./api"

export const chartService = {
    odysseyChart: async () => {
        const response = await api.get('/odyssey/chart');
        return response.data
    },

    consultationChart: async () => {
        const response = await api.get('/chart/consultations');
        return response.data;
    },

    adviserConsultationChart: async (id) => {
        const response = await api.get(`/chart/consultations/${id}`);
        return response.data;
    },

    attendanceChart: async (id, start, end, classItem) => {
        const response = await api.get(`/chart/attendance/${id}/${start}/${end}/${classItem}`);
        return response.data;
    }

}