import React, { useState, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import axios from 'axios';
import {DOMAIN_NAME} from "../../App";

const MultiBanner = ({ activeSportTab }) => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${DOMAIN_NAME}/banner`);
                const today = new Date();

                // 필터링: 오늘 날짜가 startDate ~ endDate 사이에 포함되고, league가 현재 탭과 일치하는 데이터
                const filteredBanners = response.data.banners.filter((banner) => {
                    const startDate = new Date(banner.startDate);
                    const endDate = new Date(banner.endDate);
                    return (
                        today >= startDate &&
                        today <= endDate &&
                        banner.league === (activeSportTab === 'soccer' ? '축구' : '농구')
                    );
                });

                // 이미지 URL만 추출
                const filteredImages = filteredBanners.map((banner) => ({
                    id: banner.id,
                    url: banner.fileUrl,
                }));

                setImages(filteredImages);
            } catch (error) {
                console.error("이미지를 불러오는 중 오류가 발생했습니다:", error);
            }
        };

        fetchImages();
    }, [activeSportTab]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    if (images.length === 0) {
        return <div>{activeSportTab === 'soccer' ? '축구' : '농구'} 탭에 오늘 표시할 배너가 없습니다.</div>;
    }

    return (
        <div className="relative w-full overflow-hidden">
            <div className="w-full h-full">
                <img src={images[currentIndex].url} alt={`banner ${currentIndex + 1}`} className="w-full h-auto" />
            </div>

            {/* 인디케이터 */}
            <div className="absolute bottom-7 left-7 flex space-x-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                ))}
            </div>

            {/* 컨트롤 버튼 */}
            <div className="absolute bottom-5 right-5 flex space-x-4">
                <button
                    onClick={handlePrev}
                    className="text-white text-lg p-2 rounded-full hover:bg-white/30 transition duration-300"
                >
                    <AiOutlineLeft />
                </button>
                <button
                    onClick={handleNext}
                    className="text-white text-lg p-2 rounded-full hover:bg-white/30 transition duration-300"
                >
                    <AiOutlineRight />
                </button>
            </div>
        </div>
    );
};

export default MultiBanner;
