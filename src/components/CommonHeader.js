import React from 'react';
import { useNavigate } from 'react-router-dom';

const CommonHeader = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    const handleLogoClick = () => {
        navigate('/'); // 로고 클릭 시 루트 경로로 이동
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-gray-800 text-gray-400 p-4 font-bold z-50"> {/* fixed로 상단 고정 */}
            <div className="container mx-auto flex justify-between items-center">
                {/* 로고 */}
                <div className="flex items-center space-x-4">
                    <img src="/logo.svg" alt="Logo" className="w-40 cursor-pointer" onClick={handleLogoClick}/>
                </div>

                {/* 우측 상단 링크 */}
                <div className="space-x-4 text-white text-sm">
                    <button onClick={() => navigate('/terms')} className="hover:underline">이용약관</button>
                    <button onClick={() => navigate('/privacy-policy')} className="hover:underline">개인정보 처리방침
                    </button>
                    <button onClick={() => navigate('/faq')} className="hover:underline">FAQ/문의</button>
                </div>
            </div>
        </header>
    );
};

export default CommonHeader;
