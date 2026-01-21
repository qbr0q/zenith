const getBaseUrl = () => {
    const currentHost = window.location.hostname;
    const apiUrl = `http://${currentHost}:8080`;
    return apiUrl
};

export const BASE_URL = getBaseUrl();
export const API_BASE_URL = BASE_URL + '/api'