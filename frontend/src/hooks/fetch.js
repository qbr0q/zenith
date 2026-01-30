import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../config';
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
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);
    return { executeFetch, error, loading }; 
};


const getErrorMessage = (err) => {
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