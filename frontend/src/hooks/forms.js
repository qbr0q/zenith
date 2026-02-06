import { useCallback } from 'react';
import { useModal } from './modalProvider';
import LoginForm from '../forms/loginForm'
import SignUpForm from '../forms/signUpForm'
import PublishForm from '../forms/publishForm'
import ConfirmForm from '../forms/confirmForm'


export const useLoginForm = () => {
    const { handleOpenModal, setModalTitle, setModalContent } = useModal();

    return useCallback(() => {
        setModalTitle('Логин')
        setModalContent(<LoginForm/>)
        handleOpenModal()
    }, [setModalTitle, setModalContent, handleOpenModal])
}

export const useSignUpForm = () => {
    const { handleOpenModal, setModalTitle, setModalContent } = useModal();

    return useCallback(() => {
        setModalTitle('Регистрация')
        setModalContent(<SignUpForm/>)
        handleOpenModal()
    }, [setModalTitle, setModalContent, handleOpenModal])
}

export const usePostPublisherForm = (onSubmit) => {
    const { handleOpenModal, setModalTitle, setModalContent } = useModal();

    return useCallback(() => {
        setModalTitle('Новый пост')
        setModalContent(<PublishForm type="post" onSubmit={onSubmit} />)
        handleOpenModal()
    }, [setModalTitle, setModalContent, handleOpenModal, onSubmit])
}

export const useConfirmForm = () => {
    const { handleOpenModal, setModalTitle, setModalContent, handleCloseModal } = useModal();

    return useCallback(() => {
        return new Promise((resolve) => {
            setModalTitle('Удалить?');

            // передаем в форму колбэки для ответа
            setModalContent(
                <ConfirmForm
                    onConfirm={() => {
                        handleCloseModal();
                        resolve(true);
                    }}
                    onCancel={() => {
                        handleCloseModal();
                        resolve(false);
                    }}
                />
            );
            handleOpenModal();
        });
    }, [setModalTitle, setModalContent, handleOpenModal, handleCloseModal]);
};