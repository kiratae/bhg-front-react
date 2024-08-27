import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button, Clipboard } from "flowbite-react";
import hubConnection from "../scripts/myHub";
import myAxios from '../scripts/myAxios';
import PlayerStatus from "../models/PlayerStatus";
import PlayerRole from "../models/PlayerRole";
import DMGameAction from "../models/DMGameAction";
import GameState from "../models/GameState";

const RoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const userName = location?.state?.playerName || null;
  const [roomInfo, setRoomInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [connection] = useState(hubConnection(roomId));
  const [discussTime, setDiscussTime] = useState(0);
  const limitEvidenceCardSelect = 1;
  const limitFakeEvidenceCardSelect = 2;

  const updateRoomInfo = useCallback((roomData) => {
    const player = roomData.players.find((player) => player.userName === userName);
    setRoomInfo(roomData);
    setUserInfo(player);
  }, [userName]);

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
        } else {
          console.error(error);
        }
      });
  }, [roomId, navigate, updateRoomInfo]);

  useEffect(() => {
    if (!userName)
      navigate('/', { state: { roomId: roomId } });
  }, [roomId, userName, navigate]);

  useEffect(() => {
    if (connection && !(connection.state === 'Connected' || connection.state === 'Connecting')) {
      connection.start()
        .then(() => {
          console.log('Connected!');

          connection.on('RoomSend', message => {
            console.log(message);
          });

          connection.on('RoomDataSend', (roomData) => {
            console.log('RoomDataSend', { roomData });
            updateRoomInfo(roomData);
          });

          connection.on('RoomJoined', (roomData) => {
            console.log('RoomJoined', { roomData });
            updateRoomInfo(roomData);
          })

          connection.on('RoomDiscussTime', (time) => {
            setDiscussTime(time);
          })

          if (userName)
            connection.send('SetUserName', userName);
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [connection, roomId, userName, navigate, updateRoomInfo]);

  const getAlivePlayers = () => {
    return roomInfo.players.filter(
      (player) => player.statusId === PlayerStatus.Alive && player.userName !== userName
    );
  };

  const getKillers = () => {
    return roomInfo.players.filter(
      (player) => player.roleId === PlayerRole.Killer
    );
  }

  const getSelectedCards = () => {
    // TODO : random card index.
    return roomInfo.cards[roomInfo.gameRound].filter((card) => card.statusId === 1 || card.statusId === 2);
  };

  const getUnselectedCards = () => {
    // TODO : random card index.
    return roomInfo.cards[roomInfo.gameRound].filter((card) => card.statusId === 3);
  };

  const handleStartGame = () => {
    myAxios.post(`/api/dm-game-control/${roomId}`,
      {
        acionTypeId: DMGameAction.StartGame,
        userName: userName
      })
      .then((response) => {
        if (response.data && response.data.data) {
          const roomData = response.data.data;
          updateRoomInfo(roomData);
        }
      }).catch((error) => {
        if (error.response.status === 404) {
          navigate('/');
        } else {
          console.error(error);
        }
      });
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  const handleConfirmKill = () => {
    if (selectedPlayer) {
      console.log(`Player ${selectedPlayer.userName} selected for kill`);
      myAxios.post(`/api/dm-game-control/${roomId}`,
        {
          acionTypeId: DMGameAction.KillerChooseTarget,
          userName: userName,
          targetUserName: selectedPlayer.userName
        })
        .then((response) => {
          if (response.data && response.data.data) {
            const roomData = response.data.data;
            updateRoomInfo(roomData);
            setSelectedPlayer(null);
          }
        }).catch((error) => {
          if (error.response.status === 404) {
            navigate('/');
          } else {
            console.error(error);
          }
        });
    }
  };

  const handleConfirmProtect = () => {
    if (selectedPlayer) {
      console.log(`Player ${selectedPlayer.userName} selected for kill`);
      myAxios.post(`/api/dm-game-control/${roomId}`,
        {
          acionTypeId: DMGameAction.DogJarvisChooseTarget,
          userName: userName,
          targetUserName: selectedPlayer.userName
        })
        .then((response) => {
          if (response.data && response.data.data) {
            const roomData = response.data.data;
            updateRoomInfo(roomData);
            setSelectedPlayer(null);
          }
        }).catch((error) => {
          if (error.response.status === 404) {
            navigate('/');
          } else {
            console.error(error);
          }
        });
    }
  };

  const handleConfirmChooseEvidence = () => {
    if (selectedCards.length > 0) {
      console.log(`Player ${userName} is picked evidence.`);
      myAxios.post(`/api/dm-game-control/${roomId}`,
        {
          acionTypeId: userInfo.roleId === PlayerRole.Killer ? DMGameAction.KillerChooseEvidences : DMGameAction.DeadChooseEvidence,
          userName: userName,
          targetCardIds: selectedCards
        })
        .then((response) => {
          if (response.data && response.data.data) {
            const roomData = response.data.data;
            updateRoomInfo(roomData);
            setSelectedCards([]);
          }
        }).catch((error) => {
          if (error.response.status === 404) {
            navigate('/');
          } else {
            console.error(error);
          }
        });
    }
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

  const getDiscussTimeText = (time) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleConfirmVote = () => {
    if (selectedPlayer) {
      console.log(`Player ${selectedPlayer.userName} has been vote.`);
      myAxios.post(`/api/dm-game-control/${roomId}`,
        {
          acionTypeId: DMGameAction.VoteKillerOut,
          userName: userName,
          targetUserName: selectedPlayer.userName
        })
        .then((response) => {
          if (response.data && response.data.data) {
            const roomData = response.data.data;
            updateRoomInfo(roomData);
            setSelectedPlayer(null);
          }
        }).catch((error) => {
          if (error.response.status === 404) {
            navigate('/');
          } else {
            console.error(error);
          }
        });
    }
  };

  useEffect(() => {
    console.log('Do something after userName has changed', userName);
  }, [userName]);

  const isRoomReady = () => {
    return roomInfo && userName;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Dying Message</h1>
      <div className="flex justify-center items-center space-x-2">
        <h2 className="text-xl">Room: {roomId}</h2>
        {isRoomReady() && roomInfo.gameStateId === GameState.Waiting && (
          <Clipboard valueToCopy={window.location.href} label="Copy" />
        )}
      </div>

      {/* Waiting State */}
      {isRoomReady() && roomInfo.gameStateId === GameState.Waiting && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">Players:</h3>
          {roomInfo.players.map((player, index) => (
            <div key={index} className={`text-center ${player.userName === userName ? 'font-bold' : ''}`}>
              {player.isHost ? '👑 ' : '🟢 '}{player.userName}
            </div>
          ))}
          {userInfo.isHost && (
            <>
              <Button color="light" className="w-1/3">
                Setup
              </Button>
              <Button color="primary" className="w-1/3" onClick={handleStartGame}>
                Start Game
              </Button>
            </>
          )}
        </div>
      )}

      {isRoomReady() && roomInfo.gameStateId === GameState.Start && (
        <>
          <div className="flex flex-col items-center justify-center w-full space-y-4">
            <h2 className="text-lg">Game is starting...</h2>
          </div>
          <div className="flex flex-col items-center justify-center w-full space-y-4">
            <h3 className="text-lg">Players:</h3>
            {roomInfo.players.map((player, index) => (
              <div key={index} className={`text-center ${player.userName === userName ? 'font-bold' : ''}`}>
                {player.isHost ? '👑 ' : '🟢 '}{player.userName}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Protector Turn State */}
      {isRoomReady() && roomInfo.gameStateId === GameState.ProtectorTurn && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{PlayerRole.getRoleName(userInfo.roleId)}</b>
          </h3>
          <div className="my-3">Round: {roomInfo.gameRound}</div>
          {userInfo.roleId !== PlayerRole.DogJarvis && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">Waiting for Protector Turn</h2>
            </div>
          )}
          {userInfo.roleId === PlayerRole.DogJarvis && userInfo.statusId === PlayerStatus.Alive && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                <b>Choose Player to Protect</b>
              </h2>
              {getAlivePlayers().map((player, index) => (
                <Button
                  key={index}
                  color="light"
                  className={`w-1/3 ${selectedPlayer?.userName === player.userName
                    ? "border-emerald-800 font-bold border-2"
                    : ""
                    }`}
                  onClick={() => handlePlayerClick(player)}
                >
                  {selectedPlayer?.userName === player.userName ? '🛡️ ' : ''}{player.userName}
                </Button>
              ))}
              <Button
                color="primary"
                className="w-1/3 mt-4"
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
      {isRoomReady() && roomInfo.gameStateId === GameState.KillerTurn && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{PlayerRole.getRoleName(userInfo.roleId)}</b>
          </h3>
          <div className="my-3">Round: {roomInfo.gameRound}</div>
          {userInfo.roleId !== PlayerRole.Killer && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">Waiting for Killer Player</h2>
            </div>
          )}
          {userInfo.roleId === PlayerRole.Killer && userInfo.statusId === 1 && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                <b>Choose Player to Kill</b>
              </h2>
              {getAlivePlayers().map((player, index) => (
                <Button
                  key={index}
                  color="light"
                  className={`w-1/3 ${selectedPlayer?.userName === player.userName
                    ? "border-red-500 text-red-500 font-bold border-2"
                    : ""
                    }`}
                  onClick={() => handlePlayerClick(player)}
                >
                  {selectedPlayer?.userName === player.userName ? '🔪 ' : ''}{player.userName}
                </Button>
              ))}
              <Button
                color="primary"
                className="w-1/3 mt-4"
                onClick={handleConfirmKill}
                disabled={!selectedPlayer}
              >
                Confirm Kill
              </Button>
            </div>
          )}
        </div>
      )}

      {/* LeaveDyingMessageTime */}
      {isRoomReady() && roomInfo.gameStateId === GameState.LeaveDyingMessageTime && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{PlayerRole.getRoleName(userInfo.roleId)}</b>
          </h3>
          <div className="my-3">Round: {roomInfo.gameRound}</div>
          {userInfo.statusId !== PlayerStatus.Dying && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">Waiting for Evidence</h2>
            </div>
          )}
          {userInfo.statusId === PlayerStatus.Dying && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h3 className="text-lg">
                You're <b>Die!</b>
              </h3>
              <h3 className="text-lg">
                Kiler is <b>{getKillers().map(x => x.userName).join(', ')}</b>
              </h3>
              <h2 className="text-lg">
                <b>Choose the Evidence</b>
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {roomInfo.cards[roomInfo.gameRound].map((card) => (
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
                      src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
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
            color="primary"
            className="w-1/3 mt-4"
            onClick={handleConfirmChooseEvidence}
            disabled={selectedCards.length === 0}
          >
            Confirm
          </Button>
        </div>
      )}

      {/* LeaveFakeEvidenceTime */}
      {isRoomReady() && roomInfo.gameStateId === GameState.LeaveFakeEvidenceTime && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{PlayerRole.getRoleName(userInfo.roleId)}</b>
          </h3>
          <div className="my-3">Round: {roomInfo.gameRound}</div>

          {userInfo.roleId !== PlayerRole.Killer && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                Waiting for Killer Choose Fake Evidence
              </h2>
            </div>
          )}
          {userInfo.roleId === PlayerRole.Killer && (
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h2 className="text-lg">
                <b>Choose Two Fake Evidence</b>
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {roomInfo.cards[roomInfo.gameRound].map((card) => (
                  <div>
                    {card.statusId === 1 && (
                      <div
                        key={card.cardId}
                        className="rounded-lg border-green-500 border-4 cursor-not-allowed"
                        style={{ width: "80px", height: "130px" }}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
                          alt={`Card ${card.cardId}`}
                          className="w-full h-full object-cover rounded-lg"
                          style={{ width: "80px", height: "120px" }}
                        />
                      </div>
                    )}
                    {card.statusId !== 1 && (
                      <div
                        key={card.cardId}
                        className={`cursor-pointer rounded-lg ${selectedCards.includes(card.cardId)
                          ? "border-purple-500 border-4"
                          : "border-gray-500 border-2"
                          }`}
                        onClick={() => {
                          if (card.statusId !== 1) {
                            handleFakeEvidenceCardClick(card.cardId);
                          }
                        }}
                        style={{ width: "80px", height: "130px" }}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
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

      {/* DiscussTime */}
      {isRoomReady() && roomInfo.gameStateId === GameState.DiscussTime && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{PlayerRole.getRoleName(userInfo.roleId)}</b>
          </h3>
          <div className="my-3">Round: {roomInfo.gameRound}</div>

          <div className="flex flex-col items-center justify-center w-full space-y-4">
            <h2 className="text-lg">Discuss Time: {getDiscussTimeText(discussTime)}</h2>
            <div className="grid grid-cols-3 gap-4">
              {getSelectedCards().map((card) => (
                <div
                  key={card.cardId}
                  className="rounded-lg border-grey-500 border-4"
                  style={{ width: "80px", height: "130px" }}
                >
                  <img
                    src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
                    alt={`Card ${card.cardId}`}
                    className="w-full h-full object-cover rounded-lg"
                    style={{ width: "80px", height: "120px" }}
                  />
                </div>
              ))}
            </div>
            <div className="my-3">Not selected cards</div>
            <div className="grid grid-cols-3 gap-4">
              {getUnselectedCards().map((card) => (
                <div
                  key={card.cardId}
                  className="rounded-lg border-grey-500 border-4"
                  style={{ width: "80px", height: "130px" }}
                >
                  <img
                    src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
                    alt={`Card ${card.cardId}`}
                    className="w-full h-full object-cover rounded-lg"
                    style={{ width: "80px", height: "120px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VoteOutTime */}
      {isRoomReady() && roomInfo.gameStateId === GameState.VoteOutTime && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{PlayerRole.getRoleName(userInfo.roleId)}</b>
          </h3>

          <div className="flex flex-col items-center justify-center w-full space-y-4">
            <div className="my-3">Round: {roomInfo.gameRound}</div>
            {userInfo.statusId === PlayerStatus.Alive && (
              <div className="flex flex-col items-center justify-center w-full space-y-4">
                <h2 className="text-lg">
                  <b>Choose Player to Vote</b>
                </h2>
                {getAlivePlayers().map((player, index) => (
                  <Button
                    key={index}
                    color="light"
                    className={`w-1/3 ${selectedPlayer?.userName === player.userName
                      ? "border-amber-500 font-bold border-2"
                      : ""
                      }`}
                    onClick={() => handlePlayerClick(player)}
                  >
                    {selectedPlayer?.userName === player.userName ? '🎯 ' : ''}{player.userName}
                  </Button>
                ))}
                <Button
                  color="primary"
                  className="w-1/3 mt-4"
                  onClick={handleConfirmVote}
                  disabled={!selectedPlayer}
                >
                  Vote Player
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {isRoomReady() && roomInfo.gameStateId === GameState.VoteKillTime && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            You're <b>{PlayerRole.getRoleName(userInfo.roleId)}</b>
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

      {isRoomReady() && roomInfo.gameStateId === GameState.GameOver && (
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <h3 className="text-lg">
            Game over
          </h3>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
