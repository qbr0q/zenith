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

        socket.on('new_post', handleNewPost);
        socket.on('like_update', handleLikePost);
        socket.on("delete_post", handleDeletePost);

        return () => {
            socket.off('new_post', handleNewPost);
            socket.off('like_update', handleLikePost);
            socket.off("delete_post", handleDeletePost);
        };
    }, [socket, queryClient]);
};