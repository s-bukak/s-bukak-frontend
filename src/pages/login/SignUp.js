import React, { useState } from 'react';
import axios from 'axios';
import CommonHeader from "../../components/CommonHeader";
import {DOMAIN_NAME} from "../../App";

export default function SignUp() {
    const [email] = useState('example@kookim.ac.kr');  // 구글 로그인에서 가져오는 이메일
    const [name, setName] = useState('승부각');  // 구글 로그인에서 가져오는 이름, 수정 가능
    const [isTeamLeader, setIsTeamLeader] = useState(false);
    const [leagueField, setLeagueField] = useState(''); // 북악리그 분야
    const [teamInfo, setTeamInfo] = useState(''); // 소속 정보
    const [teamDivision, setTeamDivision] = useState(''); // 소속 팀명
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isPrivacyPolicyAccepted, setIsPrivacyPolicyAccepted] = useState(false);
    const [isAllAccepted, setIsAllAccepted] = useState(false); // 전체 동의 체크박스 상태

    // 북악리그 분야 리스트
    const leagueFields = ['축구', '농구'];

    // 소속 정보 리스트 (축구와 농구 선택 시 다르게 나타남)
    const teamInfoOptions = {
        축구: ["건축대학", "경상대학", "경영대학", "경영대학 AI빅데이터융합경영학과", "경영대학 경영정보학부", "경영대학 재무금융회계학부", "과학기술대학 나노전자물리학과",
            "과학기술대학 산림환경시스템학과 & 임산생명공학과", "글로벌인문지역대학 & 사회과학대학", "법과대학", "사회과학대학 미디어광고학부",
            "사회과학대학 사회학과", "사회과학대학 정치외교학과", "사회과학대학 행정학과", "소프트웨어융합대학", "자동차융합대학", "창의공과대학 건설시스템공학부",
            "창의공과대학 기계공학부", "창의공과대학 신소재공학부", "창의공과대학 전자공학부", "체육대학", "학군단", "기타"],
        농구: ["건축대학", "경상대학", "경영대학", "과학기술대학", "글로벌인문지역대학 & 사회과학대학", "법과대학", "사회과학대학 미디어광고학부",
            "소프트웨어융합대학", "자동차융합대학", "창의공과대학 건설시스템공학부", "창의공과대학 전자공학부", "기타"]

    };

    // 축구 팀명 리스트
    const soccerTeamDivisionOptions = {
        "건축대학": ['FC SCALE'],
        "경상대학": ['쉐도우'],
        "경영대학": ['바이퍼스'],
        "경영대학 AI빅데이터융합경영학과": ['BAS'],
        "경영대학 경영정보학부": ['FC BIT'],
        "경영대학 재무금융회계학부": ['FIAV'],
        "과학기술대학 나노전자물리학과": ['네피스트'],
        "과학기술대학 산림환경시스템학과 & 임산생명공학과": ['포레스트'],
        "글로벌인문지역대학 & 사회과학대학": ['야스크'],
        "법과대학": ['컬스'],
        "사회과학대학 미디어광고학부": ['로니즈'],
        "사회과학대학 사회학과": ['아레스'],
        "사회과학대학 정치외교학과": ['꺄멜레온'],
        "사회과학대학 행정학과": ['판타지스타'],
        "소프트웨어융합대학": ['CS슈팅'],
        "자동차융합대학": ['KAFA'],
        "창의공과대학 건설시스템공학부": ['레알모멘트'],
        "창의공과대학 기계공학부": ['공사랑'],
        "창의공과대학 신소재공학부": ['포리원'],
        "창의공과대학 전자공학부": ['KESA'],
        "체육대학": ['한마음'],
        "학군단": ['아이구'],
        "기타": ['FOCUS', 'NS'],
    };

    // 농구 팀명 리스트
    const basketballTeamDivisionOptions = {
        "건축대학": ['아키템포'],
        "경상대학": ['맨큐'],
        "경영대학": ['CEO'],
        "과학기술대학": ['STEP'],
        "글로벌인문지역대학 & 사회과학대학": ['FM'],
        "법과대학": ['MBL'],
        "사회과학대학 미디어광고학부": ['워닝'],
        "소프트웨어융합대학": ['CS점핑'],
        "자동차융합대학": ['FWD'],
        "창의공과대학 건설시스템공학부": ['GG'],
        "창의공과대학 전자공학부": ['코티스트'],
        "기타": ['KUBA', 'TAB'],
    };

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

                // 서버에서 받은 Authorization 헤더에서 토큰 추출
                const token = res.headers['authorization'];

                // Authorization 헤더 형식이 'Bearer <token>'일 경우 토큰만 추출
                const bearerToken = token && token.split(' ')[1]; // 'Bearer ' 다음의 실제 토큰 부분만 가져옴

                if (bearerToken) {
                    // 로그인 페이지로 토큰을 넘겨 이동 처리
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
            <CommonHeader/>

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
                                onChange={(e) => setName(e.target.value)}  // 이름 수정 가능하게 변경
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

                        {/* 구분선 */}
                        <hr className="my-2 border-gray-300"/>

                        {/* 팀 대표자 체크박스가 선택되었을 경우 추가 필드 렌더링 */}
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
                                    {/* 북악리그 분야 */}
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

                                    {/* 소속 정보 */}
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

                                    {/* 소속 팀명 */}
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

                        {/* 전체 동의 */}
                        <div className="mb-2">
                            <input
                                type="checkbox"
                                checked={isAllAccepted}
                                onChange={handleAllAcceptedChange}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-700">전체 동의</label>
                        </div>

                        {/* 구분선 */}
                        <hr className="my-2 border-gray-300"/>

                        {/* 약관 동의 */}
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

                        {/* 개인정보 수집 동의 */}
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

                        {/* 회원가입 버튼 */}
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
