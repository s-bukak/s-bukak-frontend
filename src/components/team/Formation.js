import React, { useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { activeSportTabState } from "../../state/sportTabState";
import formationSC from "../../assets/images/formationSC.png";
import formationBB from "../../assets/images/formationBB.png"; // 농구 이미지 추가

const Formation = () => {
  const userType = "팀대표"; // 나중에 로그인 유저는 recoil로 관리 후 userType 가져와야 함
  const activeSportTab = useRecoilValue(activeSportTabState); // 현재 스포츠 탭 (축구/농구)
  const [isEditing, setIsEditing] = useState(false);
  const [players, setPlayers] = useState([
    { id: 1, name: "박수연", number: 9, position: { top: 50, left: 50 } },
    { id: 2, name: "김영희", number: 10, position: { top: 150, left: 150 } },
    // 필요한 만큼 선수 추가
  ]);
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(null);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleMouseDown = (e, index) => {
    if (!isEditing) return;

    setCurrentPlayerIndex(index);
    setDragStartTime(Date.now());
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging || currentPlayerIndex === null) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeft = e.clientX - containerRect.left - 25;
    const newTop = e.clientY - containerRect.top - 25;

    // 동그라미가 컨테이너 밖으로 나가지 않도록 제한
    const boundedLeft = Math.max(
      0,
      Math.min(newLeft, containerRect.width - 50),
    );
    const boundedTop = Math.max(0, Math.min(newTop, containerRect.height - 50));

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].position = {
      left: boundedLeft,
      top: boundedTop,
    };
    setPlayers(updatedPlayers);
  };

  const handleMouseUp = () => {
    const clickDuration = Date.now() - dragStartTime;
    if (clickDuration < 200) {
      // 클릭 이벤트로 간주, 텍스트 편집
      setDragging(false);
      setCurrentPlayerIndex(null);
    } else {
      // 드래그 완료
      setDragging(false);
    }
  };

  return (
    <div
      className="w-64 mb-6"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center">
        <h2 className="text-base font-bold mr-2">포메이션</h2>
        {/* 팀 대표일 때만 편집 버튼 노출 */}
        {userType === "팀대표" && (
          <button
            onClick={handleEditClick}
            className="text-xs font-semibold bg-gray-300 rounded-full px-3 py-1"
          >
            {isEditing ? "완료" : "편집"}
          </button>
        )}
      </div>
      <div className="mt-4 relative" ref={containerRef}>
        <img
          src={activeSportTab === "soccer" ? formationSC : formationBB}
          alt="Formation"
          className={`${activeSportTab === "soccer" ? "h-auto" : "h-64"} rounded-md`}
        />

        {players.map((player, index) => (
          <div
            key={player.id}
            className="absolute flex flex-col items-center cursor-pointer"
            style={{
              top: `${player.position.top}px`,
              left: `${player.position.left}px`,
              cursor: isEditing ? "move" : "default",
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
          >
            <div className="w-6 h-6 bg-emerald-500 border-green-400 border-2 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {player.number}
              </span>{" "}
              {/* 등번호 */}
            </div>
            <div className="text-center mt-0.5 text-sm text-white rounded px-2 bg-green-700 font-semibold">
              {isEditing ? (
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => {
                    const updatedPlayers = [...players];
                    updatedPlayers[index].name = e.target.value;
                    setPlayers(updatedPlayers);
                  }}
                  className="text-center font-semibold text-xs text-black"
                  size={player.name.length || 1} // 텍스트 길이에 따라 입력 필드 크기 조정
                  style={{ minWidth: `${player.name.length}ch` }} // 최소 크기 설정
                  onClick={(e) => e.stopPropagation()} // 텍스트 클릭 시 드래그 동작을 막음
                />
              ) : (
                <span
                  className="inline-block"
                  style={{
                    minWidth: `${player.name.length}ch`,
                    textAlign: "center",
                  }}
                >
                  {player.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Formation;
