/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import './index.css';
import sendIcon from './sendIcon.svg';
import closeIcon from './closeIcon2.svg';
import BoardContext from '../../context/BoardContext';

const ChatRoom = ({ setOpenChatBox, socket }) => {
  const context = useContext(BoardContext);
  const { chat, setChat, message, setMessage } = context;


  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      socket.emit("message", { message });
      // console.log(message);
      setChat((prevChats) => [...prevChats, { message, name: "You" }]);
      setMessage("");
    }
  }

  const chatBoxCloseHandler = (e) => {
    e.preventDefault();
    setOpenChatBox(false);
  }

  return (
    <>
      <div className='chatRoom'>
        <div className='chatNav'>
          <h5 className='p-2'>Messages</h5>
          <button className='btnChatClose me-2' onClick={chatBoxCloseHandler}><img src={closeIcon} alt='close' /></button>
        </div>
        <div className='chatArea'>
          {
            chat.map((msg, index) => {
              return <p className='text-center my-2' key={index} >{msg.name}: {msg.message}</p>
            })
          }
        </div>
        <form onSubmit={handleSubmit}>
          <div className='newChat mb-2'>
            <input className='inputMsg ms-2'
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Enter message'
            />
            <button className='sendChat me-2' type='submit'><img style={{ width: '24px' }} src={sendIcon} alt='send' /></button>
          </div>
        </form>
      </div>
    </>
  )
}

export default ChatRoom