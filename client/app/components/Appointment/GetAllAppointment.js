import React, { Component } from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import moment from 'moment';
import TimeStamp from 'react-timestamp';
import {
  setToken
} from '../../redux/actions/user';

import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

import styled from 'styled-components';
import { Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

const Styles = styled.div`
  .card {
    margin: auto;
    width: 30%;
  }
`;

class GetAllAppointment extends Component {

  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        appointments: [],
        dateOfAppointmentList: []
      };
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
          this.setState({
            token
          });
          if (this.props.user.token!=token) {
            this.props.setToken(token);
          }
        }
        else {
          this.props.history.push('/')
        }
      });
    }
    else {
      this.props.history.push('/')
    }
    let date = [];
      fetch('/api/appointment/getAllAppointment')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          //console.log(json);
          this.setState({
            appointments: json.appointments,
            isLoading: false
          });
        }
        else {
          this.setState({
            isLoading: false
          });
        }
      })
      .then(() => {
        const appointments = this.state.appointments;
        
        for (let i=0; i<appointments.length; i++) {
          let doc = appointments[i];
          date.push(new Date(moment(doc.dateOfAppointment).year(), moment(doc.dateOfAppointment).month(), moment(doc.dateOfAppointment).days(), moment(doc.dateOfAppointment).hours(), moment(doc.dateOfAppointment).minutes(), moment(doc.dateOfAppointment).seconds()));
        }
      })
      .then(() => {
        this.setState({
          dateOfAppointmentList: date,
          isLoading: false
        });
      });
  }
  
  render() {
    const {
      isLoading,
      appointments,
      dateOfAppointmentList
    } = this.state;
    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    return (
      <Styles>
          {
            appointments.map((doc, i) => {
            return (
            <Card key={i}>
              <ListGroup>
                <ListGroupItem variant="info">Appointment {i+1}</ListGroupItem>
                <ListGroupItem>Name: {doc.name}</ListGroupItem>
                <ListGroupItem>Email: {doc.email}</ListGroupItem>
                <ListGroupItem>Date of Appointment: <TimeStamp date={dateOfAppointmentList[i]} /></ListGroupItem>
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

export default connect(mapStateToProps, { setToken })(GetAllAppointment);

