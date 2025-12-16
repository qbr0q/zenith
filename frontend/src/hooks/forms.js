import { useCallback } from 'react';
import { useModal } from '../hooks/modalProvider';
import LoginForm from '../forms/loginForm'
import SignUpForm from '../forms/signUpForm'


export const useLoginForm = () => {
    const { handleOpenModal, setModalTitle, setModalContent } = useModal();

    const openLoginForm = useCallback(() => {
        setModalTitle('Логин')
        setModalContent(<LoginForm/>)
        handleOpenModal()
    }, [setModalTitle, setModalContent, handleOpenModal])
    return openLoginForm
}

export const useSignUpForm = () => {
    const { handleOpenModal, setModalTitle, setModalContent } = useModal();

    const openSignUpForm = useCallback(() => {
        setModalTitle('Регистрация')
        setModalContent(<SignUpForm/>)
        handleOpenModal()
    }, [setModalTitle, setModalContent, handleOpenModal])
    return openSignUpForm
}