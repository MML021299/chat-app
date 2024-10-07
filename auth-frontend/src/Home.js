import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button, Row, Col } from "react-bootstrap";

export default function Home() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const [currentUser, setCurrentUser] = useState([]);
    const [users, setUsers] = useState([]);

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
    
    return (
        <div>
            <div className="text-center">
                <h1 className="text-center">Home</h1>
                <h3 className="text-center">Welcome, {currentUser.userName}</h3>
                <Button type="submit" variant="danger" onClick={() => logout()}>
                    Logout
                </Button>
            </div>
            <div className="mx-auto col-5 d-block mt-5 border border-3 border-dark">
                <h2 className="text-center">Chat with other users </h2>
                <div>
                    {users.filter(user => user._id !== currentUser.userId).map((e, index) => {
                        return (
                            <Row className="align-items-center">
                                <Col xs={8} className="d-flex justify-content-start">
                                    <ul key={index}>
                                        {e.username}
                                    </ul>
                                </Col>
                                <Col xs={4} className="d-flex justify-content-end">
                                    <button onClick={enterChat}>Chat</button>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            </div>
        </div>  
    );
}