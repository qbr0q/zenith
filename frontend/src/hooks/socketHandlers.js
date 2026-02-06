import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useSocketHandlers = (socket) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        const handleNewPost = (newPost) => {
            queryClient.setQueryData(['posts'], (oldPosts) => {
                return oldPosts ? [newPost, ...oldPosts] : [newPost];
            });
        };

        const handleNewComment = (newComment) => {
            queryClient.setQueryData(['posts'], (oldPosts) => {
                if (!oldPosts) return [];

                return oldPosts.map(post => {
                    // Ищем пост, к которому относится комментарий
                    if (post.id !== newComment.post_id) return post;

                    // Если это корневой комментарий (нет родителя)
                    if (!newComment.parent_id) {
                        return {
                            ...post,
                            comments: [newComment, ...(post.comments || [])]
                        };
                    }

                    // Если это ответ на другой комментарий — запускаем рекурсию
                    return {
                        ...post,
                        comments: updateCommentsRecursively(post.comments || [], newComment)
                    };
                });
            });
        };

        const handleLikePost = (likedPost) => {
            queryClient.setQueryData(['posts'], (oldData) => {
                return oldData.map((post) =>
                    post.id === likedPost.id
                        ? { ...post, like_count: likedPost.likeCount }
                        : post
                );
            });
        }

        const handleLikeComment = (likedComment) => {
            const { postId, commentId, parentId, likeCount } = likedComment;

            queryClient.setQueryData(['posts'], (oldData) => {
                if (!oldData) return [];

                return oldData.map(post => {
                    if (post.id !== postId) return post;

                    // Функция для обновления полей лайка
                    const updateLikeFields = (c) => ({
                        ...c,
                        like_count: likeCount
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

        const handleDeletePost = (deletedPost) => {
            queryClient.setQueryData(['posts'], (oldData) => {
                return oldData.filter((post) =>
                    post.id !== deletedPost.post_id
                );
            });
        }

        const handlerDeleteComment = (deletedComment) => {
            queryClient.setQueryData(['posts'], (oldData) => {
                 return oldData.map(post => {
                        if (post.id === deletedComment.post_id) {
                            return {
                                ...post, "comments": deleteRecursive(post.comments, deletedComment.id)}
                        }
                        return post;
                    }
                );
            });
        }

        socket.on('new_post', handleNewPost);
        socket.on('new_comment', handleNewComment);
        socket.on('likePost_update', handleLikePost);
        socket.on('likeComment_update', handleLikeComment);
        socket.on("delete_post", handleDeletePost);
        socket.on("delete_comment", handlerDeleteComment);

        return () => {
            socket.off('new_post', handleNewPost);
            socket.off('new_comment', handleNewComment);
            socket.off('likePost_update', handleLikePost);
            socket.off('likeComment_update', handleLikeComment);
            socket.off("delete_post", handleDeletePost);
            socket.off("delete_comment", handlerDeleteComment);
        };
    }, [socket, queryClient]);
};


const deleteRecursive = (comments, idToRemove) => {
    // рекурсивная функция для фильтрации удаленных комментариях на обоих уровнях вложенности
    if (!comments) return [];

    return comments
        .filter(comment => comment.id !== idToRemove) // удаляем на текущем уровне
        .map(comment => ({
            ...comment,
            "comments": comment.comments ? deleteRecursive(comment.comments, idToRemove) : []
        }));
};

const updateCommentsRecursively = (comments, newComment) => {
    return comments.map(comment => {
        // 1. Если этот комментарий и есть родитель нашего нового коммента
        if (comment.id === newComment.parent_id) {
            return {
                ...comment,
                // Добавляем в список детей (проверь название ключа: comments или children)
                comments: [newComment, ...(comment.comments || [])]
            };
        }

        // 2. Если у этого комментария есть свои дети, идем глубже
        if (comment.comments && comment.comments.length > 0) {
            return {
                ...comment,
                comments: updateCommentsRecursively(comment.comments, newComment)
            };
        }

        // 3. Если ничего не нашли, возвращаем коммент как есть
        return comment;
    });
};