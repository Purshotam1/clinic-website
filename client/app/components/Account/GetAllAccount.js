import React, { Component } from 'react';
import 'whatwg-fetch';
import {connect} from 'react-redux'
import moment from 'moment';
import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';
import {
  setToken
} from '../../redux/actions/user';

import styled from 'styled-components';
import { Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

const Styles = styled.div`
  .card {
    margin: auto;
    width: 30%;
  }
`;
class GetAllAccount extends Component {

  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        accounts: [],
        token: ''
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
          this.props.history.push('/')
        }
      });
    }
    else {
      this.setState({
        isLoading: false
      });
      this.props.history.push('/')
    }

      fetch('/api/account/getAllAccount')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            accounts: json.accounts,
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

  approve = (i) => {
    
    this.setState({
        isLoading: true
    });

    fetch('/api/account/approve?id=' + this.state.accounts[i]._id)
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        this.state.accounts[i].isUprooved = true;
        this.forceUpdate();
        this.setState({
            isLoading:false
          });
      } else {
        this.setState({
            isLoading: false
        });
      }  
    });
  };
  
  render() {
    const {
      isLoading,
      accounts,
      status,
      token
    } = this.state;
    //console.log(accounts);
    if (isLoading) {
      return (<Styles><p>Loading...</p></Styles>);
    }

    return (
        <Styles>
          {
            accounts.map((user, i) => {
            return (
            <Card key={i}>
              <ListGroup>
                <ListGroupItem variant="info">User {i+1}</ListGroupItem>
                <ListGroupItem>Email: {user.email}</ListGroupItem>
                <ListGroupItem>SignUp Date: {moment(user.signUpDate).format("YYYY-MM-DD")}</ListGroupItem>
                {
                  (user.isUprooved)? (
                    <ListGroupItem>
                        <Button disabled>Approved</Button>
                    </ListGroupItem>
                  ):(
                    <ListGroupItem>
                        <Button variant="info" onClick={() => this.approve(i)}>Approve</Button>
                    </ListGroupItem>
                  )
                }
              </ListGroup>
              <br />
              <br />
            </Card>
            )
            })
          }

        </Styles>
      );
  }
}

function mapStateToProps(state){
  return {
    user:state.user
  }
}

export default connect(mapStateToProps, { setToken })(GetAllAccount);

