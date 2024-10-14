import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import CommonHeader from "../../components/CommonHeader";

export default function SignIn() {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleGoogleLoginSuccess = async (response) => {
        try {
            const token = response.credential;

            // 서버에 토큰을 보내고 회원 여부 확인
            const res = await axios.post('로그인-api-주소', { token });

            if (res.data.success) {
                if (res.data.isNewUser) {
                    // 1. 신규 회원일 경우 회원가입 페이지로 리다이렉트
                    navigate('/signup', { state: { token } });
                } else {
                    // 2. 기존 회원일 경우 로그인 성공 후 쿼리 파라미터로 토큰 전달
                    navigate(`/?token=${token}`);
                }
            } else {
                setErrorMessage('로그인 실패');
            }
        } catch (error) {
            console.error('Error during Google login', error);
            setErrorMessage('로그인 중 오류 발생');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-800">
            <CommonHeader />

            {/* 가운데 컨텐츠 */}
            <div className="flex flex-col justify-center items-center flex-grow">
                <div className="text-center w-full max-w-lg">
                    <h1 className="text-2xl text-white mb-4">반가워요!</h1>
                    <p className="text-2xl text-white mb-4">
                        국민대학교 북악리그 전용 웹사이트 <br />
                        <strong>&lt;우리 오늘, 승부 각 : 勝 북악&gt;</strong> 입니다.
                    </p>

                    {/* 비디오 가운데 정렬 및 크기 조절 */}
                    <div className="mb-6 flex justify-center">
                        <video
                            className="custom-video"
                            autoPlay
                            loop
                            muted
                            style={{
                                width: '350px',
                                height: 'auto',
                            }}
                        >
                            <source src="/Intro.webm" type="video/mp4" />
                        </video>
                    </div>

                    {/* 구글 로그인 버튼 */}
                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={() => setErrorMessage('로그인 실패')}
                        />
                    </div>

                    {/* 에러 메시지 */}
                    {errorMessage && <p className="text-gray-400 text-xs mt-4">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}
