import React, { Component } from 'react';
import 'whatwg-fetch';
import DateTime from 'react-datetime';
import moment from 'moment';
import styled from 'styled-components';
import { Card, Modal, Button, ButtonToolbar, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
const Styles = styled.div`
  .btn {
    margin: auto;
    cursor: pointer;
  }
`

class AddAppointment extends Component {

  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        addAppointmentError: '',
        email: '',
        name: '',
        dateOfAppointment: new Date(),
        time: [],
        isAvailable: true,
        start: null,
        end: null,
        timeAvailable: false,
        modalShow: false
      };
  }

  componentDidMount() {
      let {
          dateOfAppointment
      } = this.state;
    let day = dateOfAppointment.getDay();
    fetch('/api/appointment/getTime?day=' + day)
    .then(res => res.json())
    .then(json => {
        if (json.success) {
            //console.log(json.doc[0])
            const dateStart = moment(json.doc[0].start);
            const dateEnd = moment(json.doc[0].end);
            this.setState({
                isAvailable: json.doc[0].isAvailable,
                start: new Date(
                    dateStart.year(), 
                    dateStart.month(), 
                    dateStart.days(), 
                    dateStart.hours(), 
                    dateStart.minutes(), 
                    dateStart.seconds()
                  ),
                end: new Date(
                    dateEnd.year(), 
                    dateEnd.month(), 
                    dateEnd.days(), 
                    dateEnd.hours(), 
                    dateEnd.minutes(), 
                    dateEnd.seconds()
                  ),
                dateOfAppointment
            });
        } else {
            this.setState({
                dateOfAppointment
            });
        }
    })
    .then(() => {
      this.setTimeList();
      //console.log(this.state);
    })
    .then(() => {
      this.setState({
        isLoading: false
      })
    });
  }

  onTextboxChangeEmail = (evt) => {
    this.setState({
      email: evt.target.value
    });
  };

  onTextboxChangeName = (evt) => {
    this.setState({
      name: evt.target.value
    });
  };

  setTimeList = () => {
    let time = [];
    let start = null;
    let end = null;
    //console.log(this.state);
    let startMomentDate = moment(this.state.start);
    let endMomentDate = moment(this.state.end);
    start = new Date(startMomentDate.year(), startMomentDate.month(), startMomentDate.days(), startMomentDate.hours(), startMomentDate.minutes(), startMomentDate.seconds());
    end = new Date(endMomentDate.year(), endMomentDate.month(), endMomentDate.days(), endMomentDate.hours(), endMomentDate.minutes(), endMomentDate.seconds());
    // console.log(startMomentDate.format("YYYY-MM-DD hh:mm:ss A Z"));
    // console.log(endMomentDate.format("YYYY-MM-DD hh:mm:ss A Z"));
     //console.log(start);
    // console.log(end);
    // console.log(start<end);
    for (let temp=start; temp<=end; temp=new Date(temp.setMinutes(temp.getMinutes()+30))) {
        let dateOfAppointment = new Date(this.state.dateOfAppointment);
        let val = new Date(temp);
      
        let date = new Date(dateOfAppointment.getFullYear(), dateOfAppointment.getMonth(), dateOfAppointment.getDate(), val.getHours(), val.getMinutes());
        fetch('/api/appointment/checkAppointment?time=' + date)
        .then(res => res.json())
        .then(json => {
            //console.log(json);
            //console.log(date);
            if (json.success) {
                time.push(new Date(temp.setMinutes(temp.getMinutes()-30)));
            }
        })
        .then(() => {
          this.setState({
            time
          });
        });
    }
    
  }

  onDateChange = (e) => {
        //console.log(e.target.value);
        const value = new Date(e.target.value);
        //console.log(value);
        let day = value.getDay();
        this.setState({
          isLoading: true
        });
        fetch('/api/appointment/getTime?day=' + day)
        .then(res => res.json())
        .then(json => {
            if (json.success) {
                //console.log(json.doc)
                this.setState({
                    isAvailable: json.doc[0].isAvailable,
                    start: json.doc[0].startTime,
                    end: json.doc[0].endTime,
                    dateOfAppointment: value,
                });
            } else {
                this.setState({
                    dateOfAppointment: value
                });
            }
        })
        .then(() => {
          this.setTimeList();
        })
        .then(() => {
          this.setState({
            isLoading: false
          });
        });
    };

  onTimeChange = (evt) => {
    let dateOfAppointment = new Date(this.state.dateOfAppointment);
    let temp = new Date(evt.target.value);
    
    let date = new Date(dateOfAppointment.getFullYear(), dateOfAppointment.getMonth(), dateOfAppointment.getDate(), temp.getHours(), temp.getMinutes());
    //console.log(evt.target.value);
    this.setState({
      dateOfAppointment: date
    });
  }

  addAppointment = () => {
    
    const {
      email,
      name,
      dateOfAppointment
    } = this.state;

    this.setState({
      isLoading: true
    });

    fetch('/api/appointment/addAppointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        name: name,
        dateOfAppointment: dateOfAppointment
      })
    }).then(res => res.json())
    .then(json => {
      //console.log('json', json);
      if (json.success) {
        this.setState({
          addAppointmentError: json.message,
          isLoading: false,
          email: '',
          name: '',
          dateOfAppointment: new Date()
        });
        alert("Appoinmenet is noted, it will be confirmed after you verify your email");
        this.props.history.push('/');
      }
      else {
        this.setState({
          addAppointmentError: json.message,
          isLoading: false
        });
      }
    });
  };

  getDate = (date) => {
    const day = date.getUTCDate();
    const month = date.getUTCMonth();
    const year = date.getFullYear();

    return (year+"/"+month+"/"+day);
  };

  MyVerticallyCenteredModal = (props) => {
    const {
      addAppointmentError,
      email,
      name,
      dateOfAppointment,
      isAvailable,
      time
    } = this.state;
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Book Appointment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{
              (addAppointmentError)? (
                addAppointmentError
              ) : (null)
            }
          </p>
          <Form onSubmit={this.addAppointment}>

            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={this.onTextboxChangeName} />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" value={email} onChange={this.onTextboxChangeEmail} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            
            <Form.Group controlId="formBasicDate">
              <Form.Label>Date</Form.Label>
              <Form.Control 
                value={moment(dateOfAppointment).format("YYYY-MM-DD")} 
                type="date" 
                onChange={this.onDateChange}
                style={{width: "40%"}}  
              />
            </Form.Group>
            {
              (isAvailable) ? (
                <div>
                  <Form.Control style={{width: "40%"}} as="select" onChange={(value) => this.onTimeChange(value)}>
                    <option value="Select Time">Select Time</option>
                  {
                    time.map((doc, i) => {
                      return (
                        (doc.getMinutes() <= 9) ? (
                        <option key={i} value={doc}>{doc.getHours()}:0{doc.getMinutes()}</option>
                        ) : (
                        <option key={i} value={doc}>{doc.getHours()}:{doc.getMinutes()}</option>
                        )
                      );
                    })
                  }
                  </Form.Control>                              
                </div>
              ) : (
                <div>
                    <p>Not Available That Day</p>
                </div>
              )
            }
            <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };
  
  setModalShow = (val) => {
    this.setState({
      modalShow: val
    });
  };

  bookForm = () => {
    const modalShow = this.state.modalShow;
  
    return (
      <ButtonToolbar>
        <Button variant="success" onClick={() => this.setModalShow(true)}>
          Book Appointment
        </Button>
  
        <this.MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => this.setModalShow(false)}
        />
      </ButtonToolbar>
    );
  };

  render() {
    const {
        isLoading,
      } = this.state;
      //console.log(this.state);
      if (isLoading) {
        return (<Styles><p>Loading...</p></Styles>);
      }

      

      return (
        <Styles>
          <h3 style={{color: "white", textAlign: "center"}}>Address</h3>
          <h5 style={{color: "white", textAlign: "center"}}>
            18, Sawan Society,<br/> Bhaduatnagar, Isanpur,<br/> Ahmedabad-380050
          </h5>
          <h4 style={{color: "white", textAlign: "center"}}>Timing: 7 P.M - 9 P.M</h4>
          <this.bookForm />
        </Styles>
      );
  }
}

export default AddAppointment;
