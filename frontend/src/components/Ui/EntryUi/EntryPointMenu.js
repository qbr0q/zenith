import PointMenu from '../PointMenu'
import { useFetch } from '../../../hooks/fetch';


const EntryPointMenu = ({content}) => {
    const { executeFetch, error } = useFetch();

    const handlerCopyBtn = () => {
        alert('Ссылка скопирована!');
    }
    const handlerReportBtn = () => {
        alert('Жалоба отправлена!');
    }
    const handlerDeletePost = async () => {
        try {
            await executeFetch('post', 'post/delete_post', {
                post_id: content.id
            })
        } catch {
            console.error(error)
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