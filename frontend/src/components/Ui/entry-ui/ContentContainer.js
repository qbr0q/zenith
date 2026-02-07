import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom';
import ContentAuthor from './ContentAuthor'
import SocialActions from '../../social-action/SocialActions'
import TextParser from '../parser/TextParser'
import ImageParser from '../parser/ImageParser'


const ContentContainer = ({ contentItems, isComment = false }) => {
    if (!contentItems?.length) return null;

    return (
        <div className={!isComment ? "p-5" : ""}>
            {contentItems.map((item) => (
                <Fragment key={item.id}>
                    <ContentItem item={item} isComment={isComment} />
                    {!isComment && <hr className="-mx-5 border-gray-200" />}
                </Fragment>
            ))}
        </div>
    );
};

const ContentItem = ({ item, isComment }) => {
    const navigate = useNavigate();

    const openContent = (e, item) => {
        e.stopPropagation();
        navigate(`/@${item.author.username}/post/${item.slug}`)
    }

    return (
        <div
            className={`flex flex-col gap-4 whitespace-pre-wrap break-words cursor-pointer
            ${!isComment ? 'px-8 py-6' : 'mt-6'}`}
            onClick={(e) => {openContent(e, item)}}
        >
            <ContentAuthor content={item} />
            <TextParser children={item.text} />
            <ImageParser type={item.type} images={item.image} />
            <SocialActions content={item} />

            {item.comments && item.comments.length > 0 && (
                <div className="ml-4 md:ml-6 border-l-[1.5px] border-gray-400 pl-4 md:pl-6">
                    <ContentContainer contentItems={item.comments} isComment={true} />
                </div>
            )}
        </div>
    );
};

export default ContentContainer