// Header.js
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = (props) => {
          console.log(props)

  return (


    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {props.props === 'freelancer' ? (
            <Nav className="ml-auto">
                <Nav.Item>Вы фрилансер</Nav.Item>
                <LinkContainer to="/my-orders">
                    <Nav.Link>Мои заказы</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/vacancies">
                    <Nav.Link>Поиск команды</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/profile">
                    <Nav.Link>Профиль</Nav.Link>
                </LinkContainer>
            </Nav>
        ) : props.props === 'customer' ? (
            <Nav className="ml-auto">
                <Nav.Item>Вы покупатель</Nav.Item>
                <LinkContainer to="/my-orders">
                    <Nav.Link>Мои заказы</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/create_order">
                    <Nav.Link className={'btn btn-primary'}>Создать заказ</Nav.Link>
                </LinkContainer>
            </Nav>
        ) : props.props === 'manager' ? (
            <Nav className="ml-auto">
                <Nav.Item>Вы менеджер</Nav.Item>
                <LinkContainer to="/my-orders">
                    <Nav.Link>Мои заказы</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/">
                    <Nav.Link>Биржа</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/team">
                    <Nav.Link>Команда</Nav.Link>
                </LinkContainer>
            </Nav>
        ) : (
            <Nav className="ml-auto">

            </Nav>
        )}


      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;