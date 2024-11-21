import React, { useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { activeSportTabState } from "../../state/sportTabState";
import formationSC from "../../assets/images/formationSC.svg";
import formationBB from "../../assets/images/formationBB.svg";
import { MdCancel } from "react-icons/md";
import usePostPlayers from "../../hooks/usePostPlayers";

const PlayerManagementPanel = ({
  players,
  setPlayers,
  activeSportTab,
  togglePlayerSelection,
  isEditing,
}) => {
  const addPlayer = () => {
    const randomPosition = {
      top: Math.floor(Math.random() * 200),
      left: Math.floor(Math.random() * 200),
    };
    setPlayers((prevPlayers) => [
      ...prevPlayers,
      {
        id: String(Date.now()), // 고유 ID 생성
        name: "",
        number: String(prevPlayers.length + 1),
        position: randomPosition,
        isSelected: false,
      },
    ]);
  };

  const deletePlayer = (id) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const updatePlayer = (id, field, value) => {
    const updatedPlayers = players.map((player) =>
      player.id === id
        ? {
            ...player,
            [field]: field === "number" ? String(value) : value, // number 필드는 항상 문자열로 변환
          }
        : player,
    );
    setPlayers(updatedPlayers);
  };

  return (
    <div className="mt-4">
      <div className="flex">
        <h3 className="text-md font-bold mb-2">전체 선수 명단</h3>
        {isEditing && (
          <button
            onClick={addPlayer}
            className="text-xs font-semibold bg-gray-700 text-white rounded-full h-6 w-16 ml-2"
          >
            선수 추가
          </button>
        )}
      </div>

      <div className="flex overflow-x-auto space-x-1">
        {players.map((player) => (
          <div
            className="w-20 flex flex-col space-y-1 items-center"
            key={player.id}
          >
            <div
              className={`w-16 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer p-1 ${
                player.isSelected
                  ? activeSportTab === "soccer"
                    ? "text-white bg-gradient-to-b from-emerald-800 to-gray-800"
                    : "text-white bg-gradient-to-b from-yellow-600 to-gray-800"
                  : "bg-gradient-to-b from-gray-200 to-gray-400"
              }`}
              style={{
                clipPath:
                  "polygon(50% 0%, 95% 15%, 95% 85%, 50% 100%, 5% 85%, 5% 15%)",
              }}
              onClick={() => isEditing && togglePlayerSelection(player.id)}
            >
              <input
                value={player.number}
                onChange={(e) =>
                  updatePlayer(player.id, "number", e.target.value)
                }
                className="w-14 text-center bg-transparent outline-none font-bold text-3xl"
                disabled={!isEditing}
              />
              <input
                value={player.name}
                placeholder="이름"
                onChange={(e) =>
                  updatePlayer(player.id, "name", e.target.value)
                }
                className="text-center rounded px-2 text-xs w-14 bg-transparent font-bold"
                disabled={!isEditing}
              />
            </div>
            {isEditing && (
              <button
                onClick={() => deletePlayer(player.id)}
                className="items-center"
              >
                <MdCancel />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Formation = ({ owner }) => {
  const userType = "팀대표";
  const activeSportTab = useRecoilValue(activeSportTabState);
  const { postPlayers, isLoading, error } = usePostPlayers(); // 최상위에서 훅 호출
  const [isEditing, setIsEditing] = useState(false);

  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [players, setPlayers] = useState(owner.players || []); // owner.players가 없으면 빈 배열 사용

  console.log(players);

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const result = await postPlayers(owner.teamId, players); // POST 요청
        console.log("API 응답:", result);
        alert("선수 정보가 성공적으로 업데이트되었습니다.");
      } catch (err) {
        console.error("POST 요청 실패:", err);
        alert("선수 정보를 업데이트하는 동안 오류가 발생했습니다.");
      }
    }

    console.log("현재 players 상태:", players);
    setIsEditing(!isEditing); // 편집 모드 토글
  };

  const handleMouseDown = (e, id) => {
    if (!isEditing) return;
    setCurrentPlayerId(id);
    setDragStartTime(Date.now());
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging || currentPlayerId === null) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeft = e.clientX - containerRect.left - 25;
    const newTop = e.clientY - containerRect.top - 25;

    const boundedLeft = Math.max(
      0,
      Math.min(newLeft, containerRect.width - 50),
    );
    const boundedTop = Math.max(0, Math.min(newTop, containerRect.height - 50));

    const updatedPlayers = players.map((player) =>
      player.id === currentPlayerId
        ? { ...player, position: { left: boundedLeft, top: boundedTop } }
        : player,
    );
    setPlayers(updatedPlayers);
  };

  const handleMouseUp = () => {
    setDragging(false);
    setCurrentPlayerId(null);
  };

  const togglePlayerSelection = (id) => {
    const maxSelectablePlayers = activeSportTab === "soccer" ? 11 : 5;
    const selectedCount = players.filter((player) => player.isSelected).length;

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id &&
        (player.isSelected || selectedCount < maxSelectablePlayers)
          ? { ...player, isSelected: !player.isSelected }
          : player,
      ),
    );
  };

  return (
    <div
      className="w-64 mb-6"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="flex items-center">
        <h2 className="text-xl font-bold mr-2">인포메이션</h2>
        {userType === "팀대표" && (
          <button
            onClick={handleEditClick}
            className="text-sm font-semibold bg-gray-300 rounded-full px-3 py-1"
          >
            {isLoading ? "업데이트 중..." : isEditing ? "완료" : "편집"}
          </button>
        )}
      </div>

      <PlayerManagementPanel
        players={players}
        setPlayers={setPlayers}
        activeSportTab={activeSportTab}
        togglePlayerSelection={togglePlayerSelection}
        isEditing={isEditing}
      />

      <h3 className="text-md font-bold my-2">포메이션</h3>

      <div className="mt-4 relative" ref={containerRef}>
        <img
          src={activeSportTab === "soccer" ? formationSC : formationBB}
          alt="Formation"
          className="h-auto rounded-md"
        />
        {players
          .filter((player) => player.isSelected)
          .map((player) => (
            <div
              key={player.id}
              className="absolute flex flex-col items-center cursor-pointer"
              style={{
                top: `${player.position.top}px`,
                left: `${player.position.left}px`,
                cursor: isEditing ? "move" : "default",
              }}
              onMouseDown={(e) => handleMouseDown(e, player.id)}
            >
              <div
                className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                  activeSportTab === "soccer"
                    ? "bg-emerald-500 border-green-400"
                    : "bg-gray-700 border-gray-400"
                }`}
              >
                <span className="text-white font-bold text-sm">
                  {player.number}
                </span>
              </div>
              <div
                className={`text-center mt-0.5 text-sm text-white rounded px-2 font-semibold ${
                  activeSportTab === "soccer" ? "bg-green-700" : "bg-gray-800"
                }`}
              >
                {player.name}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Formation;
