/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import BoardContext from '../../../context/BoardContext';
import './index.css';

const JoinRoomForm = ({ socket }) => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");

    const context = useContext(BoardContext);
    const { uuid, setUser } = context;

    const handleJoinRoom = (e) => {
        e.preventDefault();

        const roomData = {
            name,
            roomId,
            userId: uuid(),
            host: false,
            presenter: false
        }

        setUser(roomData);
        navigate(`/${roomId}`);
        console.log(roomData);
        socket.emit("userJoined", roomData);
    }

    return (
        <>
            <div className="container">
                <form className="form" action="">
                    <p className="title">Join Room</p>
                    <input placeholder="Enter your name" className="username input"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text" />
                    <input placeholder="Enter your room code" className="password input"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        type="text" />
                    <button className="btnR1"
                        disabled={!name || !roomId}
                        type="submit"
                        onClick={handleJoinRoom}>Join Room</button>
                </form>
            </div>
        </>
    )
}

export default JoinRoomForm