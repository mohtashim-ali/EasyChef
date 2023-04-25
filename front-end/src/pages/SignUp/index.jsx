import React from 'react';
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './style.css'

const SignUp = () => {
    const initState = { username: "", password1: "", password2: "", email: "", firstname: "", lastname: "", avatar: "", phonenumber: "" };
    const [formValue, setFormValue] = useState(initState);
    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
        setFormErr(formErr => ({ ...formErr, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErr(errors);
        if (Object.keys(errors).length === 0) {
                        axios.post('http://localhost:8000/accounts/register/', {                    
                username:formValue.username,
                password:formValue.password1,
                password2:formValue.password2,
                email:formValue.email,
                first_name:formValue.firstname,
                last_name:formValue.lastname,
                phone_number: formValue.phonenumber
            })
                .then(response => {
                    if (response.status === 201){
                        alert("Register Success.");
                        navigate('/login');
                    }
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status === 400){
                        alert("Register Failed: Check Error Messages.");
                        if (error.response.data.username){
                            setFormErr(formErr => ({ ...formErr, username: error.response.data.username[0] }));
                        }
                        if (error.response.data.email) {
                            setFormErr(formErr => ({ ...formErr, email: error.response.data.email[0] }));
                        }
                        console.log(error.response.data)
                    }
                })
        }
    };

    const validateForm = () => {
        let errors = {};

        if (formValue.phonenumber.trim()){
            if (!phoneRegex.test(formValue.phonenumber.trim())){
                errors.phonenumber = "Enter a valid phone number"
            }
        }

        if (!formValue.firstname.trim()) {
            errors.firstname = "First Name is Required"
        }

        if (!formValue.email.trim()) {
            errors.email = "Email is Required"
        }
        else{
            if (!emailRegex.test(formValue.email.trim())){
                errors.email = "Email is Invalid"
            }
        }

        if (!formValue.lastname.trim()) {
            errors.lastname = "Last Name is Required"
        }

        if (!formValue.username.trim()) {
            errors.username = "Username is required";
        }
        else {
            if (formValue.username.trim().length < 6) {
                errors.username = "Username must contain at least 6 characters";
            }
        }
        if (!formValue.password1.trim()) {
            errors.password1 = "Password is required";
        }
        else {
            if (formValue.password1.trim().length < 8) {
                errors.password1 = "Password must contain at least 8 characters";
            }
        }

        if (formValue.password1.trim()) {
            if (!formValue.password2.trim()) {
                errors.password2 = "Repeat password is required"
            }
            else {
                if (formValue.password2.trim() !== formValue.password1.trim()) {
                    errors.password2 = "Passwords do not match"
                }
            }
        }

        return errors;
    };



    return (
        <>
            <Container style={{ height: '80vh', borderRadius: 15 }} className="shadow justify-content-center align-items-start">
                <Container className="d-flex justify-content-start align-items-start ms-2 mt-5 pt-5">
                    <h1>
                        Sign Up
                    </h1>
                </Container>
                <Container>
                    <Form className="signupform container mt-1 pt-3 justify-content-center align-items-center mt-3 mb-3" onSubmit={handleSubmit}>
                        <Col>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter first name" name="firstname" onChange={handleChange} />
                                        <Form.Text style={{ color: 'red' }}>
                                            {formErr.firstname}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicLastName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter last name" name="lastname" onChange={handleChange} />
                                        <Form.Text style={{ color: 'red' }}>
                                            {formErr.lastname}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Enter username" name="username" onChange={handleChange} />
                                        <Form.Text style={{ color: 'red' }}>
                                            {formErr.username}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} />
                                        <Form.Text style={{ color: 'red' }}>
                                            {formErr.email}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" name="password1" onChange={handleChange} />
                                        <Form.Text style={{ color: 'red' }}>
                                            {formErr.password1}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
                                        <Form.Label>Repeat Password</Form.Label>
                                        <Form.Control type="password" placeholder="Repeat password" name="password2" onChange={handleChange} />
                                        <Form.Text style={{ color: 'red' }}>
                                            {formErr.password2}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/* <Form.Group className="mb-3" controlId="formBasicAvatar">
                                <Form.Label>Avatar</Form.Label>
                                <Form.Control type="file" />
                            </Form.Group> */}
                            <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="tel" placeholder="xxx-xxx-xxxx" name="phonenumber" onChange={handleChange} />
                                <Form.Text style={{ color: 'red' }}>
                                    {formErr.phonenumber}
                                </Form.Text>
                            </Form.Group>
                            <Container className="d-flex mt-5 justify-content-center align-items-center">
                                <Button variant="success" type="submit" formNoValidate>
                                    Sign Up
                                </Button>
                            </Container>
                        </Col>
                    </Form>
                </Container>
            </Container>
        </>
    );
}


export default SignUp;

// return (
//     <Container fluid className="d-flex justify-content-center align-items-center mt-5">
//         <Form>
//             <Form.Group className="mb-3" controlId="formBasicUsername">
//                 <Form.Label>Username</Form.Label>
//                 <Form.Control type="text" placeholder="Enter username" />
//                 {/* <Form.Text className="text-muted">
//                     We'll never share your email with anyone else.
//                 </Form.Text> */}
//             </Form.Group>
//         </Form>
//     </Container>
// );

{/* <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter first name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control type="password" placeholder="Repeat password" />
                </Form.Group> */}