/* eslint-disable react/prop-types */
import React from 'react'
import './index.css';
import copyIcon from './copyicon3.png';
import { useContext, useState } from 'react';
import BoardContext from '../../../context/BoardContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// eslint-disable-next-line react/prop-types
const CreateRoomForm = ({ socket }) => {
    const navigate = useNavigate();

    const context = useContext(BoardContext);
    const { uuid, setUser } = context;

    const [roomId, setRoomId] = useState('');
    const [name, setName] = useState('');
    // console.log(name);
    // console.log(roomID);

    const handleGenerateCode = (e) => {
        e.preventDefault();
        setRoomId(uuid());
    }

    const handleCreateRoom = (e) => {
        e.preventDefault();

        const roomData = {
            name,
            roomId,
            userId: uuid(),
            host: true,
            presenter: true
        }

        setUser(roomData);
        navigate(`/${roomId}`);
        console.log(roomData);
        socket.emit("userJoined", roomData);
    }


    const handleCopyCode = (e) => {
        e.preventDefault();
        const input = document.getElementById("roomCode");

        if (input) {
            navigator.clipboard.writeText(input.value);
            // console.log(input.value);
            toast.dark("Room Code Copied to clipboard");
        }
    }

    return (
        <>
            <div className="container">
                <form className="form" action="">
                    <p className="title">Create Room</p>
                    <input
                        placeholder="Enter your name"
                        className="username input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className='generatecode mb-3'>
                        <input
                            className='code'
                            placeholder='Generate room code'
                            type='text'
                            disabled
                            value={roomId}
                            id='roomCode'
                        />
                        <div className='gendiv'>
                            <button className='genbtn' onClick={handleGenerateCode}>Generate</button>
                            <button className='copybtn'
                                onClick={handleCopyCode}
                                disabled={!roomId}
                            >
                                <img className='copyicon' src={copyIcon} />
                            </button>
                        </div>
                    </div>
                    {/* <input placeholder="Password" className="password input" type="password" /> */}
                    <button className="btnR" type="submit" onClick={handleCreateRoom}
                        disabled={!name || !roomId}
                    >Generate Room</button>
                </form>
            </div>
        </>
    )
}

export default CreateRoomForm