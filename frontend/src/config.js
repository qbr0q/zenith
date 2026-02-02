const getBaseUrl = () => {
    const currentHost = window.location.hostname;
    return `http://${currentHost}:8080`;
};

export const BASE_URL = getBaseUrl();
export const API_BASE_URL = BASE_URL + '/api'
export const MEDIA_BASE_URL = BASE_URL + '/media'