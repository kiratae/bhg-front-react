import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "flowbite-react";

const RoomPage = () => {
  const { roomId } = useParams();
  const username = "Stericano";
  const [userInfo, setUserInfo] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const limitEvidenceCardSelect = 1;
  const limitFakeEvidenceCardSelect = 2;

  const roleName = {
    0: "Unknown",
    1: "Civilian",
    2: "Killer",
    3: "Jarvis",
  };

  const roomInfo = {
    roomId: "abc-def-ghi",
    roomStatus: 8,
    turn: 1,
    playerQty: 5,
    players: [
      {
        username: "Stericano",
        userStatus: 3,
        userRole: 1,
      },
      {
        username: "Earthery",
        userStatus: 1,
        userRole: 1,
      },
      {
        username: "Jutha",
        userStatus: 1,
        userRole: 1,
      },
      {
        username: "TakTTK",
        userStatus: 1,
        userRole: 1,
      },
      {
        username: "Kiratae",
        userStatus: 1,
        userRole: 1,
      },
    ],
    cards: {
      1: [
        {
          cardId: "c-001",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 1,
          isFake: false,
        },
        {
          cardId: "c-002",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 2,
          isFake: false,
        },
        {
          cardId: "c-003",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 2,
          isFake: false,
        },
        {
          cardId: "c-004",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-005",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-006",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-007",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-008",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-009",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
      ],
      2: [
        {
          cardId: "c-001",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-002",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-003",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-004",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-005",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-006",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-007",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-008",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
        {
          cardId: "c-009",
          cardImagePath:
            "https://m.media-amazon.com/images/I/41e6nX69fRL.__AC_SX300_SY300_QL70_FMwebp_.jpg",
          cardStatus: 0,
          isFake: false,
        },
      ],
    },
  };

  useEffect(() => {
    setUserInfo(
      roomInfo.players.find((player) => player.username === username)
    );
  }, [username]);

  const getAlivePlayers = () => {
    return roomInfo.players.filter(
      (player) => player.userStatus === 1 && player.username !== username
    );
  };

  const getSelectedCards = () => {
    return roomInfo.cards[roomInfo.turn].filter((card) => card.cardStatus > 0);
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  const handleConfirmKill = () => {
    if (selectedPlayer) {
      console.log(`Player ${selectedPlayer.username} selected for kill`);
      // Implement your kill logic here
    }
  };

  const handleConfirmProtect = () => {
    if (selectedPlayer) {
      console.log(`Player ${selectedPlayer.username} selected for kill`);
      // Implement your kill logic here
    }
  };

  const handleConfirmChooseEvidence = () => {
    console.log(`Player ${selectedPlayer.username} selected for kill`);
  };

  const handleEvidenceCardClick = (cardId) => {
    setSelectedCards((prevSelectedCards) => {
      if (prevSelectedCards.includes(cardId)) {
        // If the card is already selected, remove it
        return prevSelectedCards.filter((id) => id !== cardId);
      } else {
        // Otherwise, add the card to the selection, if not exceeding the limit
        if (prevSelectedCards.length < limitEvidenceCardSelect) {
          return [...prevSelectedCards, cardId];
        } else {
          setSelectedCards((prevSelectedCards) => prevSelectedCards.slice(1));
          return [...prevSelectedCards, cardId];
        }
      }
    });
  };

  const handleFakeEvidenceCardClick = (cardId) => {
    setSelectedCards((prevSelectedCards) => {
      if (prevSelectedCards.includes(cardId)) {
        // If the card is already selected, remove it
        return prevSelectedCards.filter((id) => id !== cardId);
      } else {
        // Otherwise, add the card to the selection, if not exceeding the limit
        if (prevSelectedCards.length < limitFakeEvidenceCardSelect) {
          return [...prevSelectedCards, cardId];
        } else {
          setSelectedCards((prevSelectedCards) => prevSelectedCards.slice(1));
          return [...prevSelectedCards, cardId];
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Dying Message</h1>
      <h2 className="text-xl">Room: {roomId}</h2>

      {/* Waiting State */}
      {roomInfo.roomStatus === 1 && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">Players:</h3>
          {roomInfo.players.map((player, index) => (
            <div key={index} className="text-center">
              {player.username}
            </div>
          ))}
          <Button className="w-1/3 bg-gray-500 hover:bg-gray-700 text-white">
            Setup
          </Button>
          <Button className="w-1/3 bg-blue-500 hover:bg-blue-700 text-white">
            Start Game
          </Button>
        </div>
      )}

      {/* Protector Turn State */}
      {roomInfo.roomStatus === 3 && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{roleName[userInfo.userRole]}</b>
          </h3>
          {userInfo.userRole !== 3 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">Waiting for Protector Turn</h2>
            </div>
          )}
          {userInfo.userRole === 3 && userInfo.userStatus === 1 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                <b>Choose Player to Protect</b>
              </h2>
              {getAlivePlayers().map((player, index) => (
                <Button
                  key={index}
                  className={`w-1/3 ${
                    selectedPlayer?.username === player.username
                      ? "border-blue-500 text-blue-500"
                      : "border-grey-500 text-grey-500"
                  }`}
                  onClick={() => handlePlayerClick(player)}
                >
                  {player.username}
                </Button>
              ))}
              <Button
                className={`w-1/3 mt-4 ${
                  selectedPlayer
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
                onClick={handleConfirmProtect}
                disabled={!selectedPlayer}
              >
                Protect Player
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Killer State */}
      {roomInfo.roomStatus === 4 && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{roleName[userInfo.userRole]}</b>
          </h3>
          {userInfo.userRole !== 2 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">Waiting for Killer Player</h2>
            </div>
          )}
          {userInfo.userRole === 2 && userInfo.userStatus === 1 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                <b>Choose Player to Kill</b>
              </h2>
              {getAlivePlayers().map((player, index) => (
                <Button
                  key={index}
                  className={`w-1/3 ${
                    selectedPlayer?.username === player.username
                      ? "border-blue-500 text-blue-500"
                      : "border-grey-500 text-grey-500"
                  }`}
                  onClick={() => handlePlayerClick(player)}
                >
                  {player.username}
                </Button>
              ))}
              <Button
                className={`w-1/3 mt-4 ${
                  selectedPlayer
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
                onClick={handleConfirmKill}
                disabled={!selectedPlayer}
              >
                Confirm Kill
              </Button>
            </div>
          )}
        </div>
      )}

      {roomInfo.roomStatus === 5 && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{roleName[userInfo.userRole]}</b>
          </h3>
          {userInfo.userStatus !== 3 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">Waiting for Evidence</h2>
            </div>
          )}
          {userInfo.userStatus === 3 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h3 className="text-lg">
                You're <b>Die!</b>
              </h3>
              <h2 className="text-lg">
                <b>Choose the Evidence</b>
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {roomInfo.cards[roomInfo.turn].map((card) => (
                  <div
                    key={card.cardId}
                    className={`cursor-pointer rounded-lg ${
                      selectedCards.includes(card.cardId)
                        ? "border-red-500 border-4"
                        : "border-gray-500 border-2"
                    }`} // Conditional border width
                    onClick={() => handleEvidenceCardClick(card.cardId)}
                    style={{ width: "80px", height: "130px" }} // Card size
                  >
                    <img
                      src={card.cardImagePath}
                      alt={`Card ${card.cardId}`}
                      className="w-full h-full object-cover rounded-lg"
                      style={{ width: "80px", height: "120px" }} // Image size
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            className={`w-1/3 mt-4 ${
              selectedCards.length > 0
                ? "bg-blue-500 text-white"
                : "bg-gray-500 text-white"
            }`}
            onClick={handleConfirmChooseEvidence}
            disabled={selectedCards.length == 0}
          >
            Confirm
          </Button>
        </div>
      )}

      {roomInfo.roomStatus === 6 && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{roleName[userInfo.userRole]}</b>
          </h3>

          {userInfo.userRole !== 2 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                Waiting for Killer Choose Fake Evidence
              </h2>
            </div>
          )}
          {userInfo.userRole === 2 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                <b>Choose Two Fake Evidence</b>
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {roomInfo.cards[roomInfo.turn].map((card) => (
                  <div>
                    {card.cardStatus === 1 && (
                      <div
                        key={card.cardId}
                        className="rounded-lg border-red-500 border-4 cursor-not-allowed"
                        style={{ width: "80px", height: "130px" }}
                      >
                        <img
                          src={card.cardImagePath}
                          alt={`Card ${card.cardId}`}
                          className="w-full h-full object-cover rounded-lg"
                          style={{ width: "80px", height: "120px" }}
                        />
                      </div>
                    )}
                    {card.cardStatus !== 1 && (
                      <div
                        key={card.cardId}
                        className={`cursor-pointer rounded-lg ${
                          selectedCards.includes(card.cardId)
                            ? "border-purple-500 border-4"
                            : "border-gray-500 border-2"
                        }`}
                        onClick={() => {
                          if (card.cardStatus !== 1) {
                            handleFakeEvidenceCardClick(card.cardId);
                          }
                        }}
                        style={{ width: "80px", height: "130px" }}
                      >
                        <img
                          src={card.cardImagePath}
                          alt={`Card ${card.cardId}`}
                          className="w-full h-full object-cover rounded-lg"
                          style={{ width: "80px", height: "120px" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button
                className={`w-1/3 mt-4 ${
                  selectedCards.length > 0
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
                onClick={handleConfirmChooseEvidence}
                disabled={selectedCards.length == 0}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
      )}

      {roomInfo.roomStatus === 7 && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{roleName[userInfo.userRole]}</b>
          </h3>

          <div className="flex flex-col items-center justify-center w-full space-y-4">
            <h2 className="text-lg">Discuss Time</h2>
            <div className="grid grid-cols-3 gap-4">
              {getSelectedCards().map((card) => (
                <div
                  key={card.cardId}
                  className="rounded-lg border-grey-500 border-4"
                  style={{ width: "80px", height: "130px" }}
                >
                  <img
                    src={card.cardImagePath}
                    alt={`Card ${card.cardId}`}
                    className="w-full h-full object-cover rounded-lg"
                    style={{ width: "80px", height: "120px" }}
                  />
                </div>
              ))}
            </div>
            {userInfo.userStatus === 1 && (
              <div className="flex flex-col items-center justify-center w-full space-y-4">
                <h2 className="text-lg">
                  <b>Choose Player to Vote</b>
                </h2>
                {getAlivePlayers().map((player, index) => (
                  <Button
                    key={index}
                    className={`w-1/3 ${
                      selectedPlayer?.username === player.username
                        ? "border-blue-500 text-blue-500"
                        : "border-grey-500 text-grey-500"
                    }`}
                    onClick={() => handlePlayerClick(player)}
                  >
                    {player.username}
                  </Button>
                ))}
                <Button
                  className={`w-1/3 mt-4 ${
                    selectedPlayer
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                  onClick={handleConfirmKill}
                  disabled={!selectedPlayer}
                >
                  Vote Player
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {roomInfo.roomStatus === 8 && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{roleName[userInfo.userRole]}</b>
          </h3>

          {userInfo.userStatus !== 3 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                <b>
                  {
                    roomInfo.players.find((player) => player.userStatus === 3)
                      .username
                  }
                </b>{" "}
                was voted to be hanged
              </h2>
              <h2 className="text-lg">
                Choose for kill{" "}
                <b>
                  {
                    roomInfo.players.find((player) => player.userStatus === 3)
                      .username
                  }
                </b>
              </h2>
              <Button
                className="w-1/3 mt-4 bg-red-500 text-white"
                onClick={handleConfirmKill}
              >
                Confirm Kill
              </Button>
              <Button
                className="w-1/3 mt-4 bg-green-500 text-white"
                onClick={handleConfirmKill}
              >
                Free{" "}
                {
                  roomInfo.players.find((player) => player.userStatus === 3)
                    .username
                }
              </Button>
            </div>
          )}

          {userInfo.userStatus === 3 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                <b>You</b> were Voted to Hang. Make an excuse
              </h2>
              <h2 className="text-lg">Waiting for the Judgment</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomPage;
