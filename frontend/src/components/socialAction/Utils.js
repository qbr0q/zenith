export const buildCommentTree = (list) => {
    // возвращает дерево всех комментариев поста
    const map = new Map();
    const tree = [];

    // сначала инициализируем Map и создаем глубокие копии, чтобы не мутировать исходные данные (опционально)
    list.forEach(comment => {
        map.set(comment.id, comment);
    });

    // основной цикл построения дерева
    for (const comment of map.values()) {
        const parentId = comment.parent_id;

        if (parentId !== null && parentId !== undefined) {
            const parent = map.get(parentId);
            parent.child_comments.push(comment);
        } else {
            tree.push(comment);
        }
    }

    return tree;
}

export const getHotTakeComment = (list, postLikesCount) => {
    const hotTake = list.reduce((best, cur) =>
        (cur.like_count >= postLikesCount && (!best || cur.like_count > best.like_count)) ? cur : best, null);

    if (!hotTake) return null;

    if (hotTake.parent_id) {
        const parent = list.find(c => c.id === hotTake.parent_id);
        return parent ? { ...parent, child_comments: [hotTake] } : hotTake;
    }

    return { ...hotTake, child_comments: [] };
};