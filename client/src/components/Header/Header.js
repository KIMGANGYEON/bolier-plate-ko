import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrap = styled.div`
  position: sticky;
  background-color: red;
  width: 100%;
  top: 0;
  padding: 0px 20px;
  .Header {
    display: flex;
    justify-content: space-around;
  }
`;

function Header() {
  return (
    <>
      <Wrap>
        <div className="Header">
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <h1>Home</h1>
          </Link>
          <Link to="/login" style={{ textDecoration: "none", color: "white" }}>
            <h1>Signin</h1>
          </Link>
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "white" }}
          >
            <h1>Signup</h1>
          </Link>
          <Link
            to="/video/upload"
            style={{ textDecoration: "none", color: "white" }}
          >
            <h1>Video Upload</h1>
          </Link>
        </div>
      </Wrap>
    </>
  );
}

export default Header;
