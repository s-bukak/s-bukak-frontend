import React, { useState } from 'react';

const Cheering = ({ teamName }) => {
    const [comments, setComments] = useState('');
    const handleCommentChange = (e) => {
        setComments(e.target.value);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // 댓글 제출 처리 로직 (ex. 서버에 저장하기)
        console.log(`Comment for ${teamName}:`, comments);
        setComments('');
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold">응원 메시지</h2>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    value={comments}
                    onChange={handleCommentChange}
                    placeholder="응원 메시지를 입력하세요"
                    rows="4"
                ></textarea>
                <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                    제출
                </button>
            </form>
        </div>
    );
};

export default Cheering;
