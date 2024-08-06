import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import hubConnection from "../services/myHub";
import myAxios from '../services/myAxios';

const roleName = {
  0: "Unknown",
  1: "Civilian",
  2: "Killer",
  3: "Jarvis",
};

const RoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const username = location?.state?.playerName;
  const [roomInfo, setRoomInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [connection] = useState(hubConnection(roomId));
  const limitEvidenceCardSelect = 1;
  const limitFakeEvidenceCardSelect = 2;

  const updateRoomInfo = useCallback((roomData) => {
    const player = roomData.players.find((player) => player.userName === username);
    setRoomInfo(roomData);
    setUserInfo(player);
  }, [username]);

  useEffect(() => {
    myAxios.get(`/api/rooms/${roomId}`)
      .then((response) => {
        if (response.data && response.data.data) {
          const roomData = response.data.data;
          updateRoomInfo(roomData);
        }
      }).catch((error) => {
        if (error.response.status === 404) {
          navigate('/');
        }
      });
  }, [roomId, navigate, updateRoomInfo]);

  useEffect(() => {
    if (connection && !(connection.state === 'Connected' || connection.state === 'Connecting')) {
      connection.start()
        .then(() => {
          console.log('Connected!');

          connection.on('RoomSend', message => {
            console.log(message);
          });

          connection.on('RoomSendData', (roomData) => {
            console.log('RoomSendData', { roomData });
            updateRoomInfo(roomData);
          });

          connection.on('RoomJoined', (roomData) => {
            console.log('RoomJoined', { roomData });
            updateRoomInfo(roomData);
          })

          if (username)
            connection.send('SetUserName', username);
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [connection, username, updateRoomInfo]);

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
      {roomInfo && roomInfo.gameStateId === 1 && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">Players:</h3>
          {roomInfo.players.map((player, index) => (
            <div key={index} className="text-center">
              {player.isHost ? '👑 ' : '🟢 '}{player.userName}
            </div>
          ))}
          <Button color="light" className="w-1/3">
            Setup
          </Button>
          <Button color="primary" className="w-1/3">
            Start Game
          </Button>
        </div>
      )}

      {/* Protector Turn State */}
      {roomInfo && roomInfo.roomStatus === 3 && (
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
                  className={`w-1/3 ${selectedPlayer?.username === player.username
                    ? "border-blue-500 text-blue-500"
                    : "border-grey-500 text-grey-500"
                    }`}
                  onClick={() => handlePlayerClick(player)}
                >
                  {player.username}
                </Button>
              ))}
              <Button
                className={`w-1/3 mt-4 ${selectedPlayer
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
      {roomInfo && roomInfo.roomStatus === 4 && (
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
                  className={`w-1/3 ${selectedPlayer?.username === player.username
                    ? "border-blue-500 text-blue-500"
                    : "border-grey-500 text-grey-500"
                    }`}
                  onClick={() => handlePlayerClick(player)}
                >
                  {player.username}
                </Button>
              ))}
              <Button
                className={`w-1/3 mt-4 ${selectedPlayer
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

      {roomInfo && roomInfo.roomStatus === 5 && (
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
                    className={`cursor-pointer rounded-lg ${selectedCards.includes(card.cardId)
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
            className={`w-1/3 mt-4 ${selectedCards.length > 0
              ? "bg-blue-500 text-white"
              : "bg-gray-500 text-white"
              }`}
            onClick={handleConfirmChooseEvidence}
            disabled={selectedCards.length === 0}
          >
            Confirm
          </Button>
        </div>
      )}

      {roomInfo && roomInfo.roomStatus === 6 && (
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
                        className={`cursor-pointer rounded-lg ${selectedCards.includes(card.cardId)
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
                className={`w-1/3 mt-4 ${selectedCards.length > 0
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
                  }`}
                onClick={handleConfirmChooseEvidence}
                disabled={selectedCards.length === 0}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
      )}

      {roomInfo && roomInfo.roomStatus === 7 && (
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
                    className={`w-1/3 ${selectedPlayer?.username === player.username
                      ? "border-blue-500 text-blue-500"
                      : "border-grey-500 text-grey-500"
                      }`}
                    onClick={() => handlePlayerClick(player)}
                  >
                    {player.username}
                  </Button>
                ))}
                <Button
                  className={`w-1/3 mt-4 ${selectedPlayer
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

      {roomInfo && roomInfo.roomStatus === 8 && (
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
