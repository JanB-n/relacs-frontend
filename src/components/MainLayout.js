import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Header from "./Header";
import Compounds from "./Compounds";
import NewCompound from "./NewCompound";
import LoadFromJson from "./LoadFromJson";
import SaveToJson from "./SaveToJson";
import { Outlet } from "react-router-dom";
import axios from "../api/axios";
import useRefreshToken from "../hooks/useRefreshToken";
import { useNavigate } from 'react-router-dom';

const LayoutContext = React.createContext(null);

function MainLayout({children}) {
  const refresh = useRefreshToken();

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <Header />
          {/* <button onClick={() => refresh()}> Refresh </button> */}
        </Col>
      </Row>
      <Row>
      {/* <Col xs = {4} style = {{borderRight: '2px solid black'}}> */}
        
        {/* <NewCompound /> */}
        {/* <Nav.Link href="/Compounds">Compounds</Nav.Link> */}
        {/* <LoadFromJson />
        <SaveToJson /> */}
        {/* <h2>Compounds</h2>
        <Compounds /> */}
      {/* </Col> */}
      <Col>
        <Row>
          {/* <Outlet /> */}
          {children}
        </Row>
      </Col>
      </Row>
    
    </Container>
  );
}

export default MainLayout