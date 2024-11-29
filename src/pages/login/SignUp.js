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
            } catch (error) {
                console.error("Base64 디코딩 오류:", error);
            }
        }
    }, []);

    // 전체 동의 체크박스 처리
    const handleAllAcceptedChange = (e) => {
        const isChecked = e.target.checked;
        setIsAllAccepted(isChecked);
        setIsTermsAccepted(isChecked);
        setIsPrivacyPolicyAccepted(isChecked);
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
            const response = await axiosInstance.post("/register", {
                email,
                name,
                isTeamLeader,
                sport: isTeamLeader ? leagueField : "",
                college: isTeamLeader ? teamInfo : "",
                team: isTeamLeader ? teamDivision : "",
            });

            const token = response.headers["authorization"]?.split(" ")[1];
            if (token) {
                setToken(token);
                console.log("회원가입 성공");
                window.location.href = "/";
            } else {
                console.error("토큰 없음");
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생:", error.response?.data || error);
            setErrorMessage("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
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
                                    className="flex-1 bg-transparent outline-none cursor-not-allowed text-gray-400"
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
                                    className="flex-1 bg-transparent outline-none"
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
                                    팀 대표자 계정으로 가입 시 권한 부여에 1~3일 소요됩니다.
                                    <br />
                                    정보를 정확히 입력해주세요.
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
                            </>
                        )}

                        <hr className="my-2 border-gray-300" />

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
                                onChange={(e) => setIsTermsAccepted(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-700">
                                <a href="/terms" className="text-sky-600 underline">
                                    이용약관
                                </a>
                                에 동의
                            </label>
                        </div>

                        <div className="mb-4">
                            <input
                                type="checkbox"
                                checked={isPrivacyPolicyAccepted}
                                onChange={(e) => setIsPrivacyPolicyAccepted(e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-700">
                                <a href="/privacy-policy" className="text-sky-600 underline">
                                    개인정보 수집 및 이용
                                </a>
                                에 동의
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