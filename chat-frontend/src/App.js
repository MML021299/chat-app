import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";

// import Register from "./Register";
// import Login from "./Login";
import SignUp from "./SignUp";
import Login from "./Login";
import FreeComponent from "./FreeComponent";
import Home from "./Home";
import Chat from "./Chat";

import io from "socket.io-client";

const socket = io.connect("http://localhost:3002");

function App() {
  return (
    <Container>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/free" element={<FreeComponent />} />
        <Route path="/home" element={
            <ProtectedRoutes children={<Home />}/>
          }
        />
        <Route path="/chat" element={
            <ProtectedRoutes children={<Chat socket={socket} />}/>
          }
        />
      </Routes>
    </Container>
  );
}

export default App;