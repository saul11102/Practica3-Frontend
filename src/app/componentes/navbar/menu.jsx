import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Cookies from "js-cookie";
import NavDropdown from 'react-bootstrap/NavDropdown';


export default function navbar() {
    const close = (e) => {
        Cookies.remove('token');
        Cookies.remove('usuario');
    }
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/dashboard">Menú</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/lote">Lotes</Nav.Link>
                        <Nav.Link href="/producto">Productos</Nav.Link>
                        <Nav.Link href="/galeria">Galeria de fotos</Nav.Link>
                    </Nav>
                    <Nav>

                        <Nav.Link href="/session" onClick={(e) => close(e)}>
                            Cerrar sesión
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}