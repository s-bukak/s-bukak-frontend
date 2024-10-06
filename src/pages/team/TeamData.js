// teamService.js (더미 데이터 사용)
export const getTeamInfo = async (sport, teamName) => {
    // 로고 경로를 자동으로 생성하는 함수
    const getTeamLogoPath = (sport, team) => {
        try {
            return require(`../../assets/logos/${sport}/${team}.svg`);
        } catch (error) {
            // 로고가 없을 경우 기본 로고 경로로 설정 (예: 로고가 없는 경우)
            return '/assets/logos/default-logo.svg';
        }
    };

    // 더미 데이터 정의
    const dummyData = {
        soccer: {
            'cs-shooting': {
                name: 'CS슈팅',
                logoUrl: getTeamLogoPath('soccer', 'cs-shooting'),
                collageName:'소프트웨어융합대학',
                teamRank: {category: '성곡리그', rank:3},
                recentMatches: [
                    {
                        opponent: 'fc-scale',
                        opponentName: '스케일',
                        score: '5 - 0',
                        league: '북악리그',
                        round: '6',
                        date: '2024.06.03 19:00',
                    },
                    {
                        opponent: 'forest',
                        opponentName: '포레스트',
                        score: '1 - 0',
                        league: '북악리그',
                        round: '5',
                        date: '2024.05.27 18:00',
                    }
                ],
                formationImageUrl: '/assets/formations/4-3-3.svg',
                upcomingMatches: [
                    { date: '2024-03-22', opponent: 'KESA', result: '2-2' },
                    { date: '2024-04-03', opponent: 'COLSC', result: '2-3' },
                    { date: '2024-04-09', opponent: '한밭', result: '1-3' },
                    { date: '2024-04-19', opponent: 'NS', result: '0-1' },
                    { date: '2024-04-30', opponent: '이아스', result: '4-0' },
                ],
            },
            'fc-bit': {
                name: 'FC Bit',
                logoUrl: getTeamLogoPath('soccer', 'fc-bit'),
                teamRank: {category: 'sg', rank:5},
                recentMatches: [
                    { opponent: 'Real Moment', result: '2-1 승' },
                    { opponent: 'VIPers', result: '3-0 승' },
                ],
                formationImageUrl: '/assets/formations/4-4-2.svg',
                upcomingMatches: [
                    {
                        opponent: '스케일',
                        score: '5-0',
                        league: '북악리그',
                        round: '6',
                        date: '2024.06.03 19:00',
                    },
                    {
                        opponent: '포레스트',
                        score: '1-0',
                        league: '북악리그',
                        round: '5',
                        date: '2024.05.27 18:00',
                    }
                ],
            },
            'real-moment': {
                name: 'Real Moment',
                logoUrl: getTeamLogoPath('soccer', 'real-moment'),
                teamRank: {category: 'sg', rank:5},
                recentMatches: [
                    {
                        opponent: '스케일',
                        score: '5-0',
                        league: '북악리그',
                        round: '6',
                        date: '2024.06.03 19:00',
                    },
                    {
                        opponent: '포레스트',
                        score: '1-0',
                        league: '북악리그',
                        round: '5',
                        date: '2024.05.27 18:00',
                    }
                ],
                formationImageUrl: '/assets/formations/3-5-2.svg',
                upcomingMatches: [
                    { date: '2024-10-06', opponent: 'KFA' },
                    { date: '2024-10-13', opponent: 'Forest' },
                ],
            },
            'focus': {
                name: 'Focus',
                logoUrl: getTeamLogoPath('soccer', 'focus'),
                teamRank: {category: 'sg', rank:6},
                recentMatches: [
                    { opponent: 'Real Moment', result: '1-1 무' },
                    { opponent: 'NS', result: '2-3 패' },
                ],
                formationImageUrl: '/assets/formations/4-2-3-1.svg',
                upcomingMatches: [
                    { date: '2024-10-10', opponent: 'VIPers' },
                    { date: '2024-10-15', opponent: 'Forest' },
                ],
            },
            'vipers': {
                name: 'Vipers',
                logoUrl: getTeamLogoPath('soccer', 'vipers'),
                teamRank: {category: 'hg', rank:2},
                recentMatches: [
                    { opponent: 'Focus', result: '3-1 승' },
                    { opponent: 'FC Bit', result: '0-3 패' },
                ],
                formationImageUrl: '/assets/formations/5-3-2.svg',
                upcomingMatches: [
                    { date: '2024-10-05', opponent: 'Shadow' },
                    { date: '2024-10-10', opponent: 'Focus' },
                ],
            },
            // 다른 축구팀 추가 가능
        },
        basketball: {
            'kuba': {
                name: 'KUBA',
                logoUrl: getTeamLogoPath('basketball', 'kuba'),
                recentMatches: [
                    { opponent: 'Warning', result: '82-75 승' },
                    { opponent: 'Man-Q', result: '68-80 패' },
                ],
                upcomingMatches: [
                    { date: '2024-10-06', opponent: 'A-Tempo' },
                    { date: '2024-10-13', opponent: 'Step' },
                ],
            },
            'man-q': {
                name: 'Man-Q',
                logoUrl: getTeamLogoPath('basketball', 'man-q'),
                recentMatches: [
                    { opponent: 'KUBA', result: '80-68 승' },
                    { opponent: 'Step', result: '75-74 승' },
                ],
                upcomingMatches: [
                    { date: '2024-10-07', opponent: 'Warning' },
                    { date: '2024-10-14', opponent: 'FM' },
                ],
            },
            'warning': {
                name: 'Warning',
                logoUrl: getTeamLogoPath('basketball', 'warning'),
                recentMatches: [
                    { opponent: 'KUBA', result: '75-82 패' },
                    { opponent: 'A-Tempo', result: '90-85 승' },
                ],
                upcomingMatches: [
                    { date: '2024-10-05', opponent: 'FM' },
                    { date: '2024-10-12', opponent: 'Step' },
                ],
            },
            'a-tempo': {
                name: 'A-Tempo',
                logoUrl: getTeamLogoPath('basketball', 'a-tempo'),
                recentMatches: [
                    { opponent: 'Man-Q', result: '85-90 패' },
                    { opponent: 'Warning', result: '90-85 승' },
                ],
                upcomingMatches: [
                    { date: '2024-10-08', opponent: 'KUBA' },
                    { date: '2024-10-14', opponent: 'Man-Q' },
                ],
            },
            // 다른 농구팀 추가 가능
        },
    };


    // 요청한 스포츠 및 팀 이름에 맞는 데이터를 반환
    const teamInfo = dummyData[sport]?.[teamName];

    // 팀 정보를 찾지 못했을 때 에러 처리
    if (!teamInfo) {
        throw new Error('해당 팀 정보를 찾을 수 없습니다.');
    }

    return teamInfo;
};
