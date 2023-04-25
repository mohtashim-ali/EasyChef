import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs'

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [username, setUsername] = useState('');
  
  // useEffect(() => {
  //   if (!token) {
  //     // Redirect the user to the login page
  //     navigate('/login');
  //   }
  // }, [navigate, token]);

  useEffect(() => {
    async function getUsername() {
      const username = await localStorage.getItem('username');
      setUsername(username);
    }
    if (!token) {
      console.log(token)
      // Redirect the user to the login page
      // alert("Please log in to use EasyChef!")
      navigate('/login');
    }
    else{
      getUsername();
    }
  }, [alert]);

  const styles = {
    backgroundImage: `url(https://img.freepik.com/free-photo/ingredients-cabbage-carrot-pie-cabbage-carrots-eggs-flour-milk-butter-spices-white-background_127032-2819.jpg?w=2000)`,
    backgroundSize: 'cover',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  
  // User is authenticated, render the home page content
  return (
    <Container fluid style={styles} className="d-flex justify-content-center align-items-center">
      <div className="landing-content">
        {/* First Time User */}
        <h1>Hey {username}!</h1>
        <p>We're so glad you're here. Ready to discover new flavors? Click below to explore our collection of mouth-watering recipes.</p>
        <div className="landing-buttons">
          <Button as={Link} to={"/search"} variant="success" className="mx-2">Explore Recipes <BsSearch className="ms-1"/></Button>
        </div>
      </div>
    </Container>
  );
};
  
export default Home;



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button, Container } from 'react-bootstrap';

// const Home = () => {
//   const navigate = useNavigate();
//   const token = sessionStorage.getItem('token');
  
//   if (!token) {
//   // Redirect the user to the login page
//   navigate('/login');
//   }

//   console.log(sessionStorage.getItem('username'))
  
//   // User is authenticated, render the home page content
//   return (
//     <Container fluid style={{ height: '85vh'}} className="d-flex justify-content-center align-items-center">
//       <div className="landing-content">
//         {/* First Time User */}
//         <h1>Hey {window.sessionStorage.getItem("username")}!</h1>
//         <p>We're so glad you're here. Ready to discover new flavors? Click below to explore our collection of mouth-watering recipes.</p>
//         <div className="landing-buttons">
//           <Button variant="outline-primary" className="mx-2" href="/search">Explore Recipes</Button>
//         </div>
//       </div>
//     </Container>
//   );
//   };
  
//   export default Home;


// import React, {useEffect} from 'react';
// import { Button, Container } from 'react-bootstrap';
// import './style.css';
// import { Link, useNavigate } from 'react-router-dom';

// function Home() {

//   // const username = window.sessionStorage.getItem("username");
//   // const navigate = useNavigate();

//   // useEffect(() => {
//   //   if (!isAuthenticated) {
//   //     navigate("/login");
//   //     alert("Please log in to use EasyChef!");
//   //   }
//   // }, [isAuthenticated, navigate]);

//   // const accessToken = window.sessionStorage.getItem("token");
//   const accessToken = window.sessionStorage.getItem("token");
//   const username = window.sessionStorage.getItem("username");
//   const navigate = useNavigate();

//   useEffect(() => {
//     // console.log(accessToken)
//     if (!accessToken) {
//       console.log(accessToken)
//       navigate('/login');
//       alert("Please log in to use EasyChef!")
//     }
//   }, [accessToken, navigate]);

//   return (
//     <Container fluid style={{ height: '85vh'}} className="d-flex justify-content-center align-items-center">
//       <div className="landing-content">
//         {/* First Time User */}
//         <h1>Hey {window.sessionStorage.getItem("username")}!</h1>
//         <p>We're so glad you're here. Ready to discover new flavors? Click below to explore our collection of mouth-watering recipes.</p>
//         <div className="landing-buttons">
//           <Button variant="outline-primary" className="mx-2" href="/search">Explore Recipes</Button>
//         </div>
//       </div>
//     </Container>
//   );
// }

// export default Home;