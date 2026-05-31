import { Link } from 'react-router-dom';
// Регулярное выражение для поиска @mentions или #hashtags:
// \s - пробельный символ
// (\S+) - захватывает один или более непробельных символов (само слово)
const MENTION_REGEX = /(@\S+)|(#\S+)/g;
const VALUE_REGEX = /[^a-zA-Z0-9]/g;

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
            return (
                <Link
                    key={index}
                    to={`/search?query=${encodeURIComponent(clearValue(part))}`}
                    className="text-[blue]"
                >
                    {part}
                </Link>
            );
        }

        // b. Хештег (начинается с #)
        if (part.startsWith('#')) {
            return (
                <Link
                    key={index}
                    to={`/search?query=${encodeURIComponent(clearValue(part))}`}
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

const clearValue = (str) => {
    if (!str) return '';

    const firstChar = str[0];

    const rest = str.slice(1).replace(/[^a-zA-Z0-9]/g, '');

    return firstChar + rest;
}

export default TextParser;