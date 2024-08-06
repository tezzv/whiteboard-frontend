import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css'
import Forms from './components/Forms';
import RoomPage from './Pages/RoomPage';
import { BrowserRouter } from 'react-router-dom';
import BoardState from './context/BoardState';
import io from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import ChatRoom from './components/Chat';

// const server = "http://localhost:5000";
const server = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_SERVER_URL_PROD
  : import.meta.env.VITE_SERVER_URL_DEV;

const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);


function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userJoined");
        setUsers(data.users);
        // toast.info("Joined to room");
      } else {
        console.log("userJoined error");
      }
    });

    socket.on("allUsers", (data) => {
      setUsers(data);
    });

    const userJoinedHandler = (data) => {
      toast.info(`${data} joined the room`);
      // console.log(data);
    };

    const userLeftHandler = (data) => {
      toast.info(`${data} left the room`);
      // console.log(data);
    };

    socket.on("userIsJoinedMessageBroadcasted", userJoinedHandler);
    socket.on("userLeftMessageBroadcasted", userLeftHandler);

    return () => {
      // Clean up event listeners when the component unmounts
      socket.off("userIsJoinedMessageBroadcasted", userJoinedHandler);
      socket.off("userLeftMessageBroadcasted", userLeftHandler);
    };

  }, []);


  return (
    <>
      <BoardState>
        <BrowserRouter>
          <div className="App container">
            <ToastContainer />
            <Routes>
              <Route path='/' element={<Forms
                socket={socket}
              />} />
              <Route path='/:roomId' element={<RoomPage
                socket={socket}
                users={users}
              />} />
              <Route path='/chat' element={<ChatRoom />}></Route>
            </Routes>

          </div>
        </BrowserRouter>
      </BoardState>
    </>
  )
}

export default App
