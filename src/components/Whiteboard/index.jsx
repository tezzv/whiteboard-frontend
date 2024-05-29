/* eslint-disable react/prop-types */
import React, { useContext, useLayoutEffect, useRef, useEffect, useState } from 'react'
import rough from 'roughjs';
import './index.css'
import BoardContext from '../../context/BoardContext';

const roughGenerator = rough.generator();

const WhiteBoard = ({socket}) => {

    const context = useContext(BoardContext);
    const {tool, color, ctxRef, canvasRef, elements, setElements, user, lineWeight} = context;
    
    const [img1, setImg1] = useState(null);

    useEffect(() => {
    socket.on("whiteBoardDataResponse", (data) => {
        setImg1(data.imgURL);
    })

    // eslint-disable-next-line
    }, [])

    if(!user.presenter){
        return(
            <div className="canvas overflow-hidden">
                <img src={img1} alt='Real time whiteboard image shared by presenter' />
            </div>
        )
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        const ctx = canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctxRef.current = ctx;

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        ctxRef.current.strokeStyle = color;
        // eslint-disable-next-line
    }, [color])

    let numw = 2;

    useEffect(() => {
        numw = parseInt(`{${lineWeight}}`)
    }, [lineWeight])

    useLayoutEffect(() => {
        const roughCanvas = rough.canvas(canvasRef.current);

        if (elements.length > 0) {
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        elements.forEach((element) => {
            if (element.type === 'rect') {
                roughCanvas.draw(
                    roughGenerator.rectangle(
                        element.offsetX,
                        element.offsetY,
                        element.width,
                        element.height,
                        {
                            stroke: element.stroke,
                            strokeWidth: 2,
                            roughness: 0,
                        }
                    )
                );
            }
            else if (element.type === 'line') {
                roughCanvas.draw(
                    roughGenerator.line(
                        element.offsetX,
                        element.offsetY,
                        element.width,
                        element.height,
                        {
                            stroke: element.stroke,
                            strokeWidth: 2 ,
                            roughness: 0,
                        }
                    )
                );
            } else if (element.type === 'pencil') {
                roughCanvas.linearPath(element.path, {
                    stroke: element.stroke,
                    strokeWidth: 2,
                    roughness: 0,
                });
            }
        });

        const canvasImage = canvasRef.current.toDataURL();
        socket.emit("whiteboardData", canvasImage);

        // eslint-disable-next-line
    }, [elements])

    const [isDrawing, setIsDrawing] = useState(false);



    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        // console.log(offsetX, offsetY);

        if (tool === 'pencil') {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: 'pencil',
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color,
                },
            ])
        }
        else if (tool === 'line') {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: 'line',
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    stroke: color,
                },
            ]);
        }
        else if (tool === 'rect') {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: 'rect',
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    stroke: color,
                },
            ]);
        }

        setIsDrawing(true);
    }

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (isDrawing) {
            // console.log(offsetX, offsetY);

            // pencil by default as state

            if (tool === 'pencil') {
                const { path } = elements[elements.length - 1];
                const newpath = [...path, [offsetX, offsetY]];
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                path: newpath,

                            };
                        } else {
                            return ele;
                        }
                    })
                )
            }
            else if (tool === 'line') {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX,
                                height: offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            }
            else if (tool === 'rect') {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX - ele.offsetX,
                                height: offsetY - ele.offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            }
        }
    }

    const handleMouseUp = (e) => {
        setIsDrawing(false);
        // console.log('up', e);
    }

    return (
        <>
            {/* {JSON.stringify(elements)} */}
            <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="canvas overflow-hidden"
            >
                <canvas
                    ref={canvasRef}
                >
                </canvas>
            </div>
        </>
    )
}

export default WhiteBoard;