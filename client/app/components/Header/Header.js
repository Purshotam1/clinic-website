import React, { Component } from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MDBSmoothScroll } from "mdbreact";

import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';
import { Nav, Navbar } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
  .navbar {
    background-color: #2d2d30;
  }
  .navbar-toggler {
    background-color: #bbb;
  }
  .navbar-brand {
    color: #bbb;
    &:hover {
      color: white;
    }
    font-size: 2em;
  }

  .navbar-nav .nav-link {
    font-size: 1.1em;
    color: #bbb;
    &:hover {
      color: white;
    }
  }
`;


import {
  setToken
} from '../../redux/actions/user';
class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.token !== nextProps.user.token) {
      console.log(nextProps);
      if (nextProps.user) {
        let token = nextProps.user.token;
        fetch('/api/account/verify?token='+token)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          if (this.props.user.token!=token) {
            this.props.setToken(token);
          }
          this.setState({
            token,
          });
        }
        else {
          this.setState({
            token: ''
          });
        }
      });
      }
    }
}

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    const obj = getFromStorage('the_main_app');
    if (obj&&obj.token) {
      const { token } = obj;

      fetch('/api/account/verify?token='+token)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          if (this.props.user.token!=token) {
            this.props.setToken(token);
          }
          this.setState({
            token,
            isLoading: false
          });
        }
        else {
          this.setState({
            isLoading: false
          });
        }
      });
    }
    else {
      this.setState({
        isLoading: false
      });
    }
  }



  render() {
      let {
        token,
        isLoading
      } = this.state;

      //console.log("token",token);

      if (isLoading) {
        return (
          <p>Loading...</p>
        );
      }

      return (
        <Styles>
          <Navbar collapseOnSelect sticky="top" expand="lg">
            <Navbar.Brand href="/">PHYSIOFITSIMRANSINGH</Navbar.Brand>
            <Navbar.Toggle bg="secondary" aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" >
              {
                (!token) ? (
                  <Nav className="ml-auto">
                    <Nav.Item><Nav.Link href="#info">Info</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#images">Images</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#services">Services</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#addAppointments">Book Appointments</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#contact">Contact</Nav.Link></Nav.Item>
                  </Nav>
                ) : (
                  <Nav className="ml-auto">
                    <Nav.Item><Nav.Link href="#info">Info</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#images">Images</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#services">Services</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#addAppointments">Book Appointments</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="#contact">Contact</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/getAllAppointments">All Appointments</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/getAllAccount">Account To Approve</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/updateTime">Update Time</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/uploadImage">Upload Image</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/userAccount">Account</Nav.Link></Nav.Item>
                  </Nav>
                )
              }
            </Navbar.Collapse>
          </Navbar>
        </Styles>
      );
  }
}

function mapStateToProps(state){
  return {
    user:state.user
  }
}

export default connect(mapStateToProps, { setToken })(Header);
