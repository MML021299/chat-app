import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from "universal-cookie";
import moment from 'moment';

import io from "socket.io-client";
const socket = io.connect("http://localhost:3002");

const ChatWindow = ({ currentUser, contact, messages, onSend }) => {
    const [input, setInput] = useState('');
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState('');
    const [chat, setChat] = useState([]);
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");

    const params = new URLSearchParams({
        room: 'room1'
    })

    const getChatHistory = {
      method: "post",
      url: "http://localhost:3001/chat-history",
      data: {
        userId: currentUser.userId,
        contactId: contact._id, 
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const getRoom = {
      method: "post",
      url: "http://localhost:3001/get-room",
      data: {
        userId: currentUser.userId,
        contactId: contact._id, 
      },
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
            room,
            content: {
                author: currentUser.userName,
                userId: currentUser.userId,
                uniqueId: currentUser.uniqueId,
                message: message,
                contact: contact,
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

        axios(getRoom)
          .then((result) => {
            setRoom(result.data.room)
          })
          .catch((error) => {
            error = new Error();
          });
  
        socket.emit("join_room", room);
        socket.on("receive_message", (data) => {
          setChat((list) => [...list, data]);
        });
        return () => socket.removeListener("receive_message");
    }, [contact, room])

    // for testing only
    // useEffect(() => {
    //     axios(getChatHistory)
    //       .then((result) => {
    //         setChat(result.data.messages);
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       });
    
    //     axios(getRoom)
    //       .then((result) => {
    //         console.log('result.data.room', result.data.room);
    //         setRoom(result.data.room);
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       });
    // }, [contact]);
    
    // useEffect(() => {
    //     if (room) {
    //         socket.emit("join_room", room);
    //     }
    
    //     return () => {
    //         socket.off("receive_message"); // Clean up listener
    //     };
    // }, [room]);
    
    // useEffect(() => {
    //     socket.on("receive_message", (data) => {
    //         setChat((list) => [...list, data]);
    //     });
    
    //     return () => {
    //         socket.off("receive_message"); // Clean up listener
    //     };
    // }, []);

    return (
        <div className="chat-window">
            <h2 style={{textAlign: 'end'}}>{contact.username}</h2>
            <div className="messages">
                {chat.map((msg, index) => {
                    const prevMsg = chat[index - 1];
                    const timeDifference = prevMsg
                        ? moment(msg.dateCreated).diff(moment(prevMsg.dateCreated), 'minutes')
                        : null;
    
                    return (
                        <div key={index}>
                            {timeDifference === null || timeDifference >= 30 ? (
                                <div className="timestamp">
                                    {
                                        moment(msg.dateCreated).isSame(moment(), 'day')
                                        ? moment(msg.dateCreated).format('hh:mm A')
                                        : moment(msg.dateCreated).isAfter(moment().subtract(4, 'days'))
                                        ? moment(msg.dateCreated).format('ddd [at] hh:mm A')
                                        : moment(moment()).diff(msg.dateCreated, 'months') >= 6
                                        ? moment(msg.dateCreated).format('D MMM YYYY [at] hh:mm A')
                                        : moment(msg.dateCreated).format('D MMM [at] hh:mm A')
                                    }
                                </div>
                            ) : null}
                            <div className={`message ${msg.userId === currentUser.userId ? 'received' : 'sent'}`}>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
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