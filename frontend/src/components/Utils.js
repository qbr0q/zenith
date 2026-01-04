import Cookies from 'js-cookie';


const API_BASE_URL = process.env.REACT_APP_API_URL;

export const hasCookie = (name) => {
    return Cookies.get(name)
}

export const isUserAuth = () => {
    return hasCookie('access_token')
}

export const setUser = async (userId) => {
    const response = await fetch(`${API_BASE_URL}account/getUser/${userId}`)
    let user = await response.json()
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = "/";
}

export const getUser = () => {
    let user = null
    if (isUserAuth()) {
        user = JSON.parse(localStorage.getItem('user'))
    }
    return user
}

export const logOut = () => {
    Cookies.remove('access_token');
    window.location.href = "/";
    localStorage.removeItem('user');
}