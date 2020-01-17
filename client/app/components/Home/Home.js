import React, { Component } from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import path from 'path';
import AddAppointment from '../Appointment/AddAppointment';
import styled from 'styled-components';
import {FaDotCircle}  from 'react-icons/fa'
import { Carousel, Card, ListGroup, ListGroupItem, Image, Container } from 'react-bootstrap';

import {
  setToken
} from '../../redux/actions/user';
import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

const Styles = styled.div`
  
  .card {
    margin: auto;
  }
  .btn {
    cursor: pointer;
  }

  .list-group-item {
    font-style: oblique;
  }
`;
const StylesInfo = styled.div`

  h1 {
    text-align: center;
    color: white;
  }

  h2 {
    text-align: center;
    color: white;
  }

  .rounded-circle{
    height: 250px;
    width: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    margin-bottom: 5px;
  }

  .list-group {
    margin: auto;
    width: 450px;
    color: white;
  }

  .list-group-item {
    text-align: left;
    background-color: transparent;
    border: 0 none;
  }
`;

const StylesCarousel = styled.div`

  .carousel {
    width: 1000px;
    height: auto;
    margin: auto
  }

  .img {
    width: 1000px;
    height: auto;
    display: block;
  }
`;

const StylesServices = styled.div`
  h1 {
    color: white;
    text-align: center;
  }
  .card-title {
    margin: auto
    font-size: 30px;
  }
`;

const StylesAppointment = styled.div`

`;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      isLoading: false,
      images: [],
      profilePhoto: ''
    };
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    this.setState({
      isLoading: true
    });
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
      });
    }
    
    fetch('/api/image/getImages')
    .then(res => res.json())
    .then(json => {
      console.log(json)
      if (json.success) {
        
        this.setState({
          images: json.images
        });
      }
    });

    fetch('/api/image/getProfilePhoto')
    .then(res => res.json())
    .then(json => {
      console.log(json)
      if (json.success) {
        
        this.setState({
          profilePhoto: json.photo,
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    });

  }

  render() {
      let {
        token,
        images,
        isLoading,
        profilePhoto
      } = this.state;

      //console.log("token",token);

      if (isLoading) {
        return (
          <p>Loading...</p>
        );
      }

      return (
        
          <Styles>
            <StylesInfo id="info">
              {
                (profilePhoto) ? (
                  <Image src={path.join('/', profilePhoto.imageData.replace(/^.*[\\\/]/, ''))} roundedCircle/>
                ) : (null)
              }
              <h1>Simran Singh</h1>
              <br />
              <br />
              <h2>Education</h2>
              <ListGroup as="ul">
                <ListGroupItem as="li">
                  <FaDotCircle/>&nbsp;&nbsp;Bachelors Of Physiotherapy<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp; From BJ Medical College, GOVT Spine Institute.
                </ListGroupItem>
                <ListGroupItem as="li">
                <FaDotCircle/>&nbsp;&nbsp;Aquatic Therapy From ATNI
                </ListGroupItem>
                <ListGroupItem as="li">
                <FaDotCircle/>&nbsp;&nbsp;Aerobics Instructor From IAFT
                </ListGroupItem>
              </ListGroup>
            </StylesInfo>
            <br />
            <br />
            <StylesCarousel>
              <Carousel id="images">
                  {
                    images.map((image, i) => {
                      console.log(image.imageData.replace(/^.*[\\\/]/, ''));
                      return (
                          <Carousel.Item key={i}>
                            <img className="img" src={path.join('/', image.imageData.replace(/^.*[\\\/]/, ''))} />
                          </Carousel.Item>
                      );
                    })
                  }
              </Carousel>
            </StylesCarousel>
            <br />
            <br />
            <StylesServices>
              <Container id="services">
                <h1>Services</h1>
                <Card style={{ width: '25rem' }}>
                  <ListGroup>
                    <ListGroupItem variant="success">
                      Physiotherapy-Pediatric
                    </ListGroupItem>
                    <ListGroupItem variant="danger">
                      Orthopedic, Neurological, Musculoskeletal, Cardiovascular
                    </ListGroupItem>
                    <ListGroupItem variant="success">
                      Aquatic Therapy
                    </ListGroupItem>
                    <ListGroupItem variant="danger">
                      Nutrition Plans for Weigth loss and gain, PCOD, PCOS, etc.
                    </ListGroupItem>
                    <ListGroupItem variant="success">
                      Fitness Training
                    </ListGroupItem>
                    <ListGroupItem variant="danger">
                      Aerobics Exercise Training
                    </ListGroupItem>
                  </ListGroup>
                </Card>
              </Container>
            </StylesServices>
            <br />
            <br />
            <StylesAppointment>
              <Container id="addAppointments">
              <AddAppointment />
              </Container>
            </StylesAppointment>
            <br />
            <br/>
        </Styles>    
      );
  }
}

function mapStateToProps(state){
  return {
    user:state.user
  }
}

export default connect(mapStateToProps, { setToken })(Home);
