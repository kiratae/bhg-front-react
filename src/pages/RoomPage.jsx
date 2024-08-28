import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button, Clipboard, Toast } from "flowbite-react";
import { PiSkullFill, PiCheckFatFill } from "react-icons/pi";
import toast, { Toaster } from "react-hot-toast";
import hubConnection from "../scripts/myHub";
import myAxios from '../scripts/myAxios';
import PlayerStatus from "../models/PlayerStatus";
import PlayerRole from "../models/PlayerRole";
import DMGameAction from "../models/DMGameAction";
import GameState from "../models/GameState";
import PlayerInfo from "../components/PlayerInfo";
import CardList from "../components/CardList";
import CardStatus from "../models/CardStatus";

let notificationId = 1;

const DeadNotiIcon = () => (
  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
    <PiSkullFill className="h-5 w-5" />
  </div>
);

const VoteNotiIcon = () => (
  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
    <PiCheckFatFill className="h-5 w-5" />
  </div>
);

const notify = (msg, icon) =>
  toast.custom(
    (t) => (
      <Toast>
        {icon}
        <div className="ml-3 text-sm font-normal">{msg}</div>
      </Toast>
    ),
    { id: notificationId++, position: "top-right" }
  );

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
  // const [discussTime, setDiscussTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limitEvidenceCardSelect = 1;
  const limitFakeEvidenceCardSelect = 2;

  const updateRoomInfo = useCallback((roomData) => {
    const player = roomData.players.find((player) => player.userName === userName);
    if (roomInfo && roomData.gameStateId !== roomInfo.gameStateId)
      setSelectedPlayer(null);
    setRoomInfo(roomData);
    setUserInfo(player);
  }, [userName, roomInfo]);

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
            // console.log(message);
          });

          connection.on('RoomDataSend', (roomData) => {
            // console.log('RoomDataSend', { roomData });
            updateRoomInfo(roomData);
          });

          connection.on('RoomJoined', (roomData) => {
            // console.log('RoomJoined', { roomData });
            updateRoomInfo(roomData);
          })

          connection.on('RoomDiscussTime', (time) => {
            // setDiscussTime(time);
          })

          connection.on('RoomSendPlayerDead', (deadPlayer) => {
            // setDiscussTime(time);
            notify(`Player "${deadPlayer}" is dead!`, <DeadNotiIcon />);
          })

          connection.on('RoomSendPlayerVote', (votePlayer) => {
            // setDiscussTime(time);< />
            notify(`Player "${votePlayer}" has been voted!`, <VoteNotiIcon />);
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

  const handleStartGame = () => {
    setIsLoading(true);
    myAxios.post(`/api/dm-game-control/${roomId}`,
      {
        acionTypeId: DMGameAction.StartGame,
        userName: userName
      })
      .then((response) => {
        if (response.data && response.data.data) {
          const roomData = response.data.data;
          updateRoomInfo(roomData);
          setIsLoading(false);
        }
      }).catch((error) => {
        if (error.response.status === 404) {
          navigate('/');
        } else {
          console.error(error);
          setIsLoading(false);
        }
      });
  };

  const handleBackToLobby = () => {
    setIsLoading(true);
    myAxios.post(`/api/dm-game-control/${roomId}`,
      {
        acionTypeId: DMGameAction.BackToLobby,
        userName: userName
      })
      .then((response) => {
        if (response.data && response.data.data) {
          const roomData = response.data.data;
          updateRoomInfo(roomData);
          setIsLoading(false);
        }
      }).catch((error) => {
        if (error.response.status === 404) {
          navigate('/');
        } else {
          console.error(error);
          setIsLoading(false);
        }
      });
  }

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  const handleConfirmKill = () => {
    if (selectedPlayer) {
      setIsLoading(true);
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
            setIsLoading(false);
          }
        }).catch((error) => {
          if (error.response.status === 404) {
            navigate('/');
          } else {
            console.error(error);
            setIsLoading(false);
          }
        });
    }
  };

  const handleConfirmProtect = () => {
    if (selectedPlayer) {
      setIsLoading(true);
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
            setIsLoading(false);
          }
        }).catch((error) => {
          if (error.response.status === 404) {
            navigate('/');
          } else {
            console.error(error);
            setIsLoading(false);
          }
        });
    }
  };

  const handleConfirmChooseEvidence = () => {
    if (selectedCards.length > 0) {
      setIsLoading(true);
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
            setIsLoading(false);
          }
        }).catch((error) => {
          if (error.response.status === 404) {
            navigate('/');
          } else {
            console.error(error);
            setIsLoading(false);
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

  // const getDiscussTimeText = (time) => {
  //   const m = Math.floor(time / 60);
  //   const s = time % 60;
  //   return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  // }

  const handleConfirmVote = () => {
    if (selectedPlayer) {
      setIsLoading(true);
      console.log(`Player ${selectedPlayer.userName} has been vote.`);
      myAxios.post(`/api/dm-game-control/${roomId}`,
        {
          acionTypeId: DMGameAction.VoteHanging,
          userName: userName,
          targetUserName: selectedPlayer.userName
        })
        .then((response) => {
          if (response.data && response.data.data) {
            const roomData = response.data.data;
            updateRoomInfo(roomData);
            setIsLoading(false);
          }
        }).catch((error) => {
          if (error.response.status === 404) {
            navigate('/');
          } else {
            console.error(error);
            setIsLoading(false);
          }
        });
    }
  };

  const isVoted = () => {
    return roomInfo.playerVoteLogs.includes(userName);
  }

  const isRoomReady = () => {
    return roomInfo && userName;
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center justify-center space-y-4 my-5">
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
                <Button color="light" className="w-1/3" disabled>
                  Setup
                </Button>
                <Button color="primary" className="w-1/3" onClick={handleStartGame} isProcessing={isLoading}>
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
            <PlayerInfo user={userInfo}></PlayerInfo>
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
                  isProcessing={isLoading}
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
            <PlayerInfo user={userInfo}></PlayerInfo>
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
                  isProcessing={isLoading}
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
            <PlayerInfo user={userInfo}></PlayerInfo>
            <div className="my-3">Round: {roomInfo.gameRound}</div>
            {userInfo.statusId !== PlayerStatus.Dying && (
              <div className="flex flex-col items-center justify-center w-full space-y-4">
                <h2 className="text-lg">Waiting for Evidence</h2>
              </div>
            )}
            {userInfo.statusId === PlayerStatus.Dying && (
              <>
                <div className="flex flex-col items-center justify-center w-full space-y-4">
                  <h3 className="text-lg">
                    You're <b>Die!</b>
                  </h3>
                  <h3 className="text-lg">
                    Killer is <b className="text-red-600">{getKillers().map(x => x.userName).join(', ')}</b>
                  </h3>
                  <h2 className="text-lg">
                    <b>Choose the Evidence</b>
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {roomInfo.cards[roomInfo.gameRound].map((card) => (
                      <div
                        key={card.cardId}
                        className={`cursor-pointer rounded-xl ${selectedCards.includes(card.cardId)
                          ? "border-red-500 border-4"
                          : "border-gray-300 border-4"
                          }`} // Conditional border width
                        onClick={() => handleEvidenceCardClick(card.cardId)}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
                          alt={`Card ${card.cardId}`}
                          className="w-full h-full object-cover rounded-lg"
                          style={{ width: "100px", height: "150px" }} // Image size
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  color="primary"
                  className="w-1/3 mt-4"
                  onClick={handleConfirmChooseEvidence}
                  isProcessing={isLoading}
                  disabled={selectedCards.length === 0}
                >
                  Confirm
                </Button>
              </>
            )}
          </div>
        )}

        {/* LeaveFakeEvidenceTime */}
        {isRoomReady() && roomInfo.gameStateId === GameState.LeaveFakeEvidenceTime && (
          <div className="flex flex-col items-center justify-center w-full space-y-4">
            <PlayerInfo user={userInfo}></PlayerInfo>
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
                      {card.statusId === CardStatus.RealEvidence && (
                        <div
                          key={card.cardId}
                          className="rounded-xl border-green-500 border-4 cursor-not-allowed"
                        >
                          <img
                            src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
                            alt={`Card ${card.cardId}`}
                            className="w-full h-full object-cover rounded-lg"
                            style={{ width: "100px", height: "150px" }} // Image size
                          />
                        </div>
                      )}
                      {card.statusId !== CardStatus.RealEvidence && (
                        <div
                          key={card.cardId}
                          className={`cursor-pointer rounded-xl ${selectedCards.includes(card.cardId)
                            ? "border-purple-500 border-4"
                            : "border-gray-300 border-4"
                            }`}
                          onClick={() => {
                            if (card.statusId !== 1) {
                              handleFakeEvidenceCardClick(card.cardId);
                            }
                          }}
                        >
                          <img
                            src={`${process.env.REACT_APP_API_END_POINT}${card.fileName.replace('~/', '/')}`}
                            alt={`Card ${card.cardId}`}
                            className="w-full h-full object-cover rounded-lg"
                            style={{ width: "100px", height: "150px" }} // Image size
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
                  isProcessing={isLoading}
                  disabled={selectedCards.length === 0}
                >
                  Confirm
                </Button>
              </div>
            )}
          </div>
        )}

        {/* DiscussTime */}
        {isRoomReady() && (roomInfo.gameStateId === GameState.DiscussTime || roomInfo.gameStateId === GameState.VoteHanging) && (
          <div className="flex flex-col items-center justify-center w-full space-y-4">
            <PlayerInfo user={userInfo}></PlayerInfo>
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              {/* <h2 className="text-lg">Discuss Time: {getDiscussTimeText(discussTime)}</h2> */}
              <CardList room={roomInfo}></CardList>
            </div>

            {userInfo.statusId === PlayerStatus.Alive && (
              <div className="flex flex-col items-center justify-center w-full space-y-4 mb-4">
                <h2 className="text-lg">
                  <b>Choose Player to Vote</b>
                </h2>
                {getAlivePlayers().map((player, index) => (
                  <Button
                    key={player.userName}
                    color="light"
                    className={`w-1/3 ${selectedPlayer?.userName === player.userName
                      ? "border-amber-500 font-bold border-2"
                      : ""
                      }`}
                    disabled={isVoted()}
                    onClick={() => handlePlayerClick(player)}
                  >
                    {selectedPlayer?.userName === player.userName ? '🎯 ' : ''}{player.userName}
                  </Button>
                ))}
                {!isVoted() && (
                  <Button
                    color="primary"
                    className="w-1/3 mt-4"
                    isProcessing={isLoading}
                    onClick={handleConfirmVote}
                    disabled={!selectedPlayer}
                  >
                    Vote Player
                  </Button>)}
              </div>
            )}
          </div>
        )}

        {/* VoteHanging */}
        {/* {isRoomReady() && roomInfo.gameStateId === GameState.VoteHanging && (
        // <div className="flex flex-col items-center justify-center w-full space-y-4">
        //   <PlayerInfo user={userInfo}></PlayerInfo>

        //   <div className="flex flex-col items-center justify-center w-full space-y-4">
        //     <div className="my-3">Round: {roomInfo.gameRound}</div>

        //   </div>
        // </div>
      )} */}

        {isRoomReady() && (roomInfo.gameStateId === GameState.GameOverCivilianWin || roomInfo.gameStateId === GameState.GameOverKillerWin) && (
          <>
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h3 className="text-lg">
                {roomInfo.gameStateId === GameState.GameOverCivilianWin && "Game Over! Civilian Win!"}
                {roomInfo.gameStateId === GameState.GameOverKillerWin && "Game Over! Killer Win!"}
              </h3>
            </div>
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <h3 className="text-lg">Players:</h3>
              {roomInfo.players.map((player, index) => (
                <div key={player.userName} className={`text-center ${player.userName === userName ? 'font-bold' : ''}`}>
                  {player.userName}{" is "}{PlayerRole.getRoleName(player.roleId)}
                </div>
              ))}
              {userInfo.isHost && (
                <Button color="primary" className="w-1/3" onClick={handleBackToLobby} isProcessing={isLoading}>
                  Back to lobby
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RoomPage;
