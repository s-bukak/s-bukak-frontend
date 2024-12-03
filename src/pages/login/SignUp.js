import React, { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { setToken } from "../../utils/token";
import CommonHeader from "../../components/CommonHeader";
import {
    leagueFields,
    teamInfoOptions,
    soccerTeamDivisionOptions,
    basketballTeamDivisionOptions
} from "../../data/login";
import { MdOutlineMail, MdOutlinePerson } from "react-icons/md";

export default function SignUp() {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        isTeamLeader: false,
        leagueField: "",
        teamInfo: "",
        teamDivision: "",
    });

    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [isPrivacyPolicyAccepted, setIsPrivacyPolicyAccepted] = useState(false);
    const [isAllAccepted, setIsAllAccepted] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    // Base64로 인코딩된 데이터 디코딩
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const dataParam = queryParams.get("data");

        if (dataParam) {
            try {
                const decodedString = decodeURIComponent(escape(atob(dataParam)));
                const decodedData = JSON.parse(decodedString);

                setFormData((prevData) => ({
                    ...prevData,
                    email: decodedData.email || "",
                    name: decodedData.name || "",
                }));

                // URL에서 "data" 파라미터 제거
                queryParams.delete("data");
                window.history.replaceState({}, document.title, `${window.location.pathname}?${queryParams}`);
            } catch (error) {
                console.error("Base64 디코딩 오류:", error);
                setErrorMessage("초기 데이터 로드 중 오류가 발생했습니다. 다시 시도해주세요.");
            }
        }
    }, []);

    // 각각의 개별 체크박스 상태 변경 처리
    const handleTermsAcceptedChange = (e) => {
        const isChecked = e.target.checked;
        setIsTermsAccepted(isChecked);
        updateAllAccepted(isChecked, isPrivacyPolicyAccepted);
    };

    const handlePrivacyPolicyAcceptedChange = (e) => {
        const isChecked = e.target.checked;
        setIsPrivacyPolicyAccepted(isChecked);
        updateAllAccepted(isTermsAccepted, isChecked);
    };

    // 전체 동의 체크박스 상태 업데이트
    const handleAllAcceptedChange = (e) => {
        const isChecked = e.target.checked;
        setIsAllAccepted(isChecked);
        setIsTermsAccepted(isChecked);
        setIsPrivacyPolicyAccepted(isChecked);
    };

    // isAllAccepted 상태를 업데이트하는 함수
    const updateAllAccepted = (termsAccepted, privacyPolicyAccepted) => {
        setIsAllAccepted(termsAccepted && privacyPolicyAccepted);
    };

    // Form 데이터 업데이트 핸들러
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));

        // 리그 필드 선택 시 소속 정보 초기화
        if (name === "leagueField") {
            setFormData((prevData) => ({
                ...prevData,
                teamInfo: "",
                teamDivision: "",
            }));
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { email, name, isTeamLeader, leagueField, teamInfo, teamDivision } = formData;

        try {
            setErrorMessage(""); // 이전 에러 메시지 초기화
            const response = await axiosInstance.post("/register", {
                email,
                name,
                isTeamLeader,
                sport: isTeamLeader ? leagueField : "",
                college: isTeamLeader ? teamInfo : "",
                team: isTeamLeader ? teamDivision : "",
            });

            // Authorization 헤더에서 토큰 추출
            const authorizationHeader = response.headers['authorization'];
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error("Invalid token received from server headers");
            }

            const token = authorizationHeader.split(' ')[1]; // 'Bearer ' 뒤의 토큰 추출
            if (!token || typeof token !== "string") {
                throw new Error("Invalid token format");
            }

            setToken(token); // 토큰 저장

            // 회원가입 성공 후 이동
            window.location.href = "/";
        } catch (error) {
            if (error.response) {
                setErrorMessage(
                    error.response.data?.message ||
                    "회원가입 중 서버에서 문제가 발생했습니다. 다시 시도해주세요."
                );
            } else if (error.request) {
                setErrorMessage("서버와의 통신 중 문제가 발생했습니다. 네트워크를 확인해주세요.");
            } else {
                setErrorMessage("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
            }
            console.error("회원가입 중 오류 발생:", error);
        }
    };

    // 소속 팀 옵션 결정
    const currentTeamDivisionOptions =
        formData.leagueField === "축구" ? soccerTeamDivisionOptions : basketballTeamDivisionOptions;

    return (
        <div className="min-h-screen flex flex-col bg-gray-800">
            <CommonHeader />

            <div className="flex flex-1 justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">승부각 회원가입</h2>
                    <form onSubmit={handleSignUp}>
                        {/* 이메일 */}
                        <div className="mb-4">
                            <label className="block text-gray-800 text-sm font-bold mb-2">이메일</label>
                            <div className="flex items-center w-full px-3 py-2 border rounded bg-zinc-100 text-gray-700">
                                <MdOutlineMail className="text-gray-400 mr-2" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="flex-1 bg-transparent outline-none cursor-not-allowed text-gray-400 text-sm"
                                />
                            </div>
                        </div>

                        {/* 이름 */}
                        <div className="mb-8">
                            <label className="block text-gray-800 text-sm font-bold mb-2">이름</label>
                            <div className="flex items-center w-full px-3 py-2 border rounded text-gray-700">
                                <MdOutlinePerson className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="flex-1 bg-transparent outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* 팀 대표자 여부 */}
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                name="isTeamLeader"
                                checked={formData.isTeamLeader}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            <label className="text-gray-800 text-sm font-bold">팀 대표자 계정인 경우</label>
                        </div>

                        <hr className="my-2 border-gray-300" />

                        {/* 팀 대표자 추가 필드 */}
                        {formData.isTeamLeader && (
                            <>
                                <div className="text-xs my-3 text-gray-400">
                                    팀 대표자 계정은 팀 당 한 명만 생성 가능합니다.
                                    <br/>
                                    관리자 검토 과정에서 중복 신청, 소속 정보 불일치 등의 사유 발생 시 신청이 반려될 수 있습니다.
                                    신중하게 선택하고 검토하신 후 회원가입을 진행해 주세요.
                                </div>
                                <div className="flex justify-between mb-2 space-x-2">
                                    {/* 리그 필드 */}
                                    <select
                                        name="leagueField"
                                        value={formData.leagueField}
                                        onChange={handleInputChange}
                                        className="w-1/3 px-2 py-2 border rounded text-gray-700 text-sm"
                                        required
                                    >
                                        <option value="" disabled>
                                            리그 선택
                                        </option>
                                        {leagueFields.map((field, index) => (
                                            <option key={index} value={field}>
                                                {field}
                                            </option>
                                        ))}
                                    </select>

                                    {/* 소속 정보 */}
                                    <select
                                        name="teamInfo"
                                        value={formData.teamInfo}
                                        onChange={handleInputChange}
                                        className="w-1/3 px-2 py-2 border rounded text-gray-700 text-sm"
                                        required
                                        disabled={!formData.leagueField}
                                    >
                                        <option value="" disabled>
                                            소속 정보
                                        </option>
                                        {teamInfoOptions[formData.leagueField]?.map((info, index) => (
                                            <option key={index} value={info}>
                                                {info}
                                            </option>
                                        ))}
                                    </select>

                                    {/* 팀명 */}
                                    <select
                                        name="teamDivision"
                                        value={formData.teamDivision}
                                        onChange={handleInputChange}
                                        className="w-1/3 px-2 py-2 border rounded text-gray-700 text-sm"
                                        required
                                        disabled={!formData.teamInfo}
                                    >
                                        <option value="" disabled>
                                            팀명
                                        </option>
                                        {currentTeamDivisionOptions[formData.teamInfo]?.map((division, index) => (
                                            <option key={index} value={division}>
                                                {division}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <hr className="my-2 border-gray-300"/>
                            </>
                        )}

                        {/* 동의 체크박스 */}
                        <div className="mb-2">
                            <input
                                type="checkbox"
                                checked={isAllAccepted}
                                onChange={handleAllAcceptedChange}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-700">전체 동의</label>
                        </div>

                        <div className="mb-2">
                            <input
                                type="checkbox"
                                checked={isTermsAccepted}
                                onChange={handleTermsAcceptedChange}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-700">
                                <a href="/terms" className="text-sky-600 underline">
                                    이용약관
                                </a>
                                <span> 동의 </span> <span className="text-red-700"> * </span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <input
                                type="checkbox"
                                checked={isPrivacyPolicyAccepted}
                                onChange={handlePrivacyPolicyAcceptedChange}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-700">
                                <a href="/privacy-policy" className="text-sky-600 underline">
                                    개인정보 수집 및 이용
                                </a>
                                <span> 동의 </span> <span className="text-red-700"> * </span>
                            </label>
                        </div>

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            disabled={!isTermsAccepted || !isPrivacyPolicyAccepted}
                            className={`w-full py-2 px-4 font-bold text-white rounded ${
                                isTermsAccepted && isPrivacyPolicyAccepted ? "bg-sky-600" : "bg-gray-400"
                            }`}
                        >
                            회원가입
                        </button>
                    </form>

                    {errorMessage && <p className="text-red-500 text-xs mt-4">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}