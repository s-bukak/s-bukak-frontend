import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import CommonHeader from "../../components/CommonHeader";
import { jwtDecode } from 'jwt-decode';
import { DOMAIN_NAME } from "../../App";

export default function SignIn() {
    const [errorMessage, setErrorMessage] = useState('');

    const handleLoginSuccess = (response) => {
        // const credential = response.credential;
        //
        // // JWT 토큰을 디코딩하여 사용자 정보 추출
        // const userInfo = jwtDecode(credential);
        //
        // // 이메일과 이름을 localStorage에 저장하여 회원가입 시 활용
        // localStorage.setItem('userEmail', userInfo.email);
        // localStorage.setItem('userName', userInfo.name);

        // 서버로 토큰 전송 후, 서버에서 리다이렉트 처리
        window.location.href = `${DOMAIN_NAME}/oauth2/authorization/google`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-800">
            <CommonHeader />

            {/* 가운데 컨텐츠 */}
            <div className="flex flex-col justify-center items-center flex-grow">
                <div className="text-center w-full max-w-lg">
                    <h1 className="text-2xl text-white mb-4">반가워요!</h1>
                    <p className="text-2xl text-white mb-4">
                        국민대학교 북악리그 전용 웹사이트 <br/>
                        <strong className="!text-white">&lt;우리 오늘, 승부 각 : 勝 북악&gt;</strong> 입니다.
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
                            <source src="/Intro.webm" type="video/mp4"/>
                        </video>
                    </div>

                    {/* 구글 로그인 버튼 */}
                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
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
