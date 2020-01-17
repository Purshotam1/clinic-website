import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  Link
} from "react-router-dom";

class VerifyAppointmentPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      done:false,
      succ: false,
      isLoading: false,
      id: 'null',
      errorMessage: ''
    };
  }

  

  verify = () => {
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get('id');
    this.setState({
      id:id,
      isLoading:true,
      done:true
    });
    //console.log("id=",id);
    fetch('/api/appointment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    }).then(res => res.json())
    .then(json => {
      //console.log('json', json.message);
      if (json.success) {
        
        this.setState({
          succ: true,
          errorMessage: json.message,
          isLoading: false
        });
      }
      else {
        this.setState({
          isLoading: false,
          errorMessage: json.message
        })
      }
    });
  }

  render() {
    const {
      succ,
      isLoading,
      done,
      id,
      errorMessage
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    return (
      <div>
        <div>
        
        {
          (done) ? (
            
              (succ)? (
                <div>
                  <p>Your email is verified</p>
                  <p>{errorMessage}</p>
                </div>
              ):(
                <div>
                  <p>{errorMessage}</p>
                </div>
              )
            
          ):(
            <div>
              <button onClick={this.verify}>Click to verify</button>
            </div>
          )
        }
        
        
        </div>
      </div>
    );
  }
}

export default VerifyAppointmentPage;
