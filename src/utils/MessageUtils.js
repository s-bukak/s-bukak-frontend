export const user = {
  userId: 5,
  userName: "정찬우(학부생-소프트웨어학부 소프트웨어전공)",
  userImage: "/assets/test/userImage.jpg",
};
export const cleanbotMessage = {
  userId: 0,
  username: "클린봇",
  userImage: "/src/assets/images/cleanbot.svg",
  content:
    "해당 커뮤니티는 건전한 소통 환경을 유지하기 위해 비속어 필터링 시스템이 작동 중입니다. 부적절한 표현이 포함된 댓글은 자동으로 필터링되어 표시되지 않을 수 있습니다. 여러분의 이해와 협조에 감사드립니다.",
};

export const initialChatList = [
  {
    id: 1,
    userId: 1,
    username: "익명",
    userImage: "../../assets/test/userImage.jpg",
    content: "클린봇에 의해 필터링 된 댓글입니다.",
    createdAt: "05/01 15:33",
    isAnonymous: true,
    isHidden: true,
  },
  {
    id: 2,
    userId: 3,
    username: "안선영(학부생-인공지능학부 인공지능전공)",
    userImage: "../../assets/test/userImage.jpg",
    content: "소융의 자랑 슈팅!!!!!",
    createdAt: "05/01 15:35",
    isAnonymous: false,
    isHidden: false,
  },
  {
    id: 3,
    userId: 4,
    username: "익명",
    userImage: "../../assets/test/userImage.jpg",
    content: "요즘 날도 더운데 경기 뛰느라 고생했어 형들 파이팅이야",
    createdAt: "05/01 15:35",
    isAnonymous: true,
    isHidden: false,
  },
  {
    id: 4,
    userId: 5,
    username: "정찬우(학부생-소프트웨어학부 소프트웨어전공)",
    userImage: "../../assets/test/userImage.jpg",
    content: "저 응원 많이 해주세요",
    createdAt: "05/01 15:37",
    isAnonymous: false,
    isHidden: false,
  },
  {
    id: 5,
    userId: 6,
    username: "익명",
    userImage: "../../assets/test/userImage.jpg",
    content: "3번 오빠 멋있어요",
    createdAt: "05/01 15:40",
    isAnonymous: true,
    isHidden: false,
  },
  {
    id: 6,
    userId: 7,
    username: "이정욱(학부생-소프트웨어학부 소프트웨어전공)",
    userImage: "../../assets/test/userImage.jpg",
    content:
      "오늘 경기 정말 최고였습니다... 열심히 뛰어준 선수들 정말 수고했어요!! 화이팅!",
    createdAt: "05/01 15:40",
    isAnonymous: false,
    isHidden: false,
  },
];

export const homeMessageSubtitle =
  "앞서 진행된 북악리그 축구 경기에 대한 다양한 리뷰와\n추후 진행될 북악리그 축구 경기에 대해 기대하는 마음을 담아 응원메세지를 남겨보세요!\n\n선후배 및 동기들에게 전하지 못했던 애정어린 마음을 '익명' 기능을 통해 남길 수 있어요.";

export const teamMessageSubtitle =
  "매 경기에 최선을 다하는 선수들을 위해 응원메세지를 남겨보세요!";
