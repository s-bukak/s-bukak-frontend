export const greeting =
  '안녕하세요! 저는 국민대학교 북악리그를 소개하고 도와드릴 귀염둥이 챗봇, 부각이예요! 🎉⚽🏀\n경기 일정, 팀 정보, 승부 예측 결과 등 북악리그에 대한 모든 정보를 알려주는 든든한 친구랍니다. \n궁금한 게 있으면 언제든 저를 불러주세요! 😊';
export const user = {
  userId: 5,
  userName: '정찬우(학부생-소프트웨어학부 소프트웨어전공)',
  userImage: '../assets/test/userImage.jpg',
};

export const chatBotPlaceholder = '무엇이든 물어보세요.';

export const initialChatList = [
  {
    id: 1,
    userId: 1,
    username: '익명',
    userImage: '../../assets/test/userImage.jpg',
    content: '안녕하세요! 부각이에요. 무엇을 도와드릴까요?',
    createdAt: '05/01 15:33',
    sender: 'bot', // AI 챗봇
  },
  {
    id: 2,
    userId: 5,
    username: '사용자',
    userImage: '../../assets/test/userImage.jpg',
    content: '안녕하세요! 오늘 경기 일정이 어떻게 되나요?',
    createdAt: '05/01 15:34',
    sender: 'user', // 사용자
  },
  {
    id: 3,
    userId: 1,
    username: '익명',
    userImage: '../../assets/test/userImage.jpg',
    content: '오늘 경기는 오후 5시에 시작합니다! 위치는 소융구장입니다.',
    createdAt: '05/01 15:35',
    sender: 'bot',
  },
  {
    id: 4,
    userId: 5,
    username: '사용자',
    userImage: '../../assets/test/userImage.jpg',
    content: '감사합니다! 그럼 경기 종료 시간은 언제쯤일까요?',
    createdAt: '05/01 15:36',
    sender: 'user',
  },
  {
    id: 5,
    userId: 1,
    username: '익명',
    userImage: '../../assets/test/userImage.jpg',
    content:
      '경기 종료 시간은 약 2시간 후인 오후 7시쯤 예상됩니다. 하지만 상황에 따라 조금 변동될 수 있어요.',
    createdAt: '05/01 15:37',
    sender: 'bot',
  },
  {
    id: 6,
    userId: 5,
    username: '사용자',
    userImage: '../../assets/test/userImage.jpg',
    content: '알겠습니다. 친절한 답변 감사합니다!',
    createdAt: '05/01 15:38',
    sender: 'user',
  },
];
