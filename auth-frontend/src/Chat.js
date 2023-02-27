import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button, Row, Col } from "react-bootstrap";
import { Navigate } from "react-router-dom";

import './Chat.css'

export default function Chat({ socket }) {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    useEffect(() => {
      socket.emit("join_room", "room1");
      socket.on("receive_message", (data) => {
        console.log(data)
        setChat((list) => [...list, data]);
      });
    }, [])
    
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };
    
    const sendMessage = async () => {
      const messageContent = {
        room: "room1",
        content: {
            message: message,
        },
      };
      await socket.emit("send_message", messageContent);
      setChat((list) => [...list, messageContent.content]);
      setMessage('');
    };
    
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
                        {msg.message}
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