import PointMenu from '../PointMenu'


const PostMenu = () => {
    const handlerCopyBtn = () => {
        alert('Ссылка скопирована!');
    }
    const handlerReportBtn = () => {
        alert('Жалоба отправлена!');
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
            handler: handlerReportBtn,
            type: 'danger'
        }
    ]
    return <PointMenu menuItems={menuItems}/>
}

export default PostMenu