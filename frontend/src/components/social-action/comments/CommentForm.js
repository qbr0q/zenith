import PublishForm from "../../../forms/publishForm";
import { useFetch } from "../../../hooks/fetch";


const CommentForm = ({content, onClose}) => {
    const { executeFetch } = useFetch();

    const onSubmit = (formData) => {
        try {
            const post_id = content.type === "post" ? content.id : content.post_id
            formData.append("post_id", post_id);
            if (content.type === "comment") {
                const parent_id = content.parent_id ? content.parent_id : content.id
                formData.append("parent_id", parent_id);
            }

            executeFetch('post', 'social_action/create_comment', formData)
            onClose()
        } catch (error) {
            console.error(error);
        }
    }

    return <div className="ml-4 md:ml-6 mt-4 border-l-[1.5px] border-gray-400 pl-4">
        <PublishForm type="comment" onSubmit={onSubmit}/>
    </div>
};

export default CommentForm;