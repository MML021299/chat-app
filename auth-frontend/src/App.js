import { Container, Col, Row } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";

// import Register from "./Register";
// import Login from "./Login";
import Account from "./Account";
import FreeComponent from "./FreeComponent";
import AuthComponent from "./AuthComponent";

function App() {
  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>React Authentication Tutorial</h1>

          <section id="navigation">
            <a href="/">Home</a>
            <a href="/free">Free Component</a>
            <a href="/auth">Auth Component</a>
          </section>
        </Col>
      </Row>

      {/* <Row>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Register />
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Login />
        </Col>
      </Row> */}

      <Routes>
        <Route exact path="/" element={<Account />} />
        <Route exact path="/free" element={<FreeComponent />} />
        <Route path="/auth" element={
            <ProtectedRoutes children={<AuthComponent />}/>
          }
        />
      </Routes>
    </Container>
  );
}

export default App;