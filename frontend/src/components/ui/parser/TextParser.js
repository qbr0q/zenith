import { Link } from 'react-router-dom';
// Регулярное выражение для поиска @mentions или #hashtags:
// \s - пробельный символ
// (\S+) - захватывает один или более непробельных символов (само слово)
const MENTION_REGEX = /(@\S+)|(#\S+)/g;

const TextParser = ({ children }) => {
    if (!children) {return}
    // 1. Получаем текст из children
    const text = String(children);

    // 2. Разделяем текст с помощью регулярного выражения
    const parts = text.split(MENTION_REGEX);

    // 3. Обрабатываем и рендерим каждую часть
    const renderedText = parts.map((part, index) => {
        // Проверяем, является ли часть меншеном или хештегом
        if (!part) {
            // Игнорируем пустые строки, которые могут возникнуть при split()
            return null;
        }

        // a. Меншен (начинается с @)
        if (part.startsWith('@')) {
            const username = part.substring(1); // Удаляем @
            const mentionLink = `/@${username}`; // Ссылка на страницу пользователя

            return (
                <a
                    key={index}
                    href={mentionLink}
                    className="text-[blue]"
                    onClick={(e) => {
                        e.preventDefault();
                        alert(`Переход к пользователю: ${username}`);
                    }}
                >
                    {part}
                </a>
            );
        }

        // b. Хештег (начинается с #)
        if (part.startsWith('#')) {
            return (
                <Link
                    key={index}
                    to={`/search?query=${encodeURIComponent(part)}`}
                    className="text-[green]"
                >
                    {part}
                </Link>
            );
        }

        // c. Обычный текст
        return <span key={index}>{part}</span>;
    });

    // 4. Оборачиваем все в основной тег <span>
    return <span>{renderedText}</span>;
}

export default TextParser;