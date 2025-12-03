import { useModal } from '../../hooks/modalProvider';
import { isUserAuth } from '../Utils'
import { useState, useEffect, useCallback } from 'react'
import LoginForm from '../../forms/loginForm'
import { FiLogOut  } from 'react-icons/fi'; 


const Account = () => {
    const { handleOpenModal, setModalContent, setModalTitle } = useModal();
    const [isAuth, setIsAuth] = useState(false)
    const [accountContent, setAccountContent] = useState(null)

    useEffect(() => {
        setIsAuth(
            isUserAuth()
        )
    }, [])

    const setLoginForm = useCallback(() => {
        setModalTitle('Логин')
        setModalContent(<LoginForm/>)
        handleOpenModal()
    }, [handleOpenModal, setModalContent, setModalTitle])

    useEffect(() => {
        if (isAuth) {
            const user = JSON.parse(localStorage.getItem('user'))
            setAccountContent(
                <div className='flex flex-row items-center w-full justify-around'>
                    <img alt='аватарка'
                    src="https://loudouncslcenter.com/wp-content/uploads/default-avatar-icon-of-social-media-user-vector.jpg"
                    className="rounded-full h-[40px]"></img>
                    <span className='flex justify-self-center font-medium'>
                        {user.username}
                    </span>
                    <FiLogOut onClick={() => {alert(123)}}/>
                </div>
            )
        } else {
            setAccountContent(
                <button className="bg-[rgba(39,123,207,1)] text-white font-semibold 
                    py-2 px-6 rounded-full shadow-lg w-[70%] transition-all duration-200
                    ease-in-out hover:bg-[rgb(55,140,223)] hover:shadow-md"
                    onClick={setLoginForm}
                >Войти</button>
            )
        }
    }, [isAuth, setLoginForm])

    return (
        <div className="flex justify-center bg-white rounded-xl p-6 border">
            {accountContent}
        </div>
    )
}

export default Account