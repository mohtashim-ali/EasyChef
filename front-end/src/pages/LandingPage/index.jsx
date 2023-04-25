// import React from 'react';
// import { Button, Container } from 'react-bootstrap';
// import './style.css';

// function LandingPage() {
//   return (
//     <Container fluid style={{ height: '90vh'}} className="d-flex justify-content-center align-items-center">
//       <div className="landing-content">
//         <h1>Welcome to <span style={{ color: 'green' }}>Easy</span>Chef!</h1>
//         <p>Find delicious recipes and cook like a pro! Sign up or log in to get started.</p>
//         <div className="landing-buttons">
//           <Button variant="success" className="mx-2" href="/signup">Sign Up</Button>{' '}
//           <Button variant="outline-success" className="mx-2" href="/login">Log In</Button>
//         </div>
//       </div>
//     </Container>
//   );
// }

// export default LandingPage;

import React from 'react';
import { Container, Button } from 'react-bootstrap'; // Replace this with the image link

function LandingPage() {
  const styles = {
    backgroundImage: `url(https://img.freepik.com/free-photo/copy-space-italian-food-ingredients_23-2148551732.jpg?w=2000)`,
    backgroundSize: 'cover',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <Container fluid style={styles}>
      <div className="landing-content">
        <h1>Welcome to <span style={{ color: 'green' }}>Easy</span>Chef!</h1>
        <p>Find delicious recipes and cook like a pro! Sign up or log in to get started.</p>
        <div className="landing-buttons">
          <Button variant="success" className="mx-2" href="/signup">Sign Up</Button>{' '}
          <Button variant="outline-success" className="mx-2" href="/login">Log In</Button>
        </div>
      </div>
    </Container>
  );
}

export default LandingPage;






    // <div className="landing-container">
    //     <h1>Hello!</h1>
    //   <div className="landing-content">
    //     <h1>Welcome to EasyChef</h1>
    //     <p>Find delicious recipes and cook like a pro! Sign up or log in to get started.</p>
    //     <div className="landing-buttons">
    //       <Button variant="primary" href="/signup">Sign Up</Button>{' '}
    //       <Button variant="secondary" href="/login">Log In</Button>
    //     </div>
    //   </div>
    // </div>