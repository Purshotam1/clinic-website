import React, { Component } from 'react';
import styled from 'styled-components'; 
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import {TiArrowSortedUp} from 'react-icons/ti'
import { Container, Button } from 'react-bootstrap';
const Styles = styled.div`
  
  
`;

const App = ({ children }) => (
  <>
    <Header />

    <Styles>
      <Button variant="warning" onClick={() => topFunction()} id="myBtn" title="Go to top">
        <TiArrowSortedUp/>
      </Button>
      {children}
     
    </Styles>

    <Footer />
  </>
);

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

export default App;
