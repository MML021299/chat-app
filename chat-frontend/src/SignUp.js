import React, {useState} from 'react'
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [register, setRegister] = useState(false);

    const cookies = new Cookies();
    const token = cookies.get("TOKEN");

    // set configurations
    const configuration = {
        method: "post",
        url: "http://localhost:3001/register",
        data: {
          email,
          username,
          password,
        },
      };

    const handleSubmit = (e) => {
        // prevent the form from refreshing the whole page
        e.preventDefault();

        if (password) {
            // make the API call
            axios(configuration)
            .then(() => {
                setRegister(true);
                alert('Account registered successfully!')
                window.location.href = "/";
            })
            .catch((error) => {
                console.log(error)
                setError(error.response.data.message)
            });
        } else {
            setError("Please provide a password!")
        }
    }

    if(token) {
        return <Navigate to='/home' replace />
    }

    return (
        <div className="d-flex flex-grow-1 justify-content-center align-items-center">
            <div>
                <h2>Sign Up</h2>
                <Form onSubmit={(e)=>handleSubmit(e)}>
                    {/* email */}
                    <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                    />
                    </Form.Group>

                    {/* username */}
                    <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                    </Form.Group>

                    {/* password */}
                    <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                    </Form.Group>

                    {/* submit button */}
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Register
                    </Button>
                    {register ? (
                        <p className="text-success">You Are Registered Successfully</p>
                    ) : (
                        <p className="text-danger">{error}</p>
                    )}
                    <label>Already have an account? <a href='/'>Log In</a> now</label>
                </Form>
            </div>
        </div>
    )
}