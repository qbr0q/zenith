import { Fragment } from 'react'
import ContentAuthor from './ContentAuthor'
import SocialActions from '../../socialAction/SocialActions'
import TextParser from '../../textParser'


const ContentContainer = ({contentItems, isComment=false}) => {
    if (!contentItems || !contentItems.length) {return null}

    return <div className={`bg-white rounded-xl 
    ${isComment
        ? 'ml-4 md:ml-6 mt-4 border-l-[1.5px] border-gray-400 pl-4 md:pl-6 !rounded-none' 
        : 'p-5'}`}>
        {contentItems?.map(contentItem => (<Fragment key={contentItem.id}>
                <div className={`flex flex-col gap-4 whitespace-pre-wrap break-words 
                ${!isComment ? 'px-8 py-6' : ''}`}>
                    <ContentAuthor content={contentItem} />
                    <TextParser>{contentItem.text}</TextParser>
                    <SocialActions content={contentItem}/>
                    {contentItem.comments && <ContentContainer
                        contentItems={contentItem.comments} isComment={true}/>}
                </div>
                {!isComment ? <hr className="-mx-5 border-gray-200"/> : null}
            </Fragment>
        ))}
    </div>
}

export default ContentContainer