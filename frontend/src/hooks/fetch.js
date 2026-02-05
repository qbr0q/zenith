import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config';
import { getErrorMessage, refreshAccessToken } from './utils';
import axios from 'axios';


export const useFetch = () => {
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);

    const executeFetch = useCallback( async (method, endpoint, data=null) => {
        setLoading(true);
        setError(null);
        
        try {
            const url = `${API_BASE_URL}/${endpoint}`;
            let response = null
            
            switch (method){
                case 'get':
                    response = await axios.get(url, {
                        withCredentials: true
                    })
                    break
                case 'post':
                    response = await axios.post(url, data, {
                        withCredentials: true 
                    });
                    break
                case 'delete':
                    response = await axios.delete(url, {
                        data: data,
                        withCredentials: true
                    });
                    break
                default:
                    throw new Error('Неверный HTTP метод')
            }
            return response.data;
        } catch (err) {
            const status = err.response?.status;
            const errorDetail = err.response?.data?.detail;

            if (status === 401) {
                if (errorDetail === "AUTH_REQUIRED" || errorDetail === "TOKEN_EXPIRED") {
                    try {
                        await refreshAccessToken();
                        return await executeFetch(method, endpoint, data);
                    } catch (refreshErr) {
                        const errorMessage = "Сессия истекла, войдите снова";
                        setError(errorMessage);
                        throw new Error(errorMessage);
                    }
                }

                // Случай Б: 401, но это не протухший токен (например, неверный пароль)
                // Мы НЕ выходим из catch, а идем к общей обработке ошибок ниже
            }

            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);
    return { executeFetch, error, loading }; 
};
