import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import App from './components/App/App';
import NotFound from './components/App/NotFound';

import Home from './components/Home/Home';

import VerifyPage from './components/Account/VerifyPage';

import SignIn from './components/Account/SignIn';

import SignUp from './components/Account/SignUp';

import GetAllAccount from './components/Account/GetAllAccount';

import GetAllAppointment from './components/Appointment/GetAllAppointment';

import AddAppointment from './components/Appointment/AddAppointment';

import AddDayTime from './components/Appointment/AddDayTime';

import VerifyAppointmentPage from './components/Appointment/VerifyAppointmentPage';

import UserAccount from './components/Account/UserAccount';

import UploadImage from './components/Image/UploadImage';

import{Provider} from 'react-redux'
import store from './redux/store'
import styled from 'styled-components';

const Styles = styled.div`
background-image: url("background.jpg");
background-repeat: no-repeat;
background-attachment: fixed;
  
  #myBtn {
    display: none; /* Hidden by default */
    position: fixed; /* Fixed/sticky position */
    bottom: 20px; /* Place the button at the bottom of the page */
    right: 30px; /* Place the button 30px from the right */
    z-index: 99; /* Make sure it does not overlap */
    cursor: pointer; /* Add a mouse pointer on hover */
    padding: 15px; /* Some padding */
    border-radius: 10px; /* Rounded corners */
    font-size: 18px; /* Increase font size */
  }

  #myBtn:hover {
    background-color: #555; /* Add a dark-grey background on hover */
  }
`;
render((
  <Provider store={store}>
    <Router>
      <Styles>
        <App>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/verify" component={VerifyPage}/>
            <Route path="/verifyAppointment" component={VerifyAppointmentPage}/>
            <Route path="/signIn" component={SignIn}/>
            <Route path="/signUp" component={SignUp}/>
            <Route path="/getAllAccount" component={GetAllAccount}/>
            <Route path="/getAllAppointments" component={GetAllAppointment}/>
            <Route path="/updateTime" component={AddDayTime}/>
            <Route path="/userAccount" component={UserAccount}/>
            <Route path="/uploadImage" component={UploadImage}/>
            <Route component={NotFound}/>
          </Switch>
        </App>
      </Styles>
    </Router>
  </Provider>
), document.getElementById('app'));

//Get the button:
const mybutton = document.getElementById("myBtn");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
