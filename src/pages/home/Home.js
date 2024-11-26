// 수연 찬우 보시오 - !!!!!
// 0. 축구, 농구 각 눌린 탭을 Recoil을 사용해서 관리하는데, 현재 상태를 불러와서 다른 컴포넌트 띄우는 방법
import React from 'react';
import { useRecoilValue } from 'recoil';
import { activeSportTabState } from '../../state/sportTabState'; // 1. Recoil 상태 불러오기
import Calendar from '../../components/home/Calendar';

const Home = () => {
    const activeSportTab = useRecoilValue(activeSportTabState); // 2. 현재 활성화된 탭 확인

    return (
        <div>
            {activeSportTab === 'soccer' ? ( // 3. 현재 활성화된 탭에 따라 다른 컴포넌트를 렌더링
                <div>축구 관련 컴포넌트</div>
            ) : (
                <div>농구 관련 컴포넌트</div>
            )}
            <Calendar/>
        </div>
    );
};

export default Home;
