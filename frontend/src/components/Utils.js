import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import { BASE_URL } from '../config';


export const socket = io(BASE_URL, {
    path: "/ws/",
    transports: ["websocket"] 
});

export const hasCookie = (name) => {
    return Cookies.get(name)
}

export const isUserAuth = () => {
    return hasCookie('access_token')
}

export const setUser = (res) => {
    localStorage.setItem('user', JSON.stringify(res));
    window.location.href = "/";
}

export const getUser = () => {
    let user = null
    const isAuth = isUserAuth();

    if (isAuth) {
        user = JSON.parse(localStorage.getItem('user'))
    }
    return user
}

export const logOut = () => {
    Cookies.remove('access_token');
    window.location.href = "/";
    localStorage.removeItem('user');
}

export const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    
    // Разница в миллисекундах
    const diffInMs = now - past;
    
    // Переводим в секунды, минуты и часы
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Логика порогов времени
    if (diffInSeconds < 60) {
        return "только что";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}м`;
    } else if (diffInHours < 24) {
        return `${diffInHours}ч`;
    } else if (diffInDays < 7) {
        return `${diffInDays}д`;
    } else {
        // Если прошло больше недели, просто возвращаем дату
        return past.toLocaleDateString();
    }
};
