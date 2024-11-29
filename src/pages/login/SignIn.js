import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import CommonHeader from "../../components/CommonHeader";
import {DOMAIN_NAME} from "../../App";

export default function SignIn() {
    const [errorMessage, setErrorMessage] = useState("");

    const handleLoginSuccess = () => {
        setErrorMessage('');
        window.location.href = `${DOMAIN_NAME}/oauth2/authorization/google`;
    };


    return (
        <div className="min-h-screen flex flex-col bg-gray-800">
            <CommonHeader />

            <div className="flex flex-col justify-center items-center flex-grow">
                <div className="text-center w-full max-w-lg">
                    <h1 className="text-2xl text-white mb-4">반가워요!</h1>
                    <p className="text-2xl text-white mb-4">
                        국민대학교 북악리그 전용 웹사이트 <br/>
                        <strong className="!text-white">&lt;우리 오늘, 승부 각 : 勝 북악&gt;</strong> 입니다.
                    </p>

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

                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={() => setErrorMessage('로그인 실패')}
                        />
                    </div>

                    {errorMessage && <p className="text-gray-400 text-xs mt-4">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}
