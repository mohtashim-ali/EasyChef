import React from 'react';
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
// import './style.css'

const LogIn = () => {
    const initState = { username: "", password: "" };
    const [formValue, setFormValue] = useState(initState);
    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [user, setUser] = useState({ token: "" }); 
    const navigate = useNavigate();

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
            axios.post("http://localhost:8000/accounts/login/", {username: formValue.username, password: formValue.password})
            .then(response => {
                setUser({token: response.data.access})
                localStorage.setItem("token", response.data.access)
                axios.get("http://localhost:8000/accounts/profile/",{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                .then(respond => {
                    localStorage.setItem("username", respond.data.username);
                    localStorage.setItem("userid", respond.data.id);
                    localStorage.setItem("first_name", respond.data.first_name);
                    localStorage.setItem("last_name", respond.data.last_name);
                    localStorage.setItem("avatar", respond.data.avatar);
                    navigate("/home")
                })
                .catch((error) => {
                    if (error.response.status === 401){
                        navigate('/login');
                        alert('Login Failed');
                    }
                });
            })
            .catch(error => {
                if (error.response.data.detail){
                    setFormErr(formErr => ({ ...formErr, all: "Username or password is incorrect"}));
                }
            })
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!formValue.username.trim()) {
            errors.username = "Username is required";
        }
        if (!formValue.password.trim()) {
            errors.password = "Password is required";
        }
        return errors;
    };



    return (
        <>
            <Container style={{ height: '50vh', width: "50vw", borderRadius: 15 }} className="shadow mt-5 d-flex justify-content-center align-items-center">
                <Container>
                <Container className="d-flex justify-content-start align-items-start">
                    <h1 className="mt-5">
                        Log In
                    </h1>
                </Container>
                <Container>
                    <Form className="signupform container mt-1 pt-5 justify-content-center align-items-center mt-3 mb-3" onSubmit={handleSubmit}>
                        <Col>
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
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} />
                                        <Form.Text style={{ color: 'red' }}>
                                            {formErr.password}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Text style={{ color: 'red' }}>
                                            {formErr.all}
                            </Form.Text>
                            <Container className="d-flex mt-5 justify-content-center align-items-center">
                                <Button variant="success" type="submit">
                                    Log In
                                </Button>
                            </Container>
                        </Col>
                    </Form>
                </Container>
                </Container>
            </Container>
        </>
    );
}


export default LogIn;