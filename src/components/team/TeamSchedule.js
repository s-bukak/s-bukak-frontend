import React from 'react';

const TeamSchedule = ({ schedules = [] }) => { // 기본값을 빈 배열로 설정
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold">경기 일정</h2>
            <ul className="mt-2">
                {schedules.length > 0 ? (
                    schedules.map((match, index) => (
                        <li key={index} className="border-b py-2">
                            {match.date} - {match.opponent}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">경기 일정이 없습니다.</li>
                )}
            </ul>
        </div>
    );
};

export default TeamSchedule;
