const ConfirmForm = ({ onConfirm, onCancel }) => {
    return <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
        <button
            className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white
                           border border-gray-300 rounded-xl shadow-sm transition-all
                           hover:bg-gray-50 active:bg-gray-100 outline-none"
            onClick={onCancel}
        >
            Отмена
        </button>
        <button
            className="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-red-500
                           rounded-xl shadow-sm transition-all hover:bg-red-600
                           active:scale-[0.98] shadow-red-200"
            onClick={onConfirm}
        >
            Удалить
        </button>
    </div>
}

export default ConfirmForm