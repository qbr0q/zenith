import { isUserAuth, getUser, logOut } from './Utils'
import { useState, useEffect } from 'react'
import { FiLogOut, FiUser  } from 'react-icons/fi';
import { useLoginForm } from '../hooks/forms'


const Account = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [accountContent, setAccountContent] = useState(null)
    const openLoginForm = useLoginForm()

    useEffect(() => {
        setIsAuth(
            isUserAuth()
        )
    }, [])

    useEffect(() => {
        if (isAuth) {
            const user = getUser()
            setAccountContent(
                <div className='flex flex-row items-center w-full justify-around'>
                    <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center border border-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <FiUser size={24} />
                    </div>
                    <span className='flex justify-self-center font-medium cursor-pointer'>
                        {user.username}
                    </span>
                    <FiLogOut onClick={logOut} className='cursor-pointer'/>
                </div>
            )
        } else {
            setAccountContent(
                <button className="bg-[rgba(39,123,207,1)] text-white font-semibold 
                    rounded-full shadow-lg w-[70%] transition-all duration-200 h-[40px]
                    ease-in-out hover:bg-[rgb(55,140,223)] hover:shadow-md"
                    onClick={openLoginForm}
                >Войти</button>
            )
        }
    }, [isAuth, openLoginForm])

    return (
        <div className="flex justify-center bg-white rounded-xl 
                        border w-[60%] justify-self-center items-center">
            {accountContent}
        </div>
    )
}

export default Account