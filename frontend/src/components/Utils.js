import Cookies from 'js-cookie';


const API_BASE_URL = process.env.REACT_APP_API_URL;

export const hasCookie = (name) => {
    const cookies = document.cookie;
    return cookies.includes(`${name}`);
}

export const isUserAuth = () => {
    return hasCookie('access_token=')
}

export const setUser = async (res) => {
    if (res.status === 'success') {
        const response = await fetch(`${API_BASE_URL}account/getUser/${res.userId}`)
        let user = await response.json()
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = "/";
    }
}

export const getUser = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return user
}

export const logOut = () => {
    Cookies.remove('access_token');
    window.location.href = "/";
    localStorage.removeItem('user');
}