import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button, Row, Col } from "react-bootstrap";
import { Navigate } from "react-router-dom";

import './Chat.css'

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3002');
        socket.onopen = () => {
            console.log("Websocket connected")
            setWs(socket);
        }
        socket.onmessage = (e) => {
            console.log(e)
            if(e.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    console.log("Result: " + reader.result);
                    setChat([ ...chat, reader.result ]);
                };
                reader.readAsText(e.data)
            } else {
                setChat([ ...chat, e.data ]);
            }
        }
        socket.onclose = () => {
            console.log("Websocket disconnected");
        }
        return () => {
            socket.close();
        }
    }, [chat])

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };
    
    const sendMessage = (e) => {
        e.preventDefault();
        ws.send(message);
        setMessage('');
    };

    // const socket = new WebSocket('ws://localhost:3002');

    // socket.addEventListener('open', (e) => {
    //     console.log("Connected to WS server");
    // });

    // socket.addEventListener('message', (e) => {
    //     console.log(`Message from server: ${e.data}`)
    // })

    // socket.addEventListener('error', (e) => {
    //     console.log(e)
    // })
    
    return (
        <div className="AppChat">
        <div className="chatContainer">
          <div className="messages" id="msg">
            {chat.map((msg, index) => {
                // console.log(msg)
                // return(
                //     <li key={index}>asdf</li>
                // )
                return (
                    <div
                        key={index}
                        className="messageContainer"
                    //   id={val.author === authState.username ? "You" : "Other"}
                    >
                        <div className="messageIndividual">
                        {/* {val.author}: {val.message} */}
                        {msg}
                        </div>
                    </div>
                );
            })}
          </div>
          <div className="messageInputs">
            <input
              id="messageInputId"
              type="text"
              placeholder="Message..."
              value={message}
              onChange={handleInputChange}
            />
            <button id="btnSend" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
}