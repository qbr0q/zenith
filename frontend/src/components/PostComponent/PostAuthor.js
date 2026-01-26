import PointsMenu from './PrePointMenu'
import UserAvatar from '../Ui/User/UserAvatar'
import UserName from '../Ui/User/UserName'
import FormatTime from "../Ui/FormatTime";


const PostAuthor = ({post}) => {
    return <>
        <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-3">
                <UserAvatar user={post.author}/>
                <UserName user={post.author} />
                <FormatTime create_date={post.create_date}/>
            </div>
            <PointsMenu content={post}/>
        </div>
    </>
}

export default PostAuthor