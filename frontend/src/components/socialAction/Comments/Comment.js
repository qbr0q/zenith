const Comment = ({ comment, isChild = false }) => {
    return (
        <div className={`flex flex-col ${isChild ? 'ml-10 mt-3' : 'mt-6'}`}>
            <div className="flex gap-3">
                {/* Аватар */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center border border-gray-100 shadow-sm">
                    <span className="text-xs text-gray-400">AVA</span>
                </div>

                {/* Тело комментария */}
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-800">user_{comment.id}</span>
                        <span className="text-[10px] text-gray-400">5д</span>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.text}
                    </p>

                    {/* Футер: Лайки и Ответ */}
                    <div className="flex items-center gap-4 mt-3">
                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors group">
              <span className={`text-lg ${comment.like_count > 0 ? 'text-red-500' : ''}`}>
                {comment.like_count > 0 ? '❤️' : '🤍'}
              </span>
                            <span className="text-xs font-medium">{comment.like_count}</span>
                        </button>

                        <button className="text-xs font-semibold text-blue-500 hover:text-blue-600">
                            Ответить
                        </button>
                    </div>
                </div>
            </div>

            {/* Линия связи и рекурсивный вывод детей */}
            {comment.child_comments?.length > 0 && (
                <div className="relative">
                    {/* Вертикальная линия-разделитель */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />

                    {comment.child_comments.map(child => (
                        <Comment key={child.id} comment={child} isChild={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;