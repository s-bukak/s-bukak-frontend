import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-400 p-8">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left Side: Project Description */}
                <div className="w-2/3 text-gray-500 text-sm">
                    {[
                        "2024-2학기 알파프로젝트",
                        " ",
                        "국민대학교 내 북악리그 축구 및 농구 경기에 대한",
                        "홍보 및 참여 유도, 중앙화된 정보 제공, 커뮤니케이션 강화, 커뮤니티 형성을 목적으로 하는 북악리그 전용 웹사이트",
                        " ",
                        "우리 오늘, 승부 각 : 勝 북악"
                    ].map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br/>
                        </React.Fragment>
                    ))}
                </div>

                {/* Right Side: Links */}
                <div className="w-1/3 flex flex-col space-y-3 text-gray-500 text-sm text-right">
                    <a href="#notice" className="hover:text-white">N O T I C E</a>
                    <a href="#about-us" className="hover:text-white">A B O U T U S</a>
                    <a href="#contact-us" className="hover:text-white">C O N T A C T  U S</a>
                    <a href="https://github.com/s-bukak" target="_blank" rel="noopener noreferrer" className="hover:text-white">G I T H U B</a>
                    <a href="https://instagram.com/your-instagram" target="_blank" rel="noopener noreferrer" className="hover:text-white">I N S T A G R A M</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
