import React from "react";
import { Navbar, Image, Form, Col } from "@themesberg/react-bootstrap";
import "./Header.css";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();

  return (
    <Navbar
      sticky="top"
      variant="light"
      bg="light"
      className="header main-nav justify-content-between navbar-theme-primary"
    >
      <Navbar.Brand className="me-lg-3 mx-4">
        {/* name and logo */}
      </Navbar.Brand>
    </Navbar>
  );
};

export default Header;
