import React, { Component } from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import {
  Link
} from "react-router-dom";
import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';
import {
  setToken
} from '../../redux/actions/user';

import styled from 'styled-components';
import { Form, Button, Row, Col } from 'react-bootstrap';

const Styles = styled.div`
  .btn {
    cursor: pointer;
  }
  color: white;

  .form-group, .btn {
    margin-left: 25%;
  }
`;
class SignIn extends Component {

  constructor(props) {
    super(props);

    this.state = {
        isLoading: true,
        token: '',
        signInError: '',
        signInEmail: '',
        signInPassword: '',
      };
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj&&obj.token) {
      const { token } = obj;

      fetch('/api/account/verify?token='+token)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            token,
            isLoading: false
          });
          if (this.props.user.token!=token) {
            this.props.setToken(token);
          }
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

  onTextboxChangeSignInEmail = (evt) => {
    this.setState({
      signInEmail: evt.target.value
    });
  };

  onTextboxChangeSignInPassword = (evt) => {
    this.setState({
      signInPassword: evt.target.value
    });
  };

  onSignIn = () => {

    const {
      signInEmail,
      signInPassword
    } = this.state;

    this.setState({
      isLoading: true
    });

    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    }).then(res => res.json())
    .then(json => {
     // console.log('json', json);
      if (json.success) {
        this.props.setToken(json.token);
        setInStorage('the_main_app', { token: json.token });
        //console.log(json.token);
        this.setState({
          signInError: json.message,
          isLoading: false,
          signInEmail: '',
          signInPassword: '',
          token: json.token
        });
        this.props.history.push('/');
      }
      else {
        this.setState({
          signInError: json.message,
          isLoading: false
        });
      }
    });
  };

  render() {
    const {
      isLoading,
      signInError,
      signInEmail,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    return (
        <Styles>

          <Form onSubmit={this.onSignIn}>

            <Form.Group as={Row} >
              <Form.Text column sm="2">
                { 
                  (signInError)?(
                    <p>{signInError}</p>
                  ) : (null) 
                }
              </Form.Text>
            </Form.Group>

            <Form.Group as={Row} controlId="formBasicEmail">
              <Form.Label column sm="2">Email address</Form.Label>
              <Col sm="4">
                <Form.Control 
                  type="email" 
                  value={signInEmail} 
                  placeholder="Email" 
                  onChange={this.onTextboxChangeSignInEmail} 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formBasicPassword">
              <Form.Label column sm="2">Password</Form.Label>
              <Col sm="4">
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  onChange={this.onTextboxChangeSignInPassword} 
                />
              </Col>
            </Form.Group>

            <Form.Group as="Row" >
              <Button column sm="2" variant="primary" type="submit">
                Sign In
              </Button>
            </Form.Group>

            <Form.Group as={Row} controlId="signUp">
              <Form.Label column sm="3">New User?<Link to="/signUp"><Button variant="dark">SignUp</Button></Link></Form.Label>
            </Form.Group>
          </Form>
        </Styles>
      );
  }
}

function mapStateToProps(state){
  return {
    user:state.user
  }
}

export default connect(mapStateToProps, { setToken })(SignIn);
