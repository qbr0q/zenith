import { isUserAuth, getUser, logOut } from '../utils'
import { useState, useEffect } from 'react'
import { FiLogOut  } from 'react-icons/fi';
import { useLoginForm } from '../../hooks/forms'
import UserAvatar from '../ui/user/UserAvatar'
import UserName from "../ui/user/UserName";


const Account = () => {
    const [accountContent, setAccountContent] = useState(null)
    const openLoginForm = useLoginForm()
    const isAuth = isUserAuth();

    useEffect(() => {
        if (isAuth) {
            const user = getUser();
            setAccountContent(
                <div className='flex flex-row items-center w-full justify-around'>
                    <UserAvatar user={user} />
                    <UserName user={user} />
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