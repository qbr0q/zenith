import { useState, useCallback } from 'react';
import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_URL;

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
                default:
                    setError('Неверный HTTP метод')
            }
            return response.data;
        } catch (err) {
            let errorMessage = 'Сетевая ошибка или проблема с бэкендом.'
            if (err.response) {
                const errDetail = err.response.data.detail
                errorMessage = `Ошибка ${err.response.status}: ${typeof errDetail == 'string' ? errDetail : errDetail[0].msg}`
            }
            setError(errorMessage)
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);
    return { executeFetch, error, loading }; 
};