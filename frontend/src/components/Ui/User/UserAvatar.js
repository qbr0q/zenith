import {BASE_URL} from "../../../config";


const UserAvatar = ({user}) => {
    return <>
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border
                border-gray-50 overflow-hidden group-hover:border-blue-200 transition-colors">
            <img
                src={`${BASE_URL}/media/avatars/${user.info.avatar_url}`}
                alt={user.username}
                className="w-full h-full object-cover"
            />
        </div>
    </>
}

export default UserAvatar