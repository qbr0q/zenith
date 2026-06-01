import UserAvatar from '../../components/ui/user/UserAvatar'


export const MentionList = ({ users, onSelect, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute bottom-[85px] left-0 mb-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-[50] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Упомянуть пользователя
            </div>
            {users.map((user) => (
                <button
                    type="button"
                    key={user.id}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all duration-150 group"
                    onClick={() => onSelect(user)}
                >
                    <UserAvatar user={user}/>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                            {user.name}
                        </span>
                        <span className="text-[11px] text-gray-400">{user.bio}</span>
                    </div>
                </button>
            ))}
        </div>
    );
};