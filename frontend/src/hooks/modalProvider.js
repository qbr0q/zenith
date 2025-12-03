import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';

// Создаем контекст для модального окна
const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setModalTitle(null);
        setModalContent(null);
        setIsModalOpen(false);
    }

    return (
        <ModalContext.Provider value={{
            handleOpenModal,
            handleCloseModal,
            setModalContent,
            setModalTitle
        }}>
            {children}
            <ModalComponent 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                content={modalContent}
                title={modalTitle}
            />
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);

// Отдельный компонент модального окна
const ModalComponent = ({ isOpen, onClose, content, title }) => {
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('main-btn')?.click();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div 
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button 
                        className="text-gray-500 hover:text-gray-800 text-2xl"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-content">
                    {content}
                </div>
            </div>
        </div>
    );
};
