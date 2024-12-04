import React from 'react';
import {useRecoilValue} from 'recoil';
import {activeSportTabState} from '../../state/sportTabState';
import MultiBanner from '../../components/home/MultiBanner';
import Betting from "../../components/home/Betting";
import Ranking from "../../components/home/Ranking";
import {useNavigate} from "react-router-dom";
import Calendar from '../../components/home/Calendar';
import MessageList from "../../components/team/MessageList";

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
                    <Betting/>

                    {/* 응원메시지 Component */}
                    <div className="mt-20">
                        <div className="text-3xl font-bold mb-2">응원 메시지 남기기</div>
                        <div className="text-gray-500 mb-2">
                            <p>앞서 진행된 북악리그 {activeSportTab === 'soccer' ? '축구' : '농구'} 경기에 대한 다양한 리뷰와</p>
                            <p>추후 진행될 북악리그 {activeSportTab === 'soccer' ? '축구' : '농구'} 경기에 대해 기대하는 마음을 담아 응원 메시지를
                                남겨보세요!</p>
                            <br/>
                            <p>선후배 및 동기들에게 전하지 못했던 애정어린 마음을 '익명' 기능을 통해 남길 수 있어요.</p>
                        </div>
                        <MessageList
                            style={{
                                minHeight: "40vh", // 최소 높이 설정
                                maxHeight: "50vh", // 최대 높이 설정 (스크롤 활성화)
                                overflowY: "auto", // 세로 스크롤 활성화
                                marginTop: "auto",
                            }}
                        />
                    </div>
                </div>

                {/* 팀 랭킹 Component */}
                <div className="col-span-1">
                    <div>
                        <div className="text-3xl font-bold mb-2 cursor-pointer" onClick={() => navigate('/ranking')}>팀
                            랭킹
                        </div>
                        <div className="text-gray-500 mb-14">
                            <p>우측 상단의 랭킹 버튼을 누르면</p>
                            <p>성곡리그 / 해공리그 각각의 팀 랭킹을 볼 수 있어요!</p>
                        </div>
                    </div>
                    <Ranking/>

                    {/* 캘린더 Component */}
                    <div className="mt-20">
                        <div className="text-3xl font-bold mb-2 cursor-pointer"
                             onClick={() => navigate('/schedule')}>캘린더
                        </div>
                        <div className="text-gray-500 mb-10">
                            <p>북악리그 축구 및 농구 경기 일정을 한 데 모아 볼 수 있어요!</p>
                            <p>실제로 보면 더욱 재밌는 북악리그,</p>
                            <p>선후배 및 동기와 함께 직관하러 가볼까요?</p>
                            <br/>
                            <p>날짜를 클릭하면 하단에서 상세 일정을 볼 수 있어요.</p>
                        </div>
                      <Calendar/>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
