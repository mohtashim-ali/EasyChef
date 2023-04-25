import React from 'react';
import axios from "axios";
import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Table, Navbar, Nav, NavDropdown, Container, Button, Row, Col, InputGroup, FormControl, Card, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const EditProfile = () => {
    // document.body.style.backgroundColor = "#E8E8E8";

    const initState = { password1: "", password2: "", email: "-1", firstname: "-1", lastname: "-1", avatar: "", phonenumber: "A" };
    const [formValue, setFormValue] = useState(initState);
    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
        setFormErr(formErr => ({ ...formErr, [name]: '' }));
    };

    const validateForm = () => {
        let errors = {};

        if (!formValue.firstname) {
            errors.firstname = "First Name is Required"
        }

        if (!formValue.email) {
            errors.email = "Email is Required"
        }

        if (!formValue.lastname) {
            errors.lastname = "Last Name is Required"
        }

        if (!formValue.phonenumber) {
            errors.phonenumber = "Phone number is Required"
        }

        if (formValue.password1.trim()) {
            if (!formValue.password2) {
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


    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErr(errors);
        if (Object.keys(errors).length === 0) {
            const fd = new FormData();
            fd.append('_method', 'PATCH');
            if (formValue.firstname !== '-1') {
                fd.append('first_name', formValue.firstname);
            }
            if (formValue.lastname !== '-1') {
                fd.append('last_name', formValue.lastname);
            }
            if (formValue.email !== '-1') {
                fd.append('email', formValue.email);
            }
            if (formValue.phonenumber !== 'A') {
                fd.append('phone_number', formValue.phonenumber);
            }
            if (formValue.avatar !== '') {
                fd.append('avatar', formValue.avatar);
            }
            if (formValue.password1 !== '' && formValue.password2 !== '') {
                fd.append('password', formValue.password1);
                fd.append('password2', formValue.password2);
            }
            axios.patch('http://localhost:8000/accounts/edit_profile/', fd, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }).then(respond => {
                if (respond.data.access) {
                    localStorage.setItem("token", respond.data.access)
                }
                alert("Profile Saved.");
            })
                .catch(error => {
                    console.log(error.response);
                })
        }
    };

    const changeAvatar = (e) => {
        const file = e.target.files[0];
        const fd = new FormData();
        fd.append('avatar', file);
        axios.patch('http://localhost:8000/accounts/edit_profile/', fd, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }).then(respond => {
            if (respond.data.avatar) {
                localStorage.setItem("avatar", respond.data.avatar)
                const updatedUserData = {
                    ...userData,
                    avatar: respond.data.avatar
                };
                setUserData(updatedUserData);
            }


            // alert("Avatar Cha");
        })
            .catch(error => {
                console.log(error.response);
            })

    }

    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8000/accounts/profile/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setUserData(data);
                console.log(data)
                setIsLoading(false);
            })
            .catch(error => console.error(error));
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <>
            <Container style={{ height: '80vh', background: "white", borderRadius: 15, overflowY: "scroll" }} className="justify-content-center align-items-start my-5 px-5 shadow">
                <Row className="pt-5">
                    <Col className="ms-2">
                        <h1>Edit Profile</h1>
                    </Col>
                    {/* <Col className="d-flex justify-content-end">
                        <Button type="button" variant="primary" className="align-self-end mb-5 me-3 mt-1">Back</Button>
                    </Col> */}
                </Row>
                <hr />
                <div>
                    <Container fluid className="mt-2">
                        <Row>
                            <Col xl={4}>
                                <Card className="mb-4 mb-xl-0">
                                    <Card.Header>Avatar</Card.Header>
                                    <Card.Body className="text-center">
                                        <img style={{ width: "300px", height: "280px" }}
                                            className="img-account-profile rounded-circle mb-2"
                                            src={userData.avatar}
                                            alt="No avatar set"
                                        />
                                        <div className="small font-italic text-muted mb-4">
                                            JPG or PNG no larger than 5 MB
                                        </div>
                                        <Button variant="primary" onClick={() => document.querySelector('input[type="file"]').click()}>
                                            Change Avatar
                                            <input hidden accept="image/*" type="file" onChange={changeAvatar} />
                                        </Button>
                                        {/* <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={handleFileSelect}
                                        /> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={8}>
                                <Card className="mb-4">
                                    <Card.Header>Account Details</Card.Header>
                                    <Card.Body>
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small mb-1" htmlFor="username">
                                                    Username
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    placeholder="Enter your username"
                                                    defaultValue={userData.username}
                                                    disabled
                                                />
                                            </Form.Group>
                                            <Row className="gx-3 mb-3">
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="small mb-1" htmlFor="firstname">
                                                            First name
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            className="form-control"
                                                            id="firstname"
                                                            placeholder="Enter your first name"
                                                            defaultValue={userData.first_name}
                                                            name="firstname"
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Text style={{ color: 'red' }}>
                                                            {formErr.firstname}
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="small mb-1" htmlFor="lastname">
                                                            Last name
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            className="form-control"
                                                            id="lastname"
                                                            name="lastname"
                                                            placeholder="Enter your last name"
                                                            defaultValue={userData.last_name}
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Text style={{ color: 'red' }}>
                                                            {formErr.lastname}
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row className="gx-3 mb-3">
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="small mb-1" htmlFor="email">
                                                            Email address
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            name="email"
                                                            placeholder="Enter your email address"
                                                            defaultValue={userData.email}
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Text style={{ color: 'red' }}>
                                                            {formErr.email}
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="small mb-1" htmlFor="phonenumber">
                                                            Phone number
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="tel"
                                                            className="form-control"
                                                            id="phonenumber"
                                                            name="phonenumber"
                                                            placeholder="Enter your phone number"
                                                            defaultValue={userData.phone_number}
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Text style={{ color: 'red' }}>
                                                            {formErr.phonenumber}
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small mb-1" htmlFor="password1">
                                                    Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    className="form-control"
                                                    id="password1"
                                                    name="password1"
                                                    placeholder="***********"
                                                    onChange={handleChange}
                                                />
                                                <Form.Text style={{ color: 'red' }}>
                                                    {formErr.password1}
                                                </Form.Text>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small mb-1" htmlFor="password2">
                                                    Confirm Password
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    className="form-control"
                                                    id="password2"
                                                    name="password2"
                                                    placeholder="***********"
                                                    onChange={handleChange}
                                                />
                                                <Form.Text style={{ color: 'red' }}>
                                                    {formErr.password2}
                                                </Form.Text>
                                            </Form.Group>
                                            <Button variant="primary" type="submit">
                                                Save Changes
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Container>
        </>
    );

}


export default EditProfile;