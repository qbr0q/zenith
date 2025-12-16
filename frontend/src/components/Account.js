import { isUserAuth, getUser, logOut } from './Utils'
import { useState, useEffect } from 'react'
import { FiLogOut  } from 'react-icons/fi';
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
                    <img alt='аватарка'
                    src="https://loudouncslcenter.com/wp-content/uploads/default-avatar-icon-of-social-media-user-vector.jpg"
                    className="rounded-full h-[40px]"></img>
                    <span className='flex justify-self-center font-medium cursor-pointer'>
                        {user.username}
                    </span>
                    <FiLogOut onClick={logOut} className='cursor-pointer'/>
                </div>
            )
        } else {
            setAccountContent(
                <button className="bg-[rgba(39,123,207,1)] text-white font-semibold 
                    py-2 px-6 rounded-full shadow-lg w-[70%] transition-all duration-200
                    ease-in-out hover:bg-[rgb(55,140,223)] hover:shadow-md"
                    onClick={openLoginForm}
                >Войти</button>
            )
        }
    }, [isAuth, openLoginForm])

    return (
        <div className="flex justify-center bg-white rounded-xl p-6 border">
            {accountContent}
        </div>
    )
}

export default Account