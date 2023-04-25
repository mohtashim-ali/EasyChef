import React from 'react';
import axios from "axios";
import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Table, Navbar, Nav, NavDropdown, Container, Button, Row, Col, InputGroup, Card, FormControl, FormGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
// import { Ingredient, Step } from './model';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import './style.css'
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FileUploader } from "react-drag-drop-files";
// import { useHistory } from 'react-router-dom';
// import { render } from "react-dom";
import Carousel from 'better-react-carousel';
import { FaSearch, FaFilter } from 'react-icons/fa';
import FilterListIcon from '@mui/icons-material/FilterList';
import Pagination from '@mui/material/Pagination';

import { MdOutlinePermMedia } from "react-icons/md";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CardContent from '@mui/joy/CardContent';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import SearchBar from '../SearchBar';
// import ReactStars from "react-rating-stars-component";

// import Rating from '../RatingStars';

import Rating from '@mui/material/Rating';

import { AiFillHeart, AiOutlineClockCircle } from "react-icons/ai"

import { FaUtensils } from "react-icons/fa"

import RecipeCard from '../RecipeCard';

// import Carousel from 'react-bootstrap/Carousel'

import { Step } from './models.js'

import { Button as Button2 } from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';




const WelcomeForm = ({ onNext, setPage }) => {

    // document.body.style.backgroundColor = "#E8E8E8";

    const handleNextBase = () => {
        setPage(1);
    }

    const handleNext = () => {
        setPage(2);
    }


    return (
        <>
            <div className="d-flex" style={{
                justifyContent: "center",
                alignItems: "center",
                height: "90vh"
            }}>
                <Container style={{ height: '30vh', width: "45vw", background: "white", borderRadius: 15 }} className="d-flex justify-content-center align-items-center my-5 px-5 shadow">
                    <div className="landing-content">
                        <h1>Create New Recipe!</h1>
                        <p>Would you like to create a recipe from scratch, or use an existing recipe as a base?</p>
                        <div className="landing-buttons">
                            <Button variant="primary" onClick={handleNext} className="me-2" >Scratch</Button>{' '}
                            <Button variant="outline-primary" onClick={handleNextBase} className="ms-2" >Base</Button>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );

}

const BaseRecipeSearch = ({ onNext, onPrev, setPage, setSearchPage,
    handleSearchSubmit,
    handleSearchChange,
    handleCuisineChange,
    handleCookingTimeChange,
    handleDietChange, cookingTime, cards, setCards, fetchURL, moreCards, loadMoreCards,
    selectedCard, setSelectedCard, base, setBase, setSteps, setIngredients, setSelectedCuisine,
    setSelectedDiets, setStepsPreviews, setImageFiles, setVideoFiles, setImagePreviewUrls, setVideoPreviews, setFormValue,
    setCookingTime }) => {

    const handleNext = () => {
        if (selectedCard) {
            console.log(selectedCard)
            console.log(base)
            const baserecipe = {
                "name": base.name,
                "cuisine": "",
                "diet": [],
                "servings": base.serving,
                "prep_time_hours": 0,
                "prep_time_min": base.prep_time,
                "cooking_time_hours": 0,
                "cooking_time_min": base.cooking_time,
                "description": base.description,
                "ingredients": "",
                "steps": []
            };
            setFormValue(baserecipe)
            setSelectedCuisine({ label: base.cuisine.charAt(0).toUpperCase() + base.cuisine.slice(1), value: base.cuisine })
            const diets = base.diet.map((diet) => ({
                label: diet.diet.charAt(0).toUpperCase() + diet.diet.slice(1),
                value: diet.diet,
            }));
            setSelectedDiets(diets)
            const ingredient = base.ingredients.map((ing) => ({
                name: ing.ingredient.ingredient_name,
                quantity: ing.quantity
            }))
            setIngredients(ingredient)

            const stepdPromises = base.step.map(async (stp) => {
                const photoBlobs = await Promise.all(stp.photos.map(async (photo) => {
                    const response = await fetch("http://127.0.0.1:8000/" + photo.photo);
                    const blob = await response.blob();
                    return blob;
                }));

                const videoBlobs = await Promise.all(stp.videos.map(async (video) => {
                    const response = await fetch("http://127.0.0.1:8000/" + video.video);
                    const blob = await response.blob();
                    return blob;
                }));

                return {
                    stepNumber: stp.order,
                    description: stp.description,
                    photos: photoBlobs,
                    videos: videoBlobs
                };
            });

            Promise.all(stepdPromises).then((stepd) => {
                console.log(stepd)
                setSteps(stepd);

                const stepPreviews = stepd.map((step) => {
                    const imagePreviews = step.photos.map((blob) => URL.createObjectURL(blob));
                    const videoPreviews = step.videos.map((blob) => URL.createObjectURL(blob));
                    return {
                        stepNumber: step.stepNumber,
                        photos: imagePreviews,
                        videos: videoPreviews,
                    };
                });

                setStepsPreviews(stepPreviews);
            });

            // const recipephotos = base.photos.map((pht) => ({
            //     id: pht.id, photo: pht.image
            // }))
            // setImageFiles(recipephotos)
            // // console.log(recipeData.videos)
            // const recipevideos = base.videos.map((video) => ({
            //     id: video.id, video: video.video
            // }))
            // setVideoFiles(recipevideos)

            // const grabImages = () => {

            //     const imageFiles = await Promise.all(recipephotos.map(async (photo) => {
            //         const response = await fetch("http://127.0.0.1:8000/" + photo.photo);
            //         const blob = await response.blob();
            //         return {
            //             id: photo.id,
            //             file: blob
            //         };
            //     }));

            //     const videoFiles = await Promise.all(recipevideos.map(async (video) => {
            //         const response = await fetch("http://127.0.0.1:8000/" + video.video);
            //         const blob = await response.blob();
            //         return {
            //             id: video.id,
            //             file: blob
            //         };
            //     }));

            //     setImageFiles(imageFiles);
            //     setVideoFiles(videoFiles);

            // }

            // const grabImages = async () => {
            //     const imageFiles = await Promise.all(base.photos.map(async (photo) => {
            //       const response = await fetch("http://127.0.0.1:8000/" + photo.photo);
            //       const blob = await response.blob();
            //       return {
            //         id: photo.id,
            //         file: blob
            //       };
            //     }));

            //     const videoFiles = await Promise.all(base.videos.map(async (video) => {
            //       const response = await fetch("http://127.0.0.1:8000/" + video.video);
            //       const blob = await response.blob();
            //       return {
            //         id: video.id,
            //         file: blob
            //       };
            //     }));

            //     setImageFiles(imageFiles);
            //     setVideoFiles(videoFiles);
            //     console.log(imageFiles)
            //     console.log(videoFiles)
            //   }


            // const imagePreviews = recipephotos.map((file) => URL.createObjectURL(file));
            // const videoPreviewUrls = recipevideos.map((file) => URL.createObjectURL(file));

            // // Update state with the preview URLs
            // setImagePreviewUrls([...imagePreviewUrls, ...imagePreviews]);
            // setVideoPreviews([...videoPreviews, ...videoPreviewUrls]);
            setPage(2)
        }
        else {
            alert("Select a base recipe!")
        }
    }

    const handlePrev = () => {
        setFormValue({
            "name": "",
            "cuisine": "",
            "diet": [],
            "servings": "",
            "prep_time_hours": 0,
            "prep_time_min": "",
            "cooking_time_hours": 0,
            "cooking_time_min": "",
            "description": "",
            "ingredients": "",
            "steps": [],
            "images": []
        })
        // setCookingTime('')
        setSelectedCuisine(null)
        setSelectedDiets([])
        setSteps({})
        setImageFiles([])
        setImagePreviewUrls([])
        setVideoFiles([])
        setVideoPreviews([])
        // setIngredients({})
        setStepsPreviews({})
        setBase(null)
        setSelectedCard(null)
        setPage(0)
    }

    const [isOpen, setIsOpen] = useState(false);

    const handleFilterClose = () => {
        setIsOpen(false);
    };

    // document.body.style.backgroundColor = "#E8E8E8";

    const handleCardClick = (card) => {
        setSelectedCard(card.id);
        setBase(card)
        // setPage(2)
    };

    return (
        <>
            <Container style={{ height: '80vh', background: "white", borderRadius: 15 }} className="justify-content-center align-items-start my-5 px-5 py-1 shadow">
                <Row className="mt-5">
                    <Col>
                        {/* <IconButton onClick={handlePrev}>
                            <ArrowBackIcon/>
                        </IconButton> */}
                        {/* <div style={{ display: "inline-flex", alignItems: "center" }}>
                            <span style={{ marginLeft: "5px" }}>Next</span>
                            <IconButton onClick={handleNext}>
                                <ArrowForwardIcon />
                            </IconButton>
                        </div> */}
                        <Button variant="outline-primary" onClick={handlePrev}><ArrowBackIcon className="mb-1 me-1" style={{ fontSize: '18px' }} />Back</Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        {/* <IconButton onClick={handleNext}>
                            <ArrowForwardIcon />
                        </IconButton> */}
                        <Button variant="outline-primary" onClick={handleNext}>Next <ArrowForwardIcon className="mb-1" style={{ fontSize: '18px' }} /></Button>
                    </Col>
                </Row>
                <hr />
                <Row className="mt-2">
                    <Col>
                        <h1>Base Recipe</h1>
                        <p>Search and select a recipe to use as a base!</p>
                    </Col>
                    <Container className="mt-2 text-center">
                        <Form onSubmit={handleSearchSubmit}>
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

                </Row>
                <Container className="d-flex justify-content-center">
                    <Carousel key={fetchURL} showDots containerStyle={{ width: '1250px', height: '380px' }} cols={4} rows={1} gap={5} loop>
                        {cards.map(card => {
                            return (
                                <Carousel.Item>
                                    <div onClick={() => handleCardClick({ ...card })} style={{
                                        border: selectedCard === card.id ? "2px solid green" : "none",
                                    }}>
                                        <RecipeCard
                                            title={card.name}
                                            rating={card.ratings}
                                            servings={card.serving}
                                            time={card.cooking_time}
                                            likes={6}
                                            image={card.photos[0].image}
                                            onClick={() => handleCardClick(card)}
                                            style={{ boxShadow: selectedCard === card.id ? "0px 0px 5px 3px green" : "none" }}
                                        // link={`http://localhost:3000/recipeinfo/${card.id}`}

                                        />
                                    </div>
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
                </Container>
            </Container>
        </>
    );

}

const RecipeBasicInfo = ({ onNext, onPrev, formValue, setFormValue, selectedCuisine, setSelectedCuisine,
    setSelectedDiets, selectedDiets, setImageFiles, setVideoFiles, setVideoPreviews, setImagePreviewUrls,
    imagePreviewUrls, imageFiles, videoFiles, videoPreviews, setPage, base }) => {

    // document.body.style.backgroundColor = "#E8E8E8";

    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [ingredientOptions, setIngredientOptions] = useState(null);

    // const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

    // const [stepPhotos, setStepPhotos] = useState([]);
    // const [stepVideos, setStepVideos] = useState([]);

    // const [videoFiles, setVideoFiles] = useState([]);
    // const [imageFiles, setImageFiles] = useState([]);
    // const [videoPreviews, setVideoPreviews] = useState([]);
    const fileTypes = ["JPG", "PNG", "GIF"];

    // const [file, setFile] = useState(null);
    // const handleUploadChange = (file) => {
    //     setFile(file);
    // };

    // const handleVideoChange = (event) => {
    //     const selectedVideos = Array.from(event.target.files);
    //     setVideoFiles(selectedVideos);

    //     const videoPreviewUrls = selectedVideos.map((video) => URL.createObjectURL(video));
    //     setVideoPreviews(videoPreviewUrls);
    // };

    // const handleVideoRemove = (index) => {
    //     const newVideoFiles = [...videoFiles];
    //     newVideoFiles.splice(index, 1);
    //     setVideoFiles(newVideoFiles);

    //     const newVideoPreviews = [...videoPreviews];
    //     newVideoPreviews.splice(index, 1);
    //     setVideoPreviews(newVideoPreviews);
    // };

    // const renderVideoPreviews = () => {
    //     if (videoPreviews.length > 0) {
    //         return (
    //             <div className="d-flex flex-wrap">
    //                 {videoPreviews.map((previewUrl, index) => (
    //                     <div key={index} className="d-flex flex-column align-items-center m-2">
    //                         <video src={previewUrl} alt={`Video ${index}`} controls width="200" height="200" />
    //                         <button type="button" className="btn btn-danger mt-2" onClick={() => handleVideoRemove(index)}>
    //                             Remove
    //                         </button>
    //                     </div>
    //                 ))}
    //             </div>
    //         );
    //     }
    //     return null;
    // };

    const deleteImage = (index) => {
        const newImageFiles = [...imageFiles];
        newImageFiles.splice(index, 1);
        setImageFiles(newImageFiles);

        const newImagePreviewUrls = [...imagePreviewUrls];
        newImagePreviewUrls.splice(index, 1);
        setImagePreviewUrls(newImagePreviewUrls);
    };

    const deleteVideo = (index) => {
        const newVideoFiles = [...videoFiles];
        newVideoFiles.splice(index, 1);
        setVideoFiles(newVideoFiles);

        const newVideoPreviewUrls = [...videoPreviews];
        newVideoPreviewUrls.splice(index, 1);
        setVideoPreviews(newVideoPreviewUrls);
    };

    const validateForm = () => {
        let errors = {};
        if (!formValue.name.trim()) {
            errors.name = "Title is required";
        }
        // if (!formValue.cuisine.trim()) {
        //     errors.cuisine = "Cuisine is required";
        // }

        if (!formValue.servings) {
            errors.servings = "Servings is required";
        }
        if (!formValue.description.trim()) {
            errors.description = "Description is required";
        }
        if (!formValue.cooking_time_hours && !formValue.cooking_time_min) {
            errors.cooking_time_hours = "Cooking Time is required";
        }
        if (!formValue.prep_time_hours && !formValue.prep_time_min) {
            errors.prep_time_hours = "Prep Time is required";
        }

        if (imageFiles.length < 1) {
            errors.images = "At least 1 image is required"
        }

        console.log(selectedCuisine)

        if (selectedCuisine === null) {
            errors.cuisine = "Cuisine is required"
        }
        // if (ingredients.length < 1){
        //     errors.ingredients = "At least 1 ingredient is required"
        // }
        // if (document.querySelectorAll("#ingredients-list tbody tr").length < 1) {
        //     errors.ingredients = "At least 1 ingredient must be added"
        // }
        // if (ingredients.length < 1) {
        //     errors.ingredients = "At least 1 ingredient must be added"
        // }

        // if (steps.length < 1){
        //     errors.steps = "At least 1 step is required"
        // }
        // if (steps.length < 1) {
        //     errors.steps = "At least 1 step must be added"
        // }
        return errors;
    };




    // const handleImageChange = (event) => {
    //     const files = Array.from(event.target.files);
    //     setImageFiles(prevImageFiles => [...prevImageFiles, ...files]);
    //     const urls = files.map((file) => URL.createObjectURL(file));
    //     setImagePreviewUrls(urls);
    // };

    // useEffect(() => {
    //     return () => {
    //         // Revoke the URLs when the component is unmounted to avoid memory leaks.
    //         imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    //     };
    // }, [imagePreviewUrls]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
        // setFormErr(formErr => ({ ...formErr, [name]: '' }));
    };

    const handleFileUpload = (event) => {
        const selectedFiles = Array.from(event.target.files);

        console.log(selectedFiles)


        const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];
        // Filter the selected files by type
        const selectedImages = selectedFiles.filter((file) =>
            fileTypes.includes(file.type.split("/")[1].toUpperCase())
        );

        console.log(selectedImages);

        const selectedVideos = selectedFiles.filter(
            (file) => file.type.split("/")[0] === "video"
        );

        // Update state with the selected files
        setImageFiles([...imageFiles, ...selectedImages]);
        setVideoFiles([...videoFiles, ...selectedVideos]);

        // Create preview URLs for the selected files
        const imagePreviews = selectedImages.map((file) => URL.createObjectURL(file));
        const videoPreviewUrls = selectedVideos.map((file) => URL.createObjectURL(file));

        // Update state with the preview URLs
        setImagePreviewUrls([...imagePreviewUrls, ...imagePreviews]);
        setVideoPreviews([...videoPreviews, ...videoPreviewUrls]);
    };

    // const [selectedValue, setSelectedValue] = useState('N/A');

    // const handleSelectChange = (event) => {
    //     setSelectedValue(event.target.value);
    // };


    // const [selectedCuisine, setSelectedCuisine] = useState(null);
    // const [selectedDiets, setSelectedDiets] = useState([]);

    const cuisineOptions = [
        { value: 'italian', label: 'Italian' },
        { value: 'mexican', label: 'Mexican' },
        { value: 'chinese', label: 'Chinese' },
        { value: 'indian', label: 'Indian' },
        { value: 'french', label: 'French' },
        { value: 'korean', label: 'Korean' },
        { value: 'american', label: 'American' },
        { value: 'japanese', label: 'Japanese' },
        { value: 'middle_eastern', label: 'Middle Eastern' },
        { value: 'thai', label: 'Thai' },
        { value: 'vietnamese', label: 'Vietnamese' }
        // add more cuisine options as needed
    ];

    const dietOptions = [
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'keto', label: 'Keto' },
        { value: 'low-carb', label: 'Low-carb' },
        { value: 'gluten-free', label: 'Gluten-free' },
        { value: 'paleo', label: 'Paleo' },
        // add more diet options as needed
    ];

    const handleNext = () => {
        const errors = validateForm();
        setFormErr(errors);
        console.log(errors)
        if (Object.keys(errors).length === 0) {
            setPage(3)
        }
    }

    const handlePrev = () => {
        if (base) {
            setPage(1)
        }
        else {
            // setFormValue({
            //     "name": "",
            //     "cuisine": "",
            //     "diet": [],
            //     "servings": "",
            //     "prep_time_hours": 0,
            //     "prep_time_min": "",
            //     "cooking_time_hours": 0,
            //     "cooking_time_min": "",
            //     "description": "",
            //     "ingredients": "",
            //     "steps": [],
            //     "images": []
            // })
            // setCookingTime('')
            // setSelectedCuisine([])
            // setSelectedDiets({})
            // setSteps({})
            // setImageFiles([])
            // setImagePreviewUrls([])
            // setVideoFiles([])
            // setVideoPreviews([])
            // setIngredients({})
            // setStepsPreviews({})
            setPage(0)
        }
    }

    return (
        <>
            <Container style={{ height: '80vh', background: "white", borderRadius: 15, overflowY: "scroll" }} className="justify-content-center align-items-start my-5 px-5 py-1 shadow">
                <Row className="mt-5">
                    <Col>
                        <Button variant="outline-primary" onClick={handlePrev}><ArrowBackIcon className="mb-1 me-1" style={{ fontSize: '18px' }} />Back</Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="outline-primary" onClick={handleNext}>Next <ArrowForwardIcon className="mb-1" style={{ fontSize: '18px' }} /></Button>
                    </Col>
                </Row>
                <hr />
                <Row className="mt-1">
                    <Col>
                        <h1>Recipe Details</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Fill out recipe details below!</p>
                    </Col>
                </Row>
                <Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: 500, fontSize: "18px" }} htmlFor="recipeName">Title</Form.Label>
                                <Form.Control type="text" id="recipeName" name="name" value={formValue.name} onChange={handleChange} placeholder="Enter title" />
                                <Form.Text style={{ color: 'red' }}>
                                    {formErr.name}
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: 500, fontSize: "18px" }} htmlFor="cuisine">Cuisine</Form.Label>
                                <Select
                                    name="cuisine"
                                    value={selectedCuisine}
                                    onChange={setSelectedCuisine}
                                    options={cuisineOptions}
                                    placeholder="Select cuisine..."
                                />
                                <Form.Text style={{ color: 'red' }}>
                                    {formErr.cuisine}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: 500, fontSize: "18px" }} htmlFor="diets">Diets</Form.Label>
                                <Select
                                    name="diets"
                                    value={selectedDiets}
                                    onChange={setSelectedDiets}
                                    options={dietOptions}
                                    isMulti
                                    placeholder="Select diets..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: 500, fontSize: "18px" }} htmlFor="servings">Number of Servings</Form.Label>
                                <Form.Control type="number" id="servings" name="servings" value={formValue.servings} placeholder="Number of Servings" onChange={handleChange} />
                                <Form.Text style={{ color: 'red' }}>
                                    {formErr.servings}
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: 500, fontSize: "18px" }} htmlFor="cookingTime">Cooking Time</Form.Label>
                                <InputGroup id="cookingTime">
                                    {/* <Form.Control type="number" placeholder="Hours" name="cooking_time_hours" aria-label="Hours" onChange={handleChange} />
                                        <InputGroup.Text>Hour(s)</InputGroup.Text> */}
                                    <Form.Control type="number" placeholder="Minutes" name="cooking_time_min" aria-label="Minutes" value={formValue.cooking_time_min} onChange={handleChange} />
                                    <InputGroup.Text>Minute(s)</InputGroup.Text>

                                </InputGroup>
                                <Form.Text style={{ color: 'red' }}>
                                    {formErr.cooking_time_hours}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ fontWeight: 500, fontSize: "18px" }} htmlFor="cookingTime">Prep Time</Form.Label>
                                <InputGroup id="prepTime">
                                    {/* <Form.Control type="number" placeholder="Hours" name="prep_time_hours" aria-label="Hours" onChange={handleChange} />
                                        <InputGroup.Text>Hour(s)</InputGroup.Text> */}
                                    <Form.Control type="number" placeholder="Minutes" name="prep_time_min" aria-label="Minutes" value={formValue.prep_time_min} onChange={handleChange} />
                                    <InputGroup.Text>Minute(s)</InputGroup.Text>
                                </InputGroup>
                                <Form.Text style={{ color: 'red' }}>
                                    {formErr.prep_time_hours}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="me-2 mb-3">
                        <Form.Label style={{ fontWeight: 500, fontSize: "18px" }} htmlFor="description">Description</Form.Label>
                        <Form.Control as="textarea" placeholder="Description of Dish" id="description" value={formValue.description} name="description" rows={3} onChange={handleChange} />
                        <Form.Text style={{ color: 'red' }}>
                            {formErr.description}
                        </Form.Text>
                    </Form.Group>
                    <Row>
                        <h5>Images & Videos</h5>
                        {imagePreviewUrls.length > 0 || videoPreviews.length > 0 ? (
                            < Carousel centerMode containerStyle={{ maxWidth: '1200px', maxHeight: '200px' }} className="alight-items-center" style={{ width: '250px', height: '200px' }} gap={10} cols={3} loop>

                                {imagePreviewUrls.map((photo, index) => (
                                    <Carousel.Item>
                                        <Card component="li" sx={{ minWidth: 600, minHeight: 200 }}>
                                            <CardContent sx={{ background: "black" }}>
                                                <IconButton
                                                    sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
                                                    onClick={() => deleteImage(index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <img
                                                    src={photo}
                                                    // srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2"
                                                    loading="lazy"
                                                    alt=""
                                                    style={{ objectFit: 'contain', maxWidth: '600px', maxHeight: '180px' }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Carousel.Item>
                                ))}
                                {videoPreviews.map((video, index) => (
                                    <Carousel.Item>
                                        <Card className="text-center" sx={{ minWidth: 600, minHeight: 200 }}>
                                            <CardContent style={{ background: "black" }}>
                                                <IconButton
                                                    sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
                                                    onClick={() => deleteVideo(index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <video style={{ objectFit: 'contain', maxWidth: '600px', maxHeight: '180px' }} controls>
                                                    <source src={video} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </CardContent>
                                        </Card>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (<h6 className="text-muted">No images or videos to display.</h6>)}
                        <Form.Text style={{ color: 'red' }}>
                            {formErr.images}
                        </Form.Text>
                        <div className="text-center mt-3 mb-4">
                            <Button variant="primary" onClick={() => document.querySelector('input[type="file"]').click()}>
                                Upload <MdOutlinePermMedia className="mb-1 ms-1" />
                                <input hidden accept="image/*,video/*" multiple type="file" onChange={handleFileUpload} />
                            </Button>
                        </div>
                    </Row>
                </Row>
            </Container>
        </>
    );

}

const RecipeIngredients = ({ onNext, onPrev, ingredients, setIngredients,
    ingredient,
    renderIngredients,
    deleteIngredient,
    NewIngredient, setPage }) => {

    const handleNext = () => {
        if (ingredients.length === 0) {
            alert("Please add at least 1 ingredient")
        }
        let valid = true;
        ingredients.forEach((ingredient) => {
            if (!ingredient.name || !ingredient.quantity || isNaN(parseInt(ingredient.quantity))) {
                valid = false;
            }
        });
        if (valid) {
            setPage(4)
        } else {
            alert("Please check all error messages")
        }
    }

    const handlePrev = () => {
        setPage(2)
    }

    // document.body.style.backgroundColor = "#E8E8E8";

    // class Ingredient {
    //     constructor(name, quantity) {
    //         this.name = name;
    //         this.quantity = quantity;
    //     }
    // }

    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [ingredientOptions, setIngredientOptions] = useState(null);

    // Fetch ingredient options from API
    // const fetchIngredients = async (inputValue) => {
    //     const response = await fetch(`http://localhost:8000/recipes/search/ingredient/?search=${inputValue}`);
    //     const data = await response.json();
    //     console.log(data)
    //     const options = data.map((ingredient) => ({
    //         value: ingredient.id,
    //         label: ingredient.name
    //     }));
    //     setIngredientOptions(options);
    // };

    // const fetchIngredients = async (inputValue) => {
    //     const response = await fetch(`http://localhost:8000/recipes/search/ingredient/?search=${inputValue}`);
    //     const data = await response.json();
    //     console.log(data.results);
    //     const options = data.results.map((ingredient) => ({
    //       value: ingredient.ingredient_name,
    //       label: ingredient.ingredient_name
    //     }));
    //     setIngredientOptions(options);
    //   };
    const fetchIngredients = async (inputValue) => {
        console.log(inputValue)
        const response = await fetch(`http://localhost:8000/recipes/search/ingredient/?search=${inputValue}`);
        const data = await response.json();
        const options = data.results.map((ingredient) => ({
            value: String(ingredient.ingredient_name),
            label: ingredient.ingredient_name,
        }));
        setIngredientOptions(options);
        console.log("works")
    };

    const [ingredientForms, setIngredientForms] = useState([0]);

    const addIngredientForm = () => {
        const newIndex = ingredientForms.length;
        setIngredientForms([...ingredientForms, newIndex]);
    };

    // const [ingredients1, setIngredients1] = useState([{ name: "", quantity: "" }]);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...ingredients];
        list[index][name] = value;
        setIngredients(list);
    };

    const handleAddClick = () => {
        setIngredients([...ingredients, { name: "", quantity: "" }]);
    };

    const handleRemoveClick = (index) => {
        // if (index !== 0) {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
        // }
    };


    return (
        <>
            <Container style={{ height: '80vh', background: "white", borderRadius: 15, overflowY: "scroll" }} className="justify-content-center align-items-start my-5 px-5 py-1 shadow">
                <Row className="mt-5">
                    <Col>
                        <Button variant="outline-primary" onClick={handlePrev}><ArrowBackIcon className="mb-1 me-1" style={{ fontSize: '18px' }} />Back</Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="outline-primary" onClick={handleNext}>Next <ArrowForwardIcon className="mb-1" style={{ fontSize: '18px' }} /></Button>
                    </Col>
                </Row>
                <hr />
                <Row className="mt-1">
                    <Col>
                        <h1>Recipe Ingredients</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Fill out ingredients below!</p>
                    </Col>
                </Row>
                <Row>
                    <Form.Group className="ms-1 me-2 mb-3">

                        {/* {ingredients.map((ingredient, index) => (
                            <div key={index} className="d-flex mb-3">
                                <InputGroup>
                                    <InputGroup.Text>Name</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={ingredient.name}
                                        onChange={(event) => handleInputChange(index, event)}
                                        placeholder="Flour"
                                    />
                                    <InputGroup.Text>Quantity (g)</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={ingredient.quantity}
                                        onChange={(event) => handleInputChange(index, event)}
                                        placeholder="500"
                                    />
                                </InputGroup>
                                <IconButton onClick={() => handleRemoveClick(index)}><DeleteIcon /></IconButton>
                            </div>
                        ))} */}
                        {ingredients.map((ingredient, index) => (
                            <div>
                                <div key={index} className="d-flex mb-3">
                                    <InputGroup>
                                        <InputGroup.Text>Name</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={ingredient.name}
                                            onChange={(event) => handleInputChange(index, event)}
                                            placeholder="Flour"
                                        />
                                        <InputGroup.Text>Quantity (g)</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="quantity"
                                            value={ingredient.quantity}
                                            onChange={(event) => handleInputChange(index, event)}
                                            placeholder="500"
                                        />
                                    </InputGroup>
                                    <IconButton onClick={() => handleRemoveClick(index)}><DeleteIcon /></IconButton>
                                </div>
                                {(!ingredient.name || !ingredient.quantity || isNaN(parseInt(ingredient.quantity))) && (
                                    <p className="text-danger ml-3">Fill in ingredient, and quantity with an integer value</p>
                                )}
                            </div>
                        ))}

                        <div className="text-center mt-3">
                            <Button variant="success" onClick={handleAddClick}>New Ingredient</Button>
                        </div>

                        <Form.Text style={{ color: 'red' }}>
                            {formErr.ingredients}
                        </Form.Text>
                    </Form.Group>
                </Row>
            </Container>
        </>
    );

}

const RecipeSteps = ({ onPrev, addStep, setSteps, steps, deleteStep, renderSteps, handleSubmit,
    setStepsVideos, setStepsPhotos, stepsPhotos, stepsVideos, stepsPreviews, setStepsPreviews, setPage }) => {

    // document.body.style.backgroundColor = "#E8E8E8";

    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

    const handleSubmitt = (e) => {
        e.preventDefault()
        if (steps.length === 0) {
            alert("Please add at least 1 step")
        }
        else {
            const isValid = validateSteps();
            if (!isValid) {
                alert("Check all error messages")
            }
        }
        handleSubmit()
    }


    const handlePrev = () => {
        setPage(3)
    }

    const [invalidSteps, setInvalidSteps] = useState([]);

    const validateSteps = () => {
        const invalidSteps = steps.reduce((invalidSteps, step, index) => {
            if (!step.description) {
                invalidSteps.push(index + 1);
            }
            return invalidSteps;
        }, []);

        setInvalidSteps(invalidSteps);
        return invalidSteps.length === 0;
    };

    const NewStep = () => {
        const newStepNumber = steps.length + 1;
        setSteps([...steps, { stepNumber: newStepNumber, description: "", photos: [], videos: [] }]);
        setStepsPreviews([...stepsPreviews, { stepNumber: newStepNumber, photos: [], videos: [] }]);
    };

    const RemoveStep = (index) => {
        // if (index !== 0) {
        const list = [...steps];
        list.splice(index, 1);
        setSteps(list);

        const previews = [...stepsPreviews];
        previews.splice(index, 1);
        setStepsPreviews(previews);
        // }
    };

    const MediaUpload = (event, stepNumber) => {
        const selectedFiles = Array.from(event.target.files);

        const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];
        // Filter the selected files by type
        const selectedImages = selectedFiles.filter((file) =>
            fileTypes.includes(file.type.split("/")[1].toUpperCase())
        );

        const selectedVideos = selectedFiles.filter(
            (file) => file.type.split("/")[0] === "video"
        );

        // Update the photos and videos array for the specific step

        const list = [...steps];
        const stepIndex = list.findIndex((step) => step.stepNumber === stepNumber);
        list[stepIndex].photos = [...list[stepIndex].photos, ...selectedImages];
        list[stepIndex].videos = [...list[stepIndex].videos, ...selectedVideos];
        setSteps(list);

        const imagePreviews = selectedImages.map((file) => URL.createObjectURL(file));
        const videoPreviewUrls = selectedVideos.map((file) => URL.createObjectURL(file));

        // Update the step previews for the specific step
        const previewsList = [...stepsPreviews];
        const stepPreview = previewsList.find((preview) => preview.stepNumber === stepNumber);
        stepPreview.photos = [...stepPreview.photos, ...imagePreviews];
        stepPreview.videos = [...stepPreview.videos, ...videoPreviewUrls];
        setStepsPreviews(previewsList);
        console.log(stepsPreviews);
    };

    return (
        <>
            <Container style={{ height: '80vh', background: "white", borderRadius: 15, overflowY: "scroll" }} className="justify-content-center align-items-start my-5 px-5 py-1 shadow">
                <Row className="mt-5">
                    <Col>
                        <Button variant="outline-primary" onClick={handlePrev}><ArrowBackIcon className="mb-1 me-1" style={{ fontSize: '18px' }} />Back</Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="success" type="submit" onClick={handleSubmitt}>Create Recipe</Button>
                    </Col>
                </Row>
                <hr />
                <Row className="mt-1">
                    <Col>
                        <h1>Recipe Steps</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Fill out steps below!</p>
                    </Col>
                </Row>
                <Row>
                    <Form.Group className="me-2 mb-3">
                        {/* <Form.Label htmlFor="ingredients">Add Step</Form.Label> */}
                        {steps.map((step, index) => (
                            <>
                                <div className="mb-4">
                                    <h4>Step #{index + 1}</h4>
                                    {invalidSteps.includes(index + 1) && (
                                        <p className="text-danger ml-3">Please fill in this step.</p>
                                    )}
                                    <div className="d-flex" style={{ width: "100%" }}>
                                        <div className="shadow p-4" style={{ width: "100%", borderRadius: 15 }}>
                                            <div key={index} style={{ width: "100%" }}>
                                                <h5>Instruction</h5>
                                                <InputGroup>
                                                    {/* <InputGroup.Text>Instruction</InputGroup.Text> */}
                                                    <Form.Control type="text" id="stepdesc" value={step.description} placeholder="Preheat Oven to 350" onChange={(e) => {
                                                        const newSteps = [...steps];
                                                        newSteps[index].description = e.target.value;
                                                        setSteps(newSteps);
                                                    }} />
                                                </InputGroup>
                                                <h5 className="mt-3">Images & Videos</h5>
                                                {stepsPreviews[index].photos.length > 0 || stepsPreviews[index].videos.length > 0 ? (
                                                    <div className="my-4">
                                                        <Carousel centerMode containerStyle={{ maxWidth: '1200px', maxHeight: '200px' }} className="alight-items-center" style={{ width: '250px', height: '200px' }} gap={10} cols={3} loop>
                                                            {stepsPreviews[index].photos.map((photo, photoIndex) => (
                                                                <Carousel.Item key={photoIndex}>
                                                                    <Card component="li" sx={{ minWidth: 600, minHeight: 200 }}>
                                                                        <CardContent sx={{ background: "black" }}>
                                                                            <IconButton
                                                                                sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
                                                                                onClick={() => {
                                                                                    const list = [...steps];
                                                                                    const stepIndex = list.findIndex((step) => step.stepNumber === index + 1);
                                                                                    list[stepIndex].photos.splice(photoIndex, 1);
                                                                                    setSteps(list);

                                                                                    const previewsList = [...stepsPreviews];
                                                                                    const stepPreview = previewsList.find((preview) => preview.stepNumber === index + 1);
                                                                                    stepPreview.photos.splice(photoIndex, 1);
                                                                                    setStepsPreviews(previewsList);
                                                                                }}
                                                                            >
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                            <img src={photo} alt={`Step ${index + 1} Image ${photoIndex + 1}`} style={{ objectFit: 'contain', maxWidth: '600px', maxHeight: '180px' }} />
                                                                        </CardContent>
                                                                    </Card>
                                                                </Carousel.Item>
                                                            ))}
                                                            {stepsPreviews[index].videos.map((video, videoIndex) => (
                                                                <Carousel.Item key={videoIndex}>
                                                                    <Card component="li" sx={{ minWidth: 600, minHeight: 200 }}>
                                                                        <CardContent sx={{ background: "black" }}>
                                                                            <IconButton
                                                                                sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
                                                                                onClick={() => {
                                                                                    const list = [...steps];
                                                                                    const stepIndex = list.findIndex((step) => step.stepNumber === index + 1);
                                                                                    list[stepIndex].videos.splice(videoIndex, 1);
                                                                                    setSteps(list);

                                                                                    const previewsList = [...stepsPreviews];
                                                                                    const stepPreview = previewsList.find((preview) => preview.stepNumber === index + 1);
                                                                                    stepPreview.videos.splice(videoIndex, 1);
                                                                                    setStepsPreviews(previewsList);
                                                                                }}
                                                                            >
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                            <video style={{ objectFit: 'contain', maxWidth: '600px', maxHeight: '180px' }} controls>
                                                                                <source src={video} type="video/mp4" />
                                                                            </video>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Carousel.Item>
                                                            ))}
                                                        </Carousel>
                                                    </div>

                                                ) : (<h6 className="text-muted">No images or videos to display.</h6>)}

                                                <div className="text-center">
                                                    <Button variant="primary" onClick={() => document.getElementById(`step${index}-media`).click()}>
                                                        Upload
                                                        <input type="file" id={`step${index}-media`} accept="image/*, video/*" onChange={(e) => MediaUpload(e, index + 1)} hidden />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <IconButton onClick={() => RemoveStep(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            </>
                        ))}
                        <div className="text-center mt-3 mb-3 ms-3 me-5">
                            <Button onClick={NewStep}>Add Step</Button>
                        </div>
                        <Form.Text style={{ color: 'red' }}>
                            {formErr.steps}
                        </Form.Text>
                    </Form.Group>
                </Row>
                {/* <Row className="mb-4 d-flex justify-content-center align-items-center">
                    <Col className="text-center">
                        <Button variant="success" type="submit" onClick={handleSubmitt}>Create Recipe</Button>
                    </Col>
                </Row> */}
            </Container>
        </>
    );

}


export { BaseRecipeSearch, WelcomeForm, RecipeBasicInfo, RecipeIngredients, RecipeSteps };