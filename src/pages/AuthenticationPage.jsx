import React from 'react';
import { Button, TextInput, Label, Modal } from 'flowbite-react';
import { useNavigate, useParams } from 'react-router-dom';
import myAxios from '../scripts/myAxios';
import { strIsNullOrWhitespace } from '../scripts/utils';

const AuthenticationPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [playerName, setPlayerName] = React.useState('');
  const [roomCode, setRoomCode] = React.useState(roomId != null ? roomId : '');
  const [openModal, setOpenModal] = React.useState(roomId != null);
  const [isCreateRoom, setIsCreateRoom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const playerNameInputRef = React.useRef(null);

  const handleCreateRoom = () => {
    // Logic for creating a room can be added here
    setIsLoading(true);
    myAxios.post('/api/rooms', { userName: playerName })
      .then((response) => {
        if (response.data && response.data.data) {
          let roomData = response.data.data;
          navigate(`/room/${roomData.roomCode}`, { state: { playerName: playerName } });
        }
      });
  };

  const handleJoinRoom = () => {
    setIsLoading(true);
    myAxios.post(`/api/rooms/${roomCode}/join`, { userName: playerName })
      .then((response) => {
        if (response.data && response.data.data) {
          let roomData = response.data.data;
          navigate(`/room/${roomData.roomCode}`, { state: { playerName: playerName } });
        }
      });
  };

  const onConfirmModal = () => {
    if (isCreateRoom) {
      handleCreateRoom();
    } else {
      handleJoinRoom();
    }
  };

  const onJoinRoom = () => {
    setIsCreateRoom(false);
    setOpenModal(true);
  };

  const onCreateRoom = () => {
    setIsCreateRoom(true);
    setOpenModal(true);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold">Dying Message</h1>
        <TextInput
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="w-1/3"
        />
        <Button color="primary" onClick={onJoinRoom} className="w-1/3" disabled={strIsNullOrWhitespace(roomCode)}>
          Join Room
        </Button>
        <div></div>
        <Button color="secondary" onClick={onCreateRoom} className="w-1/3">
          Create Room
        </Button>
      </div>
      <Modal show={openModal} position="center" size="sm" onClose={() => setOpenModal(false)} initialFocus={playerNameInputRef}>
        <Modal.Header>{isCreateRoom ? 'Create room' : 'Join room'}</Modal.Header>
        <Modal.Body>
          <div>
            {!strIsNullOrWhitespace(roomCode) && (<h2 className="text-xl mb-2">Room: {roomCode}</h2>)}
            <div className="mb-2 block">
              <Label htmlFor="text" value="Player name" />
            </div>
            <TextInput
              ref={playerNameInputRef}
              placeholder="Player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex items-center justify-end space-x-4">
          <Button color="light" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button color={isCreateRoom ? 'secondary' : 'primary'} onClick={onConfirmModal} isProcessing={isLoading} disabled={strIsNullOrWhitespace(playerName)}>{isCreateRoom ? 'Create room' : 'Join room'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AuthenticationPage;
