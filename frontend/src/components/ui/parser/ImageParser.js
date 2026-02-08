import { useRef, useState } from "react";
import {MEDIA_BASE_URL} from "../../../config";


const ImageParser = ({ type, images }) => {
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    // Функция для плавной прокрутки к нужному фото
    const scrollToImage = (index) => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            scrollRef.current.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
            setCurrentIndex(index);
        }
    };

    // Обновляем индекс при ручном скролле (для мобилок)
    const handleScroll = () => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            const newIndex = Math.round(scrollRef.current.scrollLeft / width);
            if (newIndex !== currentIndex) setCurrentIndex(newIndex);
        }
    };

    let mediaUrl = ''
    if (type === 'post') {
        mediaUrl = `${MEDIA_BASE_URL}/uploads/post_media`
    } else if (type === 'comment') {
        mediaUrl = `${MEDIA_BASE_URL}/uploads/comment_media`
    }

    return (
        <div className="relative group w-full overflow-hidden rounded-xl border border-gray-200 cursor-pointer">
            {/* Контейнер со скроллом */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {images.map((image, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full snap-center  flex items-center justify-center">
                        <img
                            src={`${mediaUrl}/${image.image_path}`}
                            alt={`content-${idx}`}
                            className="max-h-[500px] w-full object-contain"
                        />
                    </div>
                ))}
            </div>

            {/* Кнопки Назад/Вперед (показываются только если фото > 1) */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={() => scrollToImage(currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full 
                        bg-white/80 shadow hover:bg-white transition opacity-0 group-hover:opacity-100 ${currentIndex === 0 && 'hidden'}`}
                    >
                        ←
                    </button>
                    <button
                        onClick={() => scrollToImage(currentIndex + 1)}
                        disabled={currentIndex === images.length - 1}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow
                         hover:bg-white transition opacity-0 group-hover:opacity-100 ${currentIndex === images.length - 1 && 'hidden'}`}
                    >
                        →
                    </button>

                    {/* Точки-индикаторы */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 w-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-blue-500 w-3' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageParser