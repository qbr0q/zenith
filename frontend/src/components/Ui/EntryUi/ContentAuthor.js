import EntryPointMenu from './EntryPointMenu'
import UserAvatar from '../User/UserAvatar'
import UserName from '../User/UserName'
import FormatTime from "../FormatTime";


const ContentAuthor = ({content}) => {
    return <>
        <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-3">
                <UserAvatar user={content.author}/>
                <UserName user={content.author} />
                <FormatTime create_date={content.create_date}/>
            </div>
            <EntryPointMenu content={content}/>
        </div>
    </>
}

export default ContentAuthor