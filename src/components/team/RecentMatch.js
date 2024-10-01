import React from 'react';

const RecentMatch = ({ recentMatches }) => {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold">최근 경기 전적</h2>
            <div className="mt-4">
                {recentMatches.map((match, index) => (
                    <div key={index} className={`flex justify-between items-center p-4 px-10 mb-5 rounded-lg shadow-md ${match.result.includes('승') ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="text-left">
                            <h3 className="text-lg font-semibold">{match.opponent}</h3>
                            <p className="text-gray-500">{match.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold">{match.result}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentMatch;
