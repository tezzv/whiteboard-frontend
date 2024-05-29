import React, { useEffect, useRef, useState } from 'react'
import BoardContext from './BoardContext';
// import io from "socket.io-client";
// import { useContext } from 'react';

const BoardState = (props) => {


    const [tool, setTool] = useState('pencil');
    const [color, setColor] = useState('#000000');


    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [user, setUser] = useState(null);

    const handleClearCanvas = () => {
        setHistory(elements);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillRect = "white";
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setElements([]);
    }

    const undo = () => {
        if (elements.length === 1) {
            handleClearCanvas();
            return null;
        }
        setHistory((prevHistory) => [
            ...prevHistory,
            elements[elements.length - 1],
        ]);

        setElements((prevElements) =>
            prevElements.slice(0, prevElements.length - 1)
        );
    }

    const redo = () => {
        setElements((prevElements) => [
            ...prevElements,
            history[history.length - 1],
        ]);

        setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
    }


    const uuid = () => {
        var S4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (
            S4() +
            S4() +
            "-" +
            S4() +
            "-" +
            S4() +
            "-" +
            S4() +
            "-" +
            S4() +
            S4() +
            S4()
        );
    };


    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");

    const [lineWeight, setLineWeight] = useState(2);








    return (
        <BoardContext.Provider value={{
            tool, setTool, color, setColor, canvasRef, ctxRef, elements, setElements, handleClearCanvas, history, setHistory,
            undo, redo, uuid, user, setUser, chat, setChat, message, setMessage, lineWeight, setLineWeight
        }}>
            {props.children}
        </BoardContext.Provider>
    )
}

export default BoardState;