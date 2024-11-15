import React, { useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { activeSportTabState } from "../../state/sportTabState";
import formationSC from "../../assets/images/formationSC.svg";
import formationBB from "../../assets/images/formationBB.svg";
import { MdCancel } from "react-icons/md";

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
        name: "",
        number: prevPlayers.length + 1,
        position: randomPosition,
        isSelected: false,
      },
    ]);
    console.log(players);
  };

  const deletePlayer = (id) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const updatePlayer = (id, field, value) => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, [field]: value } : player,
    );
    setPlayers(updatedPlayers);
    console.log(players);
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
          <div className="w-20 flex flex-col space-y-1 items-center">
            <div
              key={player.id}
              className={`w-16 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer  p-1  ${
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
                style={{ textAlign: "center" }} // 추가된 스타일
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

const Formation = () => {
  const userType = "팀대표";
  const activeSportTab = useRecoilValue(activeSportTabState);
  const [isEditing, setIsEditing] = useState(false);
  const [players, setPlayers] = useState([
    {
      name: "박수연",
      number: 9,
      position: { top: 50, left: 50 },
      isSelected: false,
    },
    {
      name: "김영희",
      number: 10,
      position: { top: 150, left: 150 },
      isSelected: false,
    },
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

  const togglePlayerSelection = (id) => {
    const maxSelectablePlayers = activeSportTab === "soccer" ? 11 : 5;
    const selectedCount = players.filter((player) => player.isSelected).length;

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        if (player.id === id) {
          // 현재 선수가 선택 해제되는 경우 또는 선택 가능한 최대 수를 넘지 않을 때만 상태를 변경
          if (player.isSelected || selectedCount < maxSelectablePlayers) {
            return { ...player, isSelected: !player.isSelected };
          }
        }
        return player;
      }),
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
            {isEditing ? "완료" : "편집"}
          </button>
        )}
      </div>

      {/* 선수 관리 패널 */}
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
          .map((player, index) => (
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
              <div
                className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                  activeSportTab === "soccer"
                    ? "bg-emerald-500 border-green-400 "
                    : "bg-gray-700 border-gray-400"
                }`}
              >
                <span className="text-white font-bold text-sm">
                  {player.number}
                </span>
              </div>
              <div
                className={`text-center mt-0.5 text-sm text-white rounded px-2 font-semibold ${
                  activeSportTab === "soccer" ? "bg-green-700  " : "bg-gray-800"
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
