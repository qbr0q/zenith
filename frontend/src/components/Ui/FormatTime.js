import {formatTimeAgo} from "../Utils";


const UserAvatar = ({create_date}) => {
    return <>
        <span className="font-thin text-[13px]"
              title={new Date(create_date).toLocaleString()}
        >
            {formatTimeAgo(create_date)}
        </span>
    </>
}

export default UserAvatar