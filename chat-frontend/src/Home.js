import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button, Row, Col } from "react-bootstrap";

import ChatWindow from "./components/ChatWindow";
import ContactList from "./components/ContactList";

import "./App.css"

export default function Home() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const [currentUser, setCurrentUser] = useState([]);
    const [users, setUsers] = useState([]);

    const [chatHistory, setChatHistory] = useState({});
    const [selectedContact, setSelectedContact] = useState({});

    // set configurations for the API call here
    const getCurrentUserConfig = {
        method: "get",
        url: "http://localhost:3001/auth-endpoint",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const getAllUsersConfig = {
        method: "get",
        url: "http://localhost:3001/users",
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

        axios(getAllUsersConfig)
        .then((result) => {
            // assign the message in our result to the message we initialized above
            setUsers(result.data.message);
            // console.log(result)
        })
        .catch((error) => {
            error = new Error();
        });
    }, [])

    const logout = () => {
        // destroy the cookie
        cookies.remove("TOKEN", { path: "/" });
        // redirect user to the landing page
        window.location.href = "/";
    }

    const enterChat = () => {
        console.log('entering room')
        window.location.href = "/chat";
    }

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };
    
    const handleSendMessage = (message) => {
        setChatHistory((prev) => ({
            ...prev,
            [selectedContact.id]: [
            ...(prev[selectedContact.id] || []),
            message,
            ],
        }));
    };
    
    return (
        <>
            <div className="header">
                <h1>Chat App</h1>
                <button onClick={logout}>Logout</button>
            </div>
            <div className="app">
            <div className="chat-container">
                <ContactList users={users} currentUser={currentUser} onSelect={handleSelectContact} />
                {selectedContact && (
                    <ChatWindow
                        currentUser={currentUser}
                        contact={selectedContact}
                        messages={chatHistory[selectedContact.id] || []}
                        onSend={handleSendMessage}
                    />
                )}
            </div>
            </div>
        </>
    );
}