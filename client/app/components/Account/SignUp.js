import React, { Component } from 'react';
import 'whatwg-fetch';
import AfterSignUp from './AfterSignUp';

import styled from 'styled-components';
import { Form, Button, Row, Col } from 'react-bootstrap';

const Styles = styled.div`
  .form-group, .btn {
    margin-left: 25%;
  }
  .btn {
    cursor: pointer;
  }
`

class SignUp extends Component {

  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        signUpError: '',
        signUpEmail: '',
        signUpPassword: '',
      };
  }

  onTextboxChangeSignUpEmail = (evt) => {
    this.setState({
      signUpEmail: evt.target.value
    });
  };

  onTextboxChangeSignUpPassword = (evt) => {
    this.setState({
      signUpPassword: evt.target.value
    });
  };

  onSignUp = () => {
    
    const {
      signUpEmail,
      signUpPassword
    } = this.state;

    this.setState({
      isLoading: true
    });

    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword
      })
    }).then(res => res.json())
    .then(json => {
      //console.log('json', json);
      if (json.success) {
        this.setState({
          signUpError: json.message,
          isLoading: false,
          signUpEmail: '',
          signUpPassword: ''
        });
      }
      else {
        this.setState({
          signUpError: json.message,
          isLoading: false
        });
      }
    });
  };



  render() {
    const {
        isLoading,
        signUpEmail,
        signUpError
      } = this.state;
  
      if (isLoading) {
        return (<div><p>Loading...</p></div>);
      }

      if (signUpError=="Verify Your Email") {
          return (
            <AfterSignUp/>
          );
      }

      return (
        <Styles>

          <Form onSubmit={this.onSignUp}>

            <Form.Group as={Row} >
              <Form.Text column sm="2">
                { 
                  (signUpError)?(
                    <p>{signUpError}</p>
                  ) : (null) 
                }
              </Form.Text>
            </Form.Group>

            <Form.Group as={Row} controlId="formBasicEmail">
              <Form.Label column sm="2">Email address</Form.Label>
              <Col sm="4">
                <Form.Control 
                  type="email" 
                  value={signUpEmail} 
                  placeholder="Email" 
                  onChange={this.onTextboxChangeSignUpEmail} 
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formBasicPassword">
              <Form.Label column sm="2">Password</Form.Label>
              <Col sm="4">
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  onChange={this.onTextboxChangeSignUpPassword} 
                />
              </Col>
            </Form.Group>

            <Form.Group as="Row" >
              <Button column sm="2" variant="primary" type="submit">
                Sign Up
              </Button>
            </Form.Group>
          </Form>
        </Styles>
      );
  }
}

export default SignUp;
