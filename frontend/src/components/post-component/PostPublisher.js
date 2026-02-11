import { usePostPublisherForm } from '../../hooks/forms'
import { useFetch } from "../../hooks/fetch";

const PostPublisher = () => {
    const { executeFetch } = useFetch();

    const onSubmit = (formData) => {
        try {
            executeFetch('post', "posts/", formData)
        } catch (error) {
            console.error(error);
        }
    }

    const openPostPublisherForm = usePostPublisherForm(onSubmit);

    return (<>
        <div className="flex flex-col min-w-0 bg-white rounded-xl">
            <span
                onClick={openPostPublisherForm}
                className="text-lg text-gray-500 cursor-text p-5"
            >
                Что нового?
            </span>
        </div>
        <hr className="border-gray-200"/>
        </>
    );
};

export default PostPublisher;