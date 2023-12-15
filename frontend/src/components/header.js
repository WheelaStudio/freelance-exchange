// Header.js
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // Для работы с роутингом

const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <LinkContainer to="/profile">
            <Nav.Link>Профиль</Nav.Link>
          </LinkContainer>

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;