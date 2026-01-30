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

        const handleLikePost = (likedPost) => {
            queryClient.setQueryData(['posts'], (oldData) => {
                return oldData.map((post) =>
                    post.id === likedPost.id
                        ? { ...post, like_count: likedPost.likeCount }
                        : post
                );
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
                                ...post, "test": 123,
                                "comments": deleteRecursive(post.comments, deletedComment.id)}
                        }
                        return post;
                    }
                );
            });
        }

        socket.on('new_post', handleNewPost);
        socket.on('like_update', handleLikePost);
        socket.on("delete_post", handleDeletePost);
        socket.on("delete_comment", handlerDeleteComment);

        return () => {
            socket.off('new_post', handleNewPost);
            socket.off('like_update', handleLikePost);
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