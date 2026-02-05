import { API_BASE_URL } from '../config';
import axios from 'axios';


export const getErrorMessage = (err) => {
    if (typeof err === 'string') return err;
    if (err.response?.data?.detail) {
        const detail = err.response.data.detail;

        const message = typeof detail === 'string'
            ? detail
            : (Array.isArray(detail) ? detail[0]?.msg : 'Некорректные данные');

        return `Ошибка ${err.response.status}: ${message}`;
    }
    return 'Сетевая ошибка или проблема с бэкендом.';
};

export const refreshAccessToken = async () => {
    const url = `${API_BASE_URL}/auth/refresh_token`;
    await axios.post(url, {}, {withCredentials: true})
}
