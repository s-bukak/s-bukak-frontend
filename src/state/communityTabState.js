import { atom } from "recoil";

// 현재 활성화된 탭 상태
export const activeTabState = atom({
  key: 'activeTabState',
  default: '게시판 정보', // 기본값: 게시판 정보
});

// 현재 활성화된 세부 탭 상태 (e.g., 자유게시판, 내가 쓴 글 등)
export const currentTabState = atom({
  key: 'currentTabState',
  default: 'free-community', // 기본값: 자유 게시판
});
