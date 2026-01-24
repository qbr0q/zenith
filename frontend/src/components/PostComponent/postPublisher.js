import { usePostPublisherForm } from '../../hooks/forms'

const PostPublisher = () => {
    const openPostPublisherForm = usePostPublisherForm();

    return (<>
        <div className="flex flex-col min-w-0 bg-white p-5 rounded-xl">
            <span
                onClick={openPostPublisherForm}
                className="text-lg text-gray-500"
            >
                Что нового?
            </span>
        </div>
        <hr className="border-gray-200"/>
        </>
    );
};

export default PostPublisher;