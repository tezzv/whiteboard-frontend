import React from 'react';
import CreateRoomForm from "./CreateRoomForm"
import JoinRoomForm from "./JoinRoomForm"
import './index.css';


// eslint-disable-next-line react/prop-types
const Forms = ({ socket }) => {
    return (
        <>
            <div className="forms">
                <CreateRoomForm
                    socket={socket}
                />
                <JoinRoomForm
                    socket={socket}
                />
            </div>
        </>
    )
}

export default Forms