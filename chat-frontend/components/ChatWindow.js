import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from "universal-cookie";

import io from "socket.io-client";
const socket = io.connect("http://localhost:3002");

const ChatWindow = ({ currentUser, contact, messages, onSend }) => {
    const [input, setInput] = useState('');
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");

    const params = new URLSearchParams({
        room: 'room1'
    })

    const getChatHistory = {
      method: "get",
      url: `http://localhost:3001/chat-history?${params}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const handleSend = () => {
        if (input) {
        onSend(input);
        setInput('');
        }
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

    useEffect(() => {
        axios(getChatHistory)
          .then((result) => {
              setChat(result.data.messages)
          })
          .catch((error) => {
              error = new Error();
          });
  
        socket.emit("join_room", "room1");
        socket.on("receive_message", (data) => {
          setChat((list) => [...list, data]);
        });
        return () => socket.removeListener("receive_message");
      }, [])

    return (
        <div className="chat-window">
            <h2 style={{textAlign: 'end'}}>{contact.username}</h2>
            <div className="messages">
                {chat.map((msg, index) => (
                    <div key={index} className={`message ${msg.userId === currentUser.userId ? 'received' : 'sent'}`}>
                        {msg.message}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    className="chat-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;