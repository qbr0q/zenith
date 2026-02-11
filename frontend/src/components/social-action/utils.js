export const updatePostLikes = async (queryClient, content, isLiked) => {
    const postId = content.id;
    queryClient.setQueryData(['posts'], (oldData) => {
        if (!oldData) return [];

        return oldData.map(post =>
            post.id === postId
                ? { ...post, like_count: isLiked ? post.like_count - 1 : post.like_count + 1 }
                : post
        );
    });
}

export const updateCommentLikes = async (queryClient, content, isLiked) => {
    const { post_id: postId, id: commentId, parent_id: parentId } = content;

    queryClient.setQueryData(['posts'], (oldData) => {
        if (!oldData) return [];

        return oldData.map(post => {
            if (post.id !== postId) return post;

            // Функция для обновления полей лайка
            const updateLikeFields = (c) => ({
                ...c,
                is_liked: !isLiked,
                like_count: isLiked ? c.like_count - 1 : c.like_count + 1
            });

            return {
                ...post,
                comments: post.comments.map(comment => {
                    // 1. Если это тот самый коммент (неважно, родитель он или нет)
                    if (comment.id === commentId) {
                        return updateLikeFields(comment);
                    }

                    // 2. Если у этого коммента есть дети и наш таргет — один из них
                    if (parentId === comment.id && comment.comments) {
                        return {
                            ...comment,
                            comments: comment.comments.map(child =>
                                child.id === commentId ? updateLikeFields(child) : child
                            )
                        };
                    }

                    return comment;
                })
            };
        });
    });
}

export const getCountComments = (data) => {
    // Если нам прилетел массив (верхний уровень), проходим по нему
    if (Array.isArray(data)) {
        return data.reduce((acc, item) => acc + getCountComments(item), 0);
    }

    // Если это один объект:
    // 1 (за сам текущий коммент) + рекурсивный обход его детей
    let count = 1;

    if (data.comments && data.comments.length > 0) {
        count += getCountComments(data.comments);
    }

    return count;
};