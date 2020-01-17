import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  Link
} from "react-router-dom";

class VerifyPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      done:false,
      succ: false,
      isLoading: false,
      id: 'null'
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
    fetch('/api/account/verify', {
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
          isLoading: false
        });
      }
      else {
        this.setState({
          isLoading: false
        })
      }
    });
  }

  render() {
    const {
      succ,
      isLoading,
      done,
      id
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
                  <p>Wait for the account to be uprooved by the admin. You will get notified when it is uprooved</p>
                </div>
              ):(
                <div>
                  <p>Your email is expired, please again signup</p>
                  <Link to="/signUp">signUp</Link>
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

export default VerifyPage;
