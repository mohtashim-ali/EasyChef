// import { Link, Outlet, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useMemo, useState, useEffect } from "react";
// import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col, Image, Dropdown } from 'react-bootstrap';
// import '@fortawesome/fontawesome-free/css/all.css';
// import '@fortawesome/fontawesome-free/js/all.js';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEdit, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

// const AuthenticatedLayout = () => {

//     const [showProfileOptions, setShowProfileOptions] = useState(false);

//     const handleProfileClick = () => {
//         setShowProfileOptions(!showProfileOptions);
//     }

//     return <>
//         <Navbar bg="light" expand="lg" className="px-5">
//             <Navbar.Brand className="ms-5" href="/home">EasyChef</Navbar.Brand>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
//             <Navbar.Collapse id="basic-navbar-nav">
//                 <Nav className="ml-auto">
//                     <Nav.Item className="px-3">
//                         <Nav.Link as={Link} to="/myrecipes">My Recipes</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link as={Link} to="/recipeinfo/1">Recipe Info</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link as={Link} to="/create">Create Recipe</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link as={Link} to="/shoppinglist">Shopping List</Nav.Link>
//                     </Nav.Item>
//                     {/* <Nav.Item className="px-3">
//                         <Dropdown show={showProfileOptions} onToggle={handleProfileClick}>
//                             <Dropdown.Toggle as={Nav.Link} id="dropdown-profile">
//                                 <Image src="https://via.placeholder.com/30" roundedCircle />
//                             </Dropdown.Toggle>
//                             <Dropdown.Menu>
//                                 <Dropdown.Header>{`First Name Last Name`}</Dropdown.Header>
//                                 <Dropdown.Header>{`username`}</Dropdown.Header>
//                                 <Dropdown.Header>{`email@email.com`}</Dropdown.Header>
//                                 <Dropdown.Item>{`Edit Profile`}</Dropdown.Item>
//                                 <Dropdown.Item>{`Shopping List`}</Dropdown.Item>
//                                 <Dropdown.Item>{`Log Out`}</Dropdown.Item>
//                             </Dropdown.Menu>
//                         </Dropdown>
//                     </Nav.Item> */}
//                     <Nav.Item className="px-3">
//                         <Dropdown show={showProfileOptions} onToggle={handleProfileClick}>
//                             <Dropdown.Toggle as={Nav.Link} id="dropdown-profile">
//                                 <Container className="d-flex align-items-center">
//                                     <Image src="https://via.placeholder.com/30" roundedCircle />
//                                     {/* <span className="ml-2">First Name Last Name</span> */}
//                                 </Container>
//                             </Dropdown.Toggle>
//                             <Dropdown.Menu className="p-0">
//                                 <Container className="bg-light rounded shadow-sm">
//                                     <Container className="p-3 text-center border-bottom">
//                                         <Image src="https://via.placeholder.com/100" roundedCircle />
//                                         <h5 className="my-3">First Name Last Name</h5>
//                                         <p className="text-muted">{`username`}</p>
//                                     </Container>
//                                     <Container className="p-3">
//                                         <p className="mb-2"><strong>Email:</strong> {`email@email.com`}</p>
//                                         <p className="mb-2"><strong>Location:</strong> {`New York, USA`}</p>
//                                         <hr />
//                                         <Nav.Link as={Link} to="/profile/edit" className="d-block my-3 text-center">
//                                             <FontAwesomeIcon icon={faEdit} className="me-2" />
//                                             Edit Profile
//                                         </Nav.Link>
//                                         <Nav.Link as={Link} to="/shoppinglist" className="d-block my-3 text-center">
//                                             <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
//                                             Shopping List
//                                         </Nav.Link>
//                                         <Nav.Link as={Link} to="/logout" className="d-block my-3 text-center">
//                                             <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
//                                             Log Out
//                                         </Nav.Link>
//                                     </Container>
//                                 </Container>
//                             </Dropdown.Menu>
//                         </Dropdown>
//                     </Nav.Item>
//                     {/* <Nav.Item className="px-3">
//                         <Nav.Link as={Link} to="/logout">Log Out</Nav.Link>
//                     </Nav.Item> */}
//                 </Nav>
//             </Navbar.Collapse>
//         </Navbar>

//         <Outlet />
//     </>
// }

// export default AuthenticatedLayout


import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col, Image, Dropdown } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { AiOutlinePlus } from "react-icons/ai";

import Avatar from '@mui/material/Avatar';

const AuthenticatedLayout = () => {

    const first_name = localStorage.getItem("first_name")
    const last_name = localStorage.getItem("last_name")
    const username = localStorage.getItem("username")
    const avatar = localStorage.getItem("avatar")

    const [showProfileOptions, setShowProfileOptions] = useState(false);

    const handleProfileClick = () => {
        setShowProfileOptions(!showProfileOptions);
    }

    return <>
        <Navbar bg="light" expand="lg" className="shadow-sm px-5" style={{ height: '70px' }}>
            <Navbar.Brand className="ms-5 me-5">
                <Link to="/home" style={{ color: 'inherit', textDecoration: 'none' }}>
                    <span style={{ color: 'green' }}>Easy</span>Chef
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="ms-5" id="basic-navbar-nav">
                <Nav className="me-auto">
                <Nav.Item className="px-4">
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="px-4">
                        <Nav.Link as={Link} to="/myrecipes">My Recipes</Nav.Link>
                    </Nav.Item>
                    {/* <Nav.Item className="px-4">
                        <Nav.Link as={Link} to="/create">Create Recipe</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="px-4 ms-auto">
                        <Nav.Link as={Link} to="/shoppinglist">Shopping List</Nav.Link>
                    </Nav.Item> */}
                </Nav>
                <Nav className="me-5">
                    <Nav.Item className="pt-1">
                        <Nav.Link>
                            <Link to="/create">
                                <Button variant="success">Create Recipe<FontAwesomeIcon icon={faPlus} className="ms-2" /></Button>
                            </Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="px-4 me-5 mt-2 position-relative">
                        <Dropdown menuAlign="left" show={showProfileOptions} onToggle={handleProfileClick}>
                            <Dropdown.Toggle as={Nav.Link} id="dropdown-profile" variant="link" style={{ border: 'none' }}>
                                {username}
                                {/* <Container className="text-center">
                                    <Image src="https://via.placeholder.com/30" roundedCircle />
                                </Container> */}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="p-0 me-5 mt-2 pe-5 bg-light" style={{ marginLeft: "-100px", width: 300, height: 450 }}>
                                <Container className="bg-light rounded shadow-sm" style={{ width: 300, height: 450 }}>
                                    <Container className="p-3 text-center border-bottom">
                                        <Image src={avatar} alt="Avatar" roundedCircle style={{ width: 100, height: 100 }}/>
                                        <h5 className="my-3">{first_name} {last_name}</h5>
                                        <p className="text-muted">{username}</p>
                                    </Container>
                                    <Container className="p-3">
                                        <Nav.Link as={Link} to="/profile/edit" className="d-block my-3 text-center">
                                            <FontAwesomeIcon icon={faEdit} className="me-2" />
                                            Edit Profile
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/shoppinglist" className="d-block my-3 text-center">
                                            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                                            Shopping List
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/logout" className="d-block my-3 text-center">
                                            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                            Log Out
                                        </Nav.Link>
                                    </Container>
                                </Container>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>

        <Outlet />
    </>
}

export default AuthenticatedLayout



// import { Link, Outlet, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useMemo, useState, useEffect } from "react";
// import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col } from 'react-bootstrap';

// const AuthenticatedLayout = () => {

//     const navigate = useNavigate();

//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//         const accessToken = window.sessionStorage.getItem('token');
//         if (accessToken) {
//             setIsAuthenticated(true);
//         } else {
//             console.log(accessToken)
//             navigate('/login');
//         }
//     }, [navigate]);

//     const handleLogout = () => {
//         window.sessionStorage.removeItem("token");
//         window.sessionStorage.removeItem("username");
//         navigate('/login');
//     };

//     return <>
//         <Navbar bg="light" expand="lg" className="px-5">
//             <Navbar.Brand className="ms-5" href="/home">EasyChef</Navbar.Brand>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
//             <Navbar.Collapse id="basic-navbar-nav">
//                 <Nav className="ml-auto">
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/myrecipes">My Recipes</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/recipeinfo">Recipe Info</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/create">Create Recipe</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/profile/view">My Profile</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/profile/edit">Edit Profile</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/shoppinglist">Shopping List</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
//                     </Nav.Item>
//                 </Nav>
//             </Navbar.Collapse>
//         </Navbar>

//         <Outlet isAuthenticated={isAuthenticated} />
//     </>
// }

// export default AuthenticatedLayout;



// import { Link, Outlet, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useMemo, useState, useEffect } from "react";
// import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col } from 'react-bootstrap';

// const AuthenticatedLayout = () => {

//     const navigate = useNavigate();

//     const handleLogout = () => {
//         window.sessionStorage.removeItem("token");
//         window.sessionStorage.removeItem("username");
//         navigate('/login');
//         // alert("You have been logged out")
//     };

//     return <>
//         <Navbar bg="light" expand="lg" className="px-5">
//             <Navbar.Brand className="ms-5" href="/home">EasyChef</Navbar.Brand>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
//             <Navbar.Collapse id="basic-navbar-nav">
//                 <Nav className="ml-auto">
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/myrecipes">My Recipes</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/recipeinfo">Recipe Info</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/create">Create Recipe</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/profile/view">My Profile</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/profile/edit">Edit Profile</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link href="/shoppinglist">Shopping List</Nav.Link>
//                     </Nav.Item>
//                     <Nav.Item className="px-3">
//                         <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
//                     </Nav.Item>
//                 </Nav>
//             </Navbar.Collapse>
//         </Navbar>

//         <Outlet />
//     </>
// }

// export default AuthenticatedLayout


{/* <Navbar bg="light" expand="lg" className="px-5">
<Navbar.Brand className="ms-5" href="/Home">EasyChef</Navbar.Brand>
<Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav">
    <Nav className="ml-auto">
        <Nav.Item>
            <Nav.Link href="/home"><Button variant="outline-secondary">My Recipes</Button></Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/home"><Button variant="outline-secondary">Create Recipe</Button></Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/home"><Button variant="outline-secondary">My Profile</Button></Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/home"><Button variant="outline-secondary">Shopping List</Button></Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="/home"><Button variant="outline-secondary">Log Out</Button></Nav.Link>
        </Nav.Item>
    </Nav>
</Navbar.Collapse>
</Navbar> */}
