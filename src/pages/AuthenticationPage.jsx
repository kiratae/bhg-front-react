import React from 'react';
import { Button, TextInput, Label, Modal } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import myAxios from '../services/myAxios';

const AuthenticationPage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = React.useState('');
  const [roomCode, setRoomCode] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [isCreateRoom, setIsCreateRoom] = React.useState(false);

  const handleCreateRoom = () => {
    // Logic for creating a room can be added here
    myAxios.post('/api/rooms', { userName: playerName })
      .then((response) => {
        if (response.data && response.data.data) {
          let roomData = response.data.data;
          navigate(`/room/${roomData.roomCode}`, { state: { playerName: playerName } });
        }
      });
  };

  const handleJoinRoom = () => {
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
        {/* <TextInput
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-1/3"
        /> */}
        <TextInput
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="w-1/3"
        />
        <Button color="primary" onClick={onJoinRoom} className="w-1/3">
          Join Room
        </Button>
        <div></div>
        <Button color="secondary" onClick={onCreateRoom} className="w-1/3">
          Create Room
        </Button>
      </div>
      <Modal show={openModal} position="center" size="sm" onClose={() => setOpenModal(false)}>
        <Modal.Header>{isCreateRoom ? 'Create room' : 'Join room'}</Modal.Header>
        <Modal.Body>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Give me some name</h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="text" value="Your name" />
            </div>
            <TextInput
              placeholder="Player Name"
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
          <Button color={isCreateRoom ? 'secondary' : 'primary'} onClick={onConfirmModal}>{isCreateRoom ? 'Create room' : 'Join room'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AuthenticationPage;
