import PointMenu from '../PointMenu'
import { useFetch } from '../../../hooks/fetch';
import { useConfirmForm } from '../../../hooks/forms';


const EntryPointMenu = ({content}) => {
    const { executeFetch } = useFetch();
    const openConfirmForm = useConfirmForm()

    const handlerCopyBtn = () => {
        alert('Ссылка скопирована!');
    }
    const handlerReportBtn = () => {
        alert('Жалоба отправлена!');
    }
    const handlerDeletePost = async () => {
        const confirmed = await openConfirmForm()
        if (!confirmed) {return null}

        const config = {
            post: {
                url: 'post/delete_post',
                payload: { post_id: content.id }
            },
            comment: {
                url: 'social_action/delete_comment',
                payload: { comment_id: content.id }
            }
        };
        const { url, payload } = config[content.type];
        try {
            await executeFetch('delete', url, payload)
        } catch (err) {
            console.error(err)
        }
    }

    const menuItems = [
        {
            label: 'Копировать ссылку',
            handler: handlerCopyBtn
        },
        {
            label: 'Пожаловаться',
            handler: handlerReportBtn,
            type: 'danger'
        },
        {
            label: 'Удалить',
            handler: handlerDeletePost,
            type: 'danger'
        }
    ]
    return <PointMenu menuItems={menuItems}/>
}

export default EntryPointMenu