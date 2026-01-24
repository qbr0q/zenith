import PointMenu from '../PointMenu'


const PostMenu = ({content}) => {
    const handlerCopyBtn = () => {
        alert('Ссылка скопирована!');
    }
    const handlerReportBtn = () => {
        alert('Жалоба отправлена!');
    }
    const handlerDeletePost = () => {
        console.log(content)
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

export default PostMenu