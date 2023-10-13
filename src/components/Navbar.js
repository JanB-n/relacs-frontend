import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import NewCompound from './NewCompound';

function NavbarMenu() {

  const logout = useLogout();
  const navigate = useNavigate();
  const signOut = async () => {
    await logout();
    navigate('/login')
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Relacs Web</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/Compounds">Compounds</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link onClick={signOut}>Logout</Nav.Link>
          </Nav>
          {/* <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
            </Nav.Link>
          </Nav> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarMenu;