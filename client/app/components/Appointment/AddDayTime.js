import React, { Component } from 'react';
import 'whatwg-fetch';
import DateTime from 'react-datetime';
import moment from 'moment';
import styled from 'styled-components';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';

const Styles = styled.div`
  .form-group, .btn {
    margin-left: 25%;
    color: white;
  }
  .btn {
    cursor: pointer;
  }
`;
class AddDayTime extends Component {

  constructor(props) {
    super(props);

    this.state = {
        errorMessage: '',
        isLoading: false,
        day: 0,
        name: 'Sunday',
        isAvailable: true,
        start: null,
        end: null,
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      };
  }

  componentDidMount() {
    let {
        day
    } = this.state;

    this.setState({
        isLoading: true
    });

    fetch('/api/appointment/getTime?day=' + day)
    .then(res => res.json())
    .then(json => {
        if (json.success) {
            this.setState({
                start: json.doc[0].start,
                end: json.doc[0].end,
                isAvailable: json.doc[0].isAvailable,
                isLoading: false
            });
        } else {
            this.setState({
                isLoading: false
            });
        }
    });
    
  }

  onDayChange = (evt) => {

    this.setState({
        isLoading: true
    });

    const {
        dayName
    } = this.state;

    const index = dayName.indexOf(evt.target.value);
    //console.log(evt.target.value);
    this.setState({
        name: evt.target.value,
        day: index,
    });
    fetch('/api/appointment/getTime?day=' + index)
    .then(res => res.json())
    .then(json => {
        if (json.success) {
            this.setState({
                start: json.doc[0].start,
                end: json.doc[0].end,
                isAvailable: json.doc[0].isAvailable,
                isLoading: false
            });
            //console.log(json.doc[0]);
        } else {
            this.setState({
                isLoading: false
            });
        }
    });

  };

  onAvailabilityChange = () => {
    console.log(1);
    this.setState({
      isAvailable: !this.state.isAvailable
    });
  };

  onStartChange = (e) => {
    console.log(e.target.value);
    let str = e.target.value;
    let hr = str.substring(0,2);
    let mn = str.substring(3,5);
    hr = parseInt(hr);
    mn = parseInt(mn);
    const date = new Date();
    this.setState({
      start: new Date(date.getFullYear(), date.getUTCMonth(), date.getUTCDate(), hr, mn)
    });
    console.log(new Date(date.getFullYear(), date.getUTCMonth(), date.getUTCDate(), hr, mn));
  };

  onEndChange = (e) => {
    console.log(e.target.value);
    let str = e.target.value;
    let hr = str.substring(0,2);
    let mn = str.substring(3,5);
    hr = parseInt(hr);
    mn = parseInt(mn);
    const date = new Date();
    this.setState({
      end: new Date(date.getFullYear(), date.getUTCMonth(), date.getUTCDate(), hr, mn)
    });
    console.log(new Date(date.getFullYear(), date.getUTCMonth(), date.getUTCDate(), hr, mn));
  };

  updateTime = (evt) => {

    this.setState({
        isLoading: true
    });
    let {
        day,
        isAvailable,
        start,
        end
    } = this.state;


    //console.log(this.state);
    fetch('/api/appointment/updateTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          day,
          start,
          end,
          isAvailable
        })
      })
    .then(res => res.json())
    .then(json => {
        
            this.setState({
                errorMessage: json.message,
                isLoading: false
            });
        
    });
  };

  render() {
    const {
        isLoading,
        isAvailable,
        start,
        end,
        errorMessage
      } = this.state;
  
      if (isLoading) {
        return (<Styles><p>Loading...</p></Styles>);
      }

      

      return (
        <Styles>
          <Form onSubmit={this.updateTime}>
            <Form.Group>
            {
              (errorMessage)? (
                <Form.Text>{errorMessage}</Form.Text>
              ) : (null)
            }
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">Select Day</Form.Label>
              <Col sm="4">
                <Form.Control value={this.state.name} as="select" onChange={this.onDayChange}>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </Form.Control>
              </Col>
            </Form.Group>

            {
              (isAvailable) ? (
                <Container>
                  <Form.Group as={Row}>
                    <Form.Label column sm="2">Start Time</Form.Label>
                    <Col sm="4">
                      <Form.Control type="time" onChange={this.onStartChange}></Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column sm="2">End Time</Form.Label>
                    <Col sm="4">
                      <Form.Control type="time" onChange={this.onEndChange}></Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Button column sm="2" variant="info" onClick={this.onAvailabilityChange}>Not Available</Button>
                  </Form.Group>

                </Container>
              ) : (
                <Form.Group as={Row}>
                  <Button column sm="2" variant="info" onClick={this.onAvailabilityChange}>Available</Button>
                </Form.Group>
              )
            }
            <Form.Group as={Row}>
              <Button column sm="2" type="submit" variant="dark">Submit</Button>
            </Form.Group>
          </Form>
        </Styles>
      );
  }
}

export default AddDayTime;
