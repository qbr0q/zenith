import {formatTimeAgo} from "../Utils";


const UserAvatar = ({create_date}) => {
    return <>
        <span className="font-thin text-[13px]">
            {formatTimeAgo(create_date)}
        </span>
    </>
}

export default UserAvatar