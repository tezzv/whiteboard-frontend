/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
// import { useRef, useState } from 'react'
import './index.css'
import WhiteBoard from '../../components/Whiteboard';
import BoardContext from '../../context/BoardContext';
import { toast } from 'react-toastify';
import chatIcon from './message2.svg';
import ChatRoom from '../../components/Chat';
import { lineLength } from 'roughjs/bin/geometry';

const RoomPage = ({ socket, users }) => {
  const context = useContext(BoardContext);
  const { tool, setTool, color, setColor, handleClearCanvas, history, elements, undo, redo, user, setChat, setLineWeight, lineWeight } = context;
  const [openUsersTab, setOpenusersTab] = useState(false);
  const [openChatBox, setOpenChatBox] = useState(false);


  const chatBoxOpenHandler = (e) => {
    e.preventDefault();
    setOpenChatBox(true);
  }


  useEffect(() => {
    const messageHandler = (data) => {
      // console.log(data);
      setChat((prevChats) => [...prevChats, data]);
    };

    socket.on("messageResponse", messageHandler);

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("messageResponse", messageHandler);
    };
    // eslint-disable-next-line
  }, []); // Empty dependency array, runs once on mount


  const handleChangeLineweight = (e) => {
    setLineWeight(e.target.value);
    console.log(lineWeight);
  };



  return (
    <>
      <div className='roompage container'>
        <div className='topBtns'>
          <button className='btnUsers btn btn-dark' onClick={() => setOpenusersTab(true)}>Users {`(${users.length})`}</button>
          <button className='btnIcon' onClick={chatBoxOpenHandler} ><img className='btnIcon' src={chatIcon} alt='messages' /></button>
        </div>
        {
          openChatBox && <ChatRoom setOpenChatBox={setOpenChatBox} socket={socket} />
        }

        {
          openUsersTab &&
          <div className="usersTab">
            <button className='btnClose1 btn btn-light btn-block pd-2 mt-2' onClick={() => setOpenusersTab(false)}>Close</button>
            <p className='text-center my-5'><h4>All Users {`(${users.length})`}</h4></p>
            <div className='mt-5 pd-5'>
              {
                users.map((usr, index) => {
                  return <p key={index} className='text-center my-2'>
                    {usr.name}
                    {user && user.userId === usr.userId && " (You)"}
                    {usr.host && " (Host)"}
                  </p>
                })
              }
            </div>
          </div>
        }

        <div className="header1">
          {!user.presenter &&

            <h1 className="mt-4 mb-2 title1">Whiteboard - Realtime Sharing App</h1>
          }

          {/* <h3>Users Online : {users.length}</h3> */}
        </div>
        {user.presenter &&

          <div className='tools mt-4'>
            <section className='pd-3'>
              <div className='tools2'>

                <label title="pencil" htmlFor="pencil" className="label">
                  <input id="pencil" name="tool" value='pencil' onChange={(e) => setTool(e.target.value)} type="radio"
                    checked={tool === 'pencil'}
                  />
                  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7508 5.42598L21.4716 11.1466M1.44873 25.4482L8.38683 24.0503C8.75516 23.9761 9.09335 23.7947 9.35895 23.529L24.8906 7.98944C25.6352 7.2444 25.6347 6.03672 24.8894 5.29231L21.5993 2.00599C20.8543 1.26188 19.6472 1.26239 18.9028 2.00712L3.36961 17.5483C3.10452 17.8135 2.92351 18.151 2.84923 18.5186L1.44873 25.4482Z"
                      stroke="#D17842" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p style={{ color: 'white' }}>Pencil</p>
                </label>

                <label title="line" htmlFor="line" className="label">
                  <input id="line" name="tool" value='line' onChange={(e) => setTool(e.target.value)} type="radio"
                    checked={tool === 'line'}
                  />
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 19.4L10.7 10.7L19.4 2" stroke="#D17842" stroke-width="3" stroke-linecap="round" />
                  </svg>
                  <p style={{ color: 'white' }}>Line</p>
                </label>

                <label title="rect" htmlFor="rect" className="label">
                  <input id="rect" name="tool" value='rect' onChange={(e) => setTool(e.target.value)} type="radio"
                    checked={tool === 'rect'}
                  />
                  <svg width="21" height="21" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1.3999" width="20" height="20" stroke="#D17842" stroke-width="2" />
                  </svg>
                  <p style={{ color: 'white' }}>Rect</p>
                </label>

                <label title="color" htmlFor="color" className="label">
                  <input id="color" name="tool" value={color} onChange={(e) => setColor(e.target.value)} type="color" />
                  <p style={{ color: 'white' }}>Set Color</p>
                </label>

              </div>

              <div className='urbtns'>
                <button className='urbtn'
                  disabled={elements.length === 0}
                  onClick={undo}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.87115 14.5C5.88914 17.6939 8.80463 20 12.2424 20C16.5268 20 20 16.4183 20 12C20 7.58172 16.5268 4 12.2424 4C9.37103 4 6.86399 5.60879 5.52267 8M4.87115 7.21845L5.93971 8.25008M7.87879 9H4V5L7.87879 9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p style={{ color: 'white' }}>Undo</p>
                </button>
                <button className='urbtn'
                  disabled={history.length < 1}
                  onClick={redo}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.1288 14.5C18.1109 17.6939 15.1954 20 11.7576 20C7.47319 20 4 16.4183 4 12C4 7.58172 7.47319 4 11.7576 4C14.2706 4 16.5045 5.23225 17.9221 7.14279M18.4773 8C18.3099 7.70154 18.1243 7.41526 17.9221 7.14279M17.9221 7.14279L16.1212 9H20V5L17.9221 7.14279ZM18.0606 8.66667L19.2727 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p style={{ color: 'white' }}>Redo</p>
                </button>
              </div>
              <div>
                <button className='urbtn' onClick={handleClearCanvas}
                  disabled={elements.length === 0}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6.17647H20M9 3H15M10 16.7647V10.4118M14 16.7647V10.4118M15.5 21H8.5C7.39543 21 6.5 20.0519 6.5 18.8824L6.0434 7.27937C6.01973 6.67783 6.47392 6.17647 7.04253 6.17647H16.9575C17.5261 6.17647 17.9803 6.67783 17.9566 7.27937L17.5 18.8824C17.5 20.0519 16.6046 21 15.5 21Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p style={{ color: 'white' }}>Clear Canvas</p>
                </button>
              </div>
            </section>

            {/* line weight */}
            {/* <div className="properties">
              <div style={{ display: 'flex' }}>
                <p>Line Weight</p>
                <select value={lineWeight} onChange={handleChangeLineweight}>
                  <option>1</option>
                  <option defaultValue={true}>2</option>
                  <option>4</option>
                  <option>6</option>
                  <option>8</option>
                  <option>10</option>
                </select>
              </div>
            </div> */}
          </div>
        }

        <div className='canvas1 mt-4 canvas-box  '>
          <WhiteBoard
            socket={socket}
          />
        </div>


      </div>
    </>
  )
}

export default RoomPage