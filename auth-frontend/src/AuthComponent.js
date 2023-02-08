import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Button } from "react-bootstrap";

export default function AuthComponent() {
    const cookies = new Cookies();
    const token = cookies.get("TOKEN");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // set configurations for the API call here
        const configuration = {
            method: "get",
            url: "http://localhost:3001/auth-endpoint",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // make the API call
        axios(configuration)
        .then((result) => {
            // assign the message in our result to the message we initialized above
            setMessage(result.data.message);
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
    

    return (
        <div className="text-center">
            <h1 className="text-center">Auth Component</h1>
            <h3 className="text-center text-danger">{message}</h3>
            <Button type="submit" variant="danger" onClick={() => logout()}>
                Logout
            </Button>
        </div>
    );
}