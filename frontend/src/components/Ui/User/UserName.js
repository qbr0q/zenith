import Verified from "./Verified";


const UserName = ({user}) => {
    return <>
        <span className='flex items-center gap-1 font-semibold'>
            <span
                className="text-base cursor-pointer"
            >
                {user.username}
            </span>
            {user.info.is_verified ?
                <Verified/>
                : null}
        </span>
    </>
}

export default UserName