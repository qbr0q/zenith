import { useState } from 'react';
import { useFetch } from '../hooks/fetch';
import { setUser } from '../components/Utils';
import { useSignUpForm } from '../hooks/forms'


function LoginForm() {
    const { executeFetch, error } = useFetch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const openSignUpForm = useSignUpForm()

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let postData = {mail: email, password: password}
        try {
            let res = await executeFetch('post', 'account/login', postData)
            setUser(res.userId)
        } catch (err) {
            console.error(err)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex flex-col w-full gap-3 mb-8">
                <span>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Электронная почта
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="mail@example.com"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 border w-[100%] border-gray-300 
                            rounded-lg shadow-sm transition-all duration-200
                            focus:border-[var(--color-primary-blue)] focus:ring-2 
                            focus:ring-[var(--color-primary-blue)] focus:ring-opacity-50 
                            focus:outline-none"
                    />
                </span>
                <span>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Пароль
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Пароль"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 border w-[100%] border-gray-300 
                            rounded-lg shadow-sm transition-all duration-200
                            focus:border-[var(--color-primary-blue)] focus:ring-2 
                            focus:ring-[var(--color-primary-blue)] focus:ring-opacity-50 
                            focus:outline-none"
                    />
                </span>
            </div>

            <button
                type="submit"
                className="bg-[rgba(39,123,207,1)] text-white font-semibold 
                py-3 px-8 rounded-full shadow-lg w-[70%] transition-all duration-200
                ease-in-out hover:bg-[rgb(55,140,223)] hover:shadow-md mb-4"
            >
                Войти
            </button>
            
            <span
            className="text-sm text-[var(--color-primary-blue)] cursor-pointer p-0"
            onClick={openSignUpForm}>
                Нет аккаунта? Зарегистрироваться
            </span>
        </form>
    );
}

export default LoginForm;