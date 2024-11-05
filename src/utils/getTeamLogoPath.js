export const getTeamLogoPath = (sport, team) => {
    try {
        return require(`../assets/logos/${sport}/${team}.svg`);
    } catch (error) {
        // 로고가 없을 경우 기본 로고 경로로 설정 (예: 로고가 없는 경우)
        return "/assets/logos/default-logo.svg";
    }
};
