import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col } from 'react-bootstrap';

const LandingLayout = () => {
  return <>
    {/* <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/" className="mr-auto">EasyChef</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto" style=''>
            <Nav.Link href="/SignUp"><Button variant="outline-success">Sign Up</Button></Nav.Link>
            <Nav.Link href="/LogIn"><Button variant="outline-primary">Log In</Button></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar> */}
    <Navbar className="shadow-sm px-5" bg="light" expand="lg">
      {/* <Navbar.Brand className="ms-5" style={{ justifyContent: 'space-between', width: '80%' }} href="/"><span style={{ color: 'green' }}>Easy</span>Chef</Navbar.Brand> */}
      <Navbar.Brand className="ms-5" style={{ justifyContent: 'space-between', width: '80%' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span style={{ color: 'green' }}>Easy</span>Chef
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Item>
            <Nav.Link>
              <Link to="/login">
                <Button variant="outline-success">Log In</Button>
              </Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/signup">
                <Button variant="success">Sign Up</Button>
              </Link>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    {/* <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action2">Link</Nav.Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar> */}

    <Outlet />
  </>
}

export default LandingLayout