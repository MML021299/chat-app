import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button, Row, Col } from "react-bootstrap";
import { Navigate } from "react-router-dom";

import './Chat.css'

export default function Chat({ socket }) {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const [currentUser, setCurrentUser] = useState("");

    // set configurations for the API call here
    const getCurrentUserConfig = {
      method: "get",
      url: "http://localhost:3001/auth-endpoint",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const params = new URLSearchParams({
        // Hardcoded for now
        room: 'room1'
    })

    const getChatHistory = {
      method: "get",
      url: `http://localhost:3001/chat-history?${params}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    useEffect(() => {
      axios(getCurrentUserConfig)
        .then((result) => {
            // assign the message in our result to the message we initialized above
            setCurrentUser(result.data.user);
        })
        .catch((error) => {
            error = new Error();
        });

      axios(getChatHistory)
        .then((result) => {
            setChat(result.data.messages)
        })
        .catch((error) => {
            error = new Error();
        });

      socket.emit("join_room", "room1");
      socket.on("receive_message", (data) => {
        console.log(data)
        setChat((list) => [...list, data]);
      });
      return () => socket.removeListener("receive_message");
    }, [])
    
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };
    
    const sendMessage = async () => {
      const messageContent = {
        room: "room1",
        content: {
            author: currentUser.userName,
            userId: currentUser.userId,
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
                return (
                    <div
                        key={index}
                        className="messageContainer"
                        id={msg.userId === currentUser.userId ? "You" : "Other"}
                    >
                        <div className="messageIndividual">
                          {msg.author}: {msg.message}
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