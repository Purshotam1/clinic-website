import React, { Component } from 'react';
import 'whatwg-fetch';
import { connect } from 'react-redux';
import path from 'path';
import {
  setToken
} from '../../redux/actions/user';
import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';
import axios from 'axios'
import styled from 'styled-components';
import { Carousel, Container, Form, Image, Row, Col, Button } from 'react-bootstrap';

const Styles = styled.div`
  color: white;
  .btn {
    cursor: pointer;
  }
`;
const StylesCarousel = styled.div`

  .btn {
    margin-left: 40%;
  }

  .img {
    width: 1000px;
    height: auto;
    display: block;
  }
`;

const StylesForm = styled.div`
  .form-group {
    margin-left: 25%;
  }
`;
class UploadImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      isLoading: false,
      multerImage: '',
      images: []
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

    fetch('/api/image/getImages')
    .then(res => res.json())
    .then(json => {
      console.log(json)
      if (json.success) {
        
        this.setState({
          images: json.images,
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    });
  }

  setDefaultImage = () => {
      this.setState({
          multerImage: ''
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
      
      axios.post(`http://localhost:8080/api/image/uploadMulter`, imageFormObj)
      .then((data) => {
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

  deleteFile = (i) => {
    const image = this.state.images[i];

    fetch('/api/image/deleteImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: image
      })
    }).then(res => res.json())
    .then(json => {
      if (json.success) {
        alert("Image is Deleted");
        window.location.reload();
      } else {
        alert("Server Error");
      }
    });
  }

  render() {
      let {
        token,
        isLoading,
        images
      } = this.state;

      //console.log("token",token);

      if (isLoading) {
        return (
          <p>Loading...</p>
        );
      }

      return (
        <Styles>
          <br/>
          <br/>
          <StylesCarousel>
            {
              images.map((image, i) => {
                console.log(i);
                return (
                  <Container key={i}>
                    <Image className="img" src={path.join('/', image.imageData.replace(/^.*[\\\/]/, ''))} />
                    <br/>
                    <Button  onClick={() =>this.deleteFile(i)} variant="danger">Delete</Button>
                    <br/>
                    <br/>
                  </Container>
                );
              })
            }
          </StylesCarousel>
          <br/>
          <br/>
          <StylesForm>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm="2">Upload Image</Form.Label>
                <Col sm="4">
                  <Form.Control type="file" onChange={(e) => this.uploadImage(e)} />
                </Col>
                <Image src={this.state.multerImage} alt="upload-image" />
              </Form.Group>
            </Form>
          </StylesForm>
            
        </Styles>
      );
  }
}

function mapStateToProps(state){
  return {
    user:state.user
  }
}

export default connect(mapStateToProps, { setToken })(UploadImage);
