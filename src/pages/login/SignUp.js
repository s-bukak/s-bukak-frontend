import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommonHeader from "../../components/CommonHeader";
import { DOMAIN_NAME } from "../../App";
import { leagueFields, teamInfoOptions, soccerTeamDivisionOptions, basketballTeamDivisionOptions } from "../../data/login";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [leagueField, setLeagueField] = useState('');
    const [teamInfo, setTeamInfo] = useState('');
    const [teamDivision, setTeamDivision] = useState('');
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isPrivacyPolicyAccepted, setIsPrivacyPolicyAccepted] = useState(false);
    const [isAllAccepted, setIsAllAccepted] = useState(false);

    // URL 쿼리 파라미터에서 email과 name을 추출하여 상태에 설정
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const emailParam = queryParams.get('email');
        const nameParam = queryParams.get('name');

        if (emailParam) setEmail(emailParam);
        if (nameParam) setName(nameParam);
    }, []);

    // 전체 동의 체크박스 처리
    const handleAllAcceptedChange = (e) => {
        const isChecked = e.target.checked;
        setIsAllAccepted(isChecked);
        setIsTermsAccepted(isChecked);
        setIsPrivacyPolicyAccepted(isChecked);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${DOMAIN_NAME}/register`, {
                email,
                name,
                isTeamLeader,
                sport: isTeamLeader ? leagueField : null,
                collage: isTeamLeader ? teamInfo : null,
                team: isTeamLeader ? teamDivision : null,
            });

            if (res.data.success) {
                console.log('회원가입 성공');

                const token = res.headers['authorization'];
                const bearerToken = token && token.split(' ')[1];

                if (bearerToken) {
                    window.location.href = `/signin?token=${bearerToken}`;
                } else {
                    console.log('토큰 추출 실패');
                }
            } else {
                console.log('회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 중 오류 발생', error);
        }
    };

    const currentTeamDivisionOptions = leagueField === '축구' ? soccerTeamDivisionOptions : basketballTeamDivisionOptions;

    return (
        <div className="min-h-screen flex flex-col bg-gray-800">
            <CommonHeader />

            <div className="flex flex-1 justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">승부각 회원가입</h2>
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label className="block text-gray-800 text-sm font-bold mb-2">이메일</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full px-3 py-2 border rounded shadow-sm bg-zinc-100 text-gray-700 cursor-not-allowed"
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-gray-800 text-sm font-bold mb-2">이름</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded shadow-sm text-gray-700"
                            />
                        </div>

                        {/* 팀 대표자 계정 여부 */}
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={isTeamLeader}
                                onChange={(e) => setIsTeamLeader(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-gray-800 text-sm font-bold">팀 대표자 계정인 경우</label>
                        </div>

                        <hr className="my-2 border-gray-300"/>

                        {isTeamLeader && (
                            <>
                                <div className="text-xs my-3 text-gray-400">
                                    팀 대표자 계정으로 가입하는 경우,
                                    <br/>
                                    팀 대표자 권한 부여에 약 1~3일 정도 소요됩니다.
                                    <br/>
                                    팀 대표자 계정 중복 신청, 소속 정보 불일치 등의 사유 발생 시 무통보 반려됩니다.
                                    신중하게 선택하고 검토하신 후 회원가입을 진행해 주세요.
                                </div>
                                <div className="flex justify-between mb-2 space-x-2">
                                    <div className="w-1/3">
                                        <select
                                            value={leagueField}
                                            onChange={(e) => {
                                                setLeagueField(e.target.value);
                                                setTeamInfo('');
                                                setTeamDivision('');
                                            }}
                                            className="w-full px-2 py-2 border rounded shadow-sm text-gray-700 text-sm"
                                            required
                                        >
                                            <option value="" disabled className="text-gray-400">북악리그 분야</option>
                                            {leagueFields.map((field, index) => (
                                                <option key={index} value={field}>
                                                    {field}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-1/3">
                                        <select
                                            value={teamInfo}
                                            onChange={(e) => {
                                                setTeamInfo(e.target.value);
                                                setTeamDivision('');
                                            }}
                                            className="w-full px-2 py-2 border rounded shadow-sm text-gray-700 text-sm"
                                            required
                                            disabled={!leagueField}
                                        >
                                            <option value="" disabled className="text-gray-400">소속 정보</option>
                                            {leagueField &&
                                                teamInfoOptions[leagueField]?.map((info, index) => (
                                                    <option key={index} value={info}>
                                                        {info}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="w-1/3">
                                        <select
                                            value={teamDivision}
                                            onChange={(e) => setTeamDivision(e.target.value)}
                                            className="w-full px-2 py-2 border rounded shadow-sm text-gray-700 text-sm"
                                            required
                                            disabled={!teamInfo}
                                        >
                                            <option value="" disabled className="text-gray-400">소속 팀명</option>
                                            {teamInfo &&
                                                currentTeamDivisionOptions[teamInfo]?.map((division, index) => (
                                                    <option key={index} value={division}>
                                                        {division}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="mb-2">
                            <input
                                type="checkbox"
                                checked={isAllAccepted}
                                onChange={handleAllAcceptedChange}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-700">전체 동의</label>
                        </div>

                        <hr className="my-2 border-gray-300"/>

                        <div className="mb-2">
                            <input
                                type="checkbox"
                                checked={isTermsAccepted}
                                onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-sm">
                                <button onClick={() => window.location.href = '/terms'}
                                        className="text-sky-600 underline">이용약관
                                </button>
                                <span className="text-gray-700"> 동의</span>
                                <span className="text-red-500"> *</span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <input
                                type="checkbox"
                                checked={isPrivacyPolicyAccepted}
                                onChange={(e) => setIsPrivacyPolicyAccepted(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-sm">
                                <button onClick={() => window.location.href = '/terms'}
                                        className="text-sky-600 underline">승부각 개인정보 수집 및 이용
                                </button>
                                <span className="text-gray-700"> 동의</span>
                                <span className="text-red-500"> *</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!isTermsAccepted || !isPrivacyPolicyAccepted}
                            className={`w-full py-2 px-4 rounded font-bold text-white ${
                                isTermsAccepted && isPrivacyPolicyAccepted ? 'bg-sky-600' : 'bg-gray-400'
                            }`}
                        >
                            회원가입
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
