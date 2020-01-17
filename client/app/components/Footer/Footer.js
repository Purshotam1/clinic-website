import React from 'react';
import { FaFacebook, FaInstagram, FaMailBulk, FaPhone }  from 'react-icons/fa';
import { IconContext } from 'react-icons';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
const Styles = styled.div`
  .text-center {
    background-color:#2d2d30;
    color: #f5f5f5;
  }
  
  .btn{
    margin-bottom: 15px;
  }
`
function openInNewTab(url) {
  console.log(url);
  var win = window.open(url, '_blank');
  if (win!=null) {
    win.focus();
  }
}

const Footer = () => (
  <Styles>
    <footer id="contact" className="text-center">
      <br/>
      <IconContext.Provider value={{size: "2em"}}>
        <Button variant="outline-info"><FaPhone/> +917567881573</Button>&nbsp;&nbsp;&nbsp;
        <Button variant="outline-primary"  
          onClick={() => openInNewTab("https://www.facebook.com/profile.php?id=100002514747794")}>
          <FaFacebook />
        </Button>&nbsp;&nbsp;&nbsp;
        <Button variant="outline-primary"><FaMailBulk/>  simransingh7101@gmail.com</Button>&nbsp;&nbsp;&nbsp;
      </IconContext.Provider>
      <br/>
    </footer> 
  </Styles>

);

export default Footer;
