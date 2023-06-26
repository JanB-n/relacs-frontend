import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Header from "./Header";
import Tree from "./Tree";
import NewCompound from "./NewCompound";
import LoadFromJson from "./LoadFromJson";
import SaveToJson from "./SaveToJson";
import { Outlet } from "react-router-dom";
import axios from "../api/axios";
import useRefreshToken from "../hooks/useRefreshToken";

const LayoutContext = React.createContext(null);
const treeData = [
  {
    key: "0",
    label: "Documents",
    children: [
      {
        key: "0-0",
        label: "Document 1-1",
        children: [
          {
            key: "0-1-1",
            label: "Document-0-1.doc",
          },
          {
            key: "0-1-2",
            label: "Document-0-2.doc",
          },
        ],
      },
    ],
  },
  {
    key: "1",
    label: "Desktop",
    children: [
      {
        key: "1-0",
        label: "document1.doc",
      },
      {
        key: "0-0",
        label: "documennt-2.doc",
      },
    ],
  },
  {
    key: "2",
    label: "Downloads",
    children: [],
  },
];

function MainLayout() {
  const refresh = useRefreshToken();

  const AddCompound = () => {

  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <Header />
          <button onClick={() => refresh()}> Refresh </button>
        </Col>
      </Row>
      <Row>
      <Col xs = {4} style = {{borderRight: '2px solid black'}}>
        <p>Compounds</p>
        {/* <button onClick={AddCompound}>Add compound</button> */}
        <NewCompound></NewCompound>
        <LoadFromJson></LoadFromJson>
        <SaveToJson></SaveToJson>
        <Tree treeData={treeData} />
      </Col>
      <Col>
        <Row>
          <Outlet />
        </Row>
      </Col>
      </Row>
    
    </Container>
  );
}

export default MainLayout