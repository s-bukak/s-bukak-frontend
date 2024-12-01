// 수연 찬우 보시오 - !!!!!
// 0. 축구, 농구 각 눌린 탭을 Recoil을 사용해서 관리하는데, 현재 상태를 불러와서 다른 컴포넌트 띄우는 방법
import React from 'react';
import { useRecoilValue } from 'recoil';
import { activeSportTabState } from '../../state/sportTabState';
import MultiBanner from '../../components/home/MultiBanner';
import Betting from "../../components/home/Betting";
import Ranking from "../../components/home/Ranking";
import {useNavigate} from "react-router-dom";
import Calendar from '../../components/home/Calendar';

const Home = () => {
    const activeSportTab = useRecoilValue(activeSportTabState);
    const navigate = useNavigate();

    return (
        <div>
            <MultiBanner activeSportTab={activeSportTab}/>

            <div className="grid grid-cols-3 gap-10 px-28 py-20">
                {/* 승부예측 Component */}
                <div className="col-span-2">
                    <div>
                        <div className="text-3xl font-bold mb-2">승부예측</div>
                        <div className="text-gray-500 mb-10">팀 로고 또는 팀명을 누르면 승부예측에 참여할 수 있어요!</div>
                    </div>
                    <Betting />

                    {/* 응원메시지 Component */}
                    <div className="mt-20">
                        <div className="text-3xl font-bold mb-2">응원 메시지 남기기</div>
                        <div className="text-gray-500 mb-10">
                            <p>앞서 진행된 북악리그 {activeSportTab === 'soccer' ? '축구' : '농구'} 경기에 대한 다양한 리뷰와</p>
                            <p>추후 진행될 북악리그 {activeSportTab === 'soccer' ? '축구' : '농구'} 경기에 대해 기대하는 마음을 담아 응원 메시지를 남겨보세요!</p>
                            <br/>
                            <p>선후배 및 동기들에게 전하지 못했던 애정어린 마음을 '익명' 기능을 통해 남길 수 있어요.</p>
                        </div>
                    </div>
                </div>

                {/* 팀 랭킹 Component */}
                <div className="col-span-1">
                    <div>
                        <div className="text-3xl font-bold mb-2 cursor-pointer" onClick={() => navigate('/ranking')}>팀 랭킹</div>
                        <div className="text-gray-500 mb-14">
                            <p>우측 상단의 랭킹 버튼을 누르면</p>
                            <p>성곡리그 / 해공리그 각각의 팀 랭킹을 볼 수 있어요!</p>
                        </div>
                    </div>
                    <Ranking />

                    {/* 캘린더 Component */}
                    <div className="mt-20">
                      <Calendar/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
