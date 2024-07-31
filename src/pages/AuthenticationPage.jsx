import React from 'react';
import { Button, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const AuthenticationPage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = React.useState('');
  const [roomCode, setRoomCode] = React.useState('');

  const handleCreateRoom = () => {
    // Logic for creating a room can be added here
    navigate(`/room/${roomCode}`);
  };

  const handleJoinRoom = () => {
    // Logic for joining a room can be added here
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Dying Message</h1>
      <TextInput
        placeholder="Player Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="w-1/3"
      />
      <TextInput
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="w-1/3"
      />
      <Button onClick={handleCreateRoom} className="w-1/3 bg-blue-500 hover:bg-blue-700 text-white">
        Create Room
      </Button>
      <Button onClick={handleJoinRoom} className="w-1/3 bg-gray-500 hover:bg-gray-700 text-white">
        Join Room
      </Button>
    </div>
  );
};

export default AuthenticationPage;
