import React from 'react'
import {Container, Col, Row} from 'react-bootstrap';
import { Header } from '../Header';
import { Tree } from '../Tree';

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


export default function MainLayout({children}) {
  return (
    <LayoutContext.Provider value ={null}>
        <Container fluid>
            <Col xs={12}>
                <Row>
                    <Header/>
                </Row>
            </Col>
            <Col>
                <Row>
                    <p>Compounds</p>
                    <Tree treeData={treeData}/>
                </Row>
            </Col>
            <Col>
                <Row>
                    {children}
                </Row>
            </Col>
        </Container>
    </LayoutContext.Provider>
  )
}
