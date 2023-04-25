import React from 'react';
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Form, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import RecipeCard from '../../components/RecipeCard';
import Carousel from 'better-react-carousel';
import { FaSearch } from 'react-icons/fa';

import SearchBar from '../../components/SearchBar';

// import './style.css'

const SearchRecipe = () => {

    // document.body.style.backgroundColor = "#E8E8E8";

    const [cards, setCards] = useState([]);
    const [page, setPage] = useState(1);
    const [moreCards, setMoreCards] = useState(true);
    const [fetchURL, setFetchURL] = useState("http://localhost:8000/recipes/all/?page=")

    const retriveRecipes = async () => {
        try {
            const response = await fetch(`${fetchURL}${page}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            const data = await response.json();
            if (page > 1) {
                setCards(prevCards => [...prevCards, ...data.results]);
            } else {
                setCards(data.results);
            }
            console.log(data.results)
            setMoreCards(data.next !== null);
        }
        catch (error){
    
        }
    }
    
    useEffect(() => {
        retriveRecipes();
    }, [fetchURL, page])


    const [diets, setDiets] = useState([]);
    const [cookingTime, setCookingTime] = useState('');
    const [searchValue, setSearchValue] = useState("")

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchValue(value);
    };

    const [cuisines, setCuisines] = useState([]);

    const handleDietChange = (e) => {
        const { value } = e.target;
        setDiets((prevDiets) => {
            if (prevDiets.includes(value)) {
                return prevDiets.filter((diet) => diet !== value);
            }
            return [...prevDiets, value];
        });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const dietsString = diets.map((diet) => `diet=${diet}`).join('&');
    //     const cuisinesString = cuisines.map((cuisine) => `cuisine=${cuisine}`).join('&');
    //     const cooking = `cooking_time=00:${cookingTime}:00`
    //     setFetchURL(`http://localhost:8000/recipes/search/?search=${searchValue}&${dietsString}&${cuisinesString}&page=`);
    //     setPage(1);
    //     setCards([]);
    //     setMoreCards(true);
    //     // retriveRecipes(); // fetches new set of cards with the updated search query parameters
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dietsString = diets.map((diet) => `diet=${diet}`).join('&');
        const cuisinesString = cuisines.map((cuisine) => `cuisine=${cuisine}`).join('&');
        const cooking = `cooking_time=${cookingTime}`;
        const newFetchURL = `http://localhost:8000/recipes/search/?search=${searchValue}&${dietsString}&${cuisinesString}&${cooking}&page=`;
        // setCards([]);
        // setMoreCards(true);
        setFetchURL(newFetchURL);
        setPage(1);
      };

    const handleCuisineChange = (e) => {
        const { value } = e.target;
        setCuisines((prevCuisine) => {
            if (prevCuisine.includes(value)) {
                return prevCuisine.filter((cuisine) => cuisine !== value);
            }
            return [...prevCuisine, value];
        });
    };

    const handleCookingTimeChange = (e) => {
        const { value } = e.target;
        setCookingTime(value);
    };

    const loadMoreCards = () => {
        setPage(prevPage => prevPage + 1);
    };

    return (
        <>
            <Container className="mt-4 text-center">
                        <Form onSubmit={handleSubmit}>
                            <InputGroup className="mb-4">
                                <FormControl
                                    type="search"
                                    placeholder="Recipe Name, Ingredient, or Creator"
                                    className="border-0 bg-light shadow"
                                    aria-describedby="button-addon1"
                                    onChange={handleSearchChange}
                                />
                                <Button variant="link" className="text-primary" type="submit" id="button-addon1">
                                    <FaSearch style={{ fontSize: "24px" }} />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Container>
            <Container fluid style={{ width: "100vw" }} className="d-flex pb-5">
                <Container className="shadow me-3" style={{ height: '100vh', width: "20vw", borderRadius: 15, background: "white" }}>
                    <h2 className="mt-4 mb-3 ms-3"> Search Filters</h2>
                    <Form className="ms-3" onSubmit={handleSubmit}>

                        <Form.Group className="mb-3 pb-3">
                            <Form.Label>Diets</Form.Label>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="vegetarian" label="Vegetarian" onChange={handleDietChange} />
                                </div>
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="vegan" label="Vegan" onChange={handleDietChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="gluten_free" label="Gluten-free" onChange={handleDietChange} />
                                </div>
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="keto" label="Keto" onChange={handleDietChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="low_carb" label="Low-carb" onChange={handleDietChange} />
                                </div>
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="paleo" label="Paleo" onChange={handleDietChange} />
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3 pb-3">
                            <Form.Label>Cuisine</Form.Label>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="italian" label="Italian" onChange={handleCuisineChange} />
                                </div>
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="american" label="American" onChange={handleCuisineChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="chinese" label="Chinese" onChange={handleCuisineChange} />
                                </div>
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="french" label="French" onChange={handleCuisineChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="indian" label="Indian" onChange={handleCuisineChange} />
                                </div>
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="japanese" label="Japanese" onChange={handleCuisineChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="korean" label="Korean" onChange={handleCuisineChange} />
                                </div>
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="mexican" label="Mexican" onChange={handleCuisineChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="middle_eastern" label="Middle Eastern" onChange={handleCuisineChange} />
                                </div>
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="thai" label="Thai" onChange={handleCuisineChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <Form.Check type="checkbox" value="vietnamese" label="Vietnamese" onChange={handleCuisineChange} />
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cooking Time (minutes)</Form.Label>
                            <Form.Control type="number" value={cookingTime} onChange={handleCookingTimeChange} />
                        </Form.Group>

                    </Form>
                </Container>
                <Container style={{ height: '100vh', width: "70vw", borderRadius: 15, background: "white" }} className="justify-content-center align-items-start shadow">
                    <Container className="d-flex justify-content-start align-items-start mx-2 mt-4">
                        <h3>
                            Search Results
                        </h3>
                    </Container>
                    {/* <Container style={{ height: "80vh", borderRadius: 15, backgroundColor: "white" }} className="d-flex flex-column justify-content-center align-items-center shadow"> */}
                    <Row className="d-flex justify-content-center align-items-center">
                        <Carousel key={fetchURL} centerMode showDots containerStyle={{ width: '1150px', height: '750px' }} className="alight-items-center ms-3 mt-1 mb-5" style={{ width: '250px', height: '200px' }} cols={3} rows={2} gap={1} loop>
                            {cards.map(card => {
                                return (
                                    <Carousel.Item id="card.id">
                                        <RecipeCard
                                            title={card.name}
                                            rating={card.ratings}
                                            servings={card.serving}
                                            time={card.cooking_time}
                                            likes={6}
                                            link={`http://localhost:3000/recipeinfo/${card.id}`}
                                            image={card.photos[0].image}

                                        />
                                    </Carousel.Item>
                                );
                            })}
                            {cards.length > 0 && moreCards ? (
                                <Carousel.Item>
                                    <Container style={{ height: "35vh" }} className="d-flex justify-content-center align-items-center">
                                        <Button onClick={loadMoreCards}>Load More</Button>
                                    </Container>
                                </Carousel.Item>

                            ) : null}

                        </Carousel>
                    </Row>
                    {/* </Container> */}
                </Container>
            </Container>
        </>
    );
}


export default SearchRecipe;