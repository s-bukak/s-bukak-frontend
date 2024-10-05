import React, { useState } from 'react';

function CommunityButton() {
    const [activeButton, setActiveButton] = useState(null);

    const handleClick = (button) => {
        setActiveButton(button);
    };

    const getButtonClass = (button) => {
        return activeButton === button
            ? 'w-32 h-9 bg-sky-600 text-white rounded-lg'
            : 'w-32 h-9 bg-white text-black border border-gray-300 rounded-lg';
    };

    return (
        <div>
            <button className="w-72 h-12 text-white font-bold bg-gray-800 rounded-lg ">글쓰기</button>
            <div className="w-72 h-37 mt-4 border border-gray-300 rounded-lg p-4">
                <div className="flex justify-center mb-4" style={{gap: '4.5px'}}>
                    <button className={getButtonClass('게시판 정보')} onClick={() => handleClick('게시판 정보')}>
                        게시판 정보
                    </button>
                    <button className={getButtonClass('나의활동')} onClick={() => handleClick('나의활동')}>
                        나의활동
                    </button>
                </div>
                <div className="text-center">자유 게시판</div>
                <div className="text-center mt-2">연습상대 게시판</div>
            </div>
        </div>
    );
}

export default CommunityButton;
