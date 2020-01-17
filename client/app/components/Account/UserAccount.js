import React, { Component } from 'react';
import 'whatwg-fetch';
import path from 'path';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';
import {
  setToken
} from '../../redux/actions/user';
import styled from 'styled-components';
import { Button, Form, Row, Col, Image } from 'react-bootstrap';
const Styles = styled.div`
  text-align: center;
  color: white;
  .img {
    display: block;
    width: 200px;
    margin: auto;
  }
  .btn {
    cursor: pointer;
  }
`;
const StylesForm = styled.div`
  .form-control-file{
    margin-left: 45%;
  }
`;
class UserAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      isLoading: false,
      profilePhoto: ''
    };
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    this.setState({
      isLoading: false
    });
    if (obj&&obj.token) {
      const { token } = obj;
      console.log(token);
      fetch('/api/account/verify?token='+token)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            token,
          });
          if (this.props.user.token!=token) {
            this.props.setToken(token);
          }
        }
        else {
          this.props.history.push('/');
        }
      });
    }
    else {
      this.props.history.push('/');
    }

    fetch('api/image/getProfilePhoto')
    .then(res => res.json())
    .then(json => {
      console.log(json);
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
    })
  }

  setDefaultImage = () => {
    this.setState({
        profilePhoto: ''
    })
  }

  uploadImage = (e) => {
    let imageObj = {};
    let imageFormObj = new FormData();

    imageFormObj.append("imageName", "multer-image-" + Date.now());
    imageFormObj.append("imageData", e.target.files[0]);

    this.setState({
        multerImage: URL.createObjectURL(e.target.files[0])
    });
    
    axios.post(`http://localhost:8080/api/image/uploadProfilePhoto`, imageFormObj)
    .then((data) => {
        console.log(data);
        if (data.data.success) {
            alert('Image Uploaded');
            this.setDefaultImage();
            window.location.reload();
        } 
    })
    .catch((err) => {
        alert('Error');
        this.setDefaultImage();
    })
  }
  
  logOut = () => {
    this.setState({
      isLoading: true
    });
    const token = this.state.token;
    if (token) {
      // Verify token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          setInStorage('the_main_app', '');
          this.props.setToken('');
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
            this.props.history.push('/');
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
      let {
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
          <h2 style={{textAlign: "center"}}>Account</h2>
          <br/>
          <br/>
          {
            (profilePhoto) ? (
              <Image className="img" src={path.join('/', profilePhoto.imageData.replace(/^.*[\\\/]/, ''))} />
            ) : (null)
          }
          <StylesForm>
            <Form>
              <Form.Group>
                <Form.Label>Update Profile Photo</Form.Label>
                <Form.Control type="file" onChange={(e) => this.uploadImage(e)} />
              </Form.Group>
            </Form>
          </StylesForm>
          <br />
          <br />
          <Button variant="danger" onClick={this.logOut}>Log Out</Button>
          <br/>
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

export default connect(mapStateToProps, { setToken })(UserAccount);
