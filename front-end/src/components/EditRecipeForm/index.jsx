import React from 'react';
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Table, Navbar, Nav, NavDropdown, Container, Button, Row, Col, InputGroup, Card, FormControl, FormGroup, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
// import { Ingredient, Step } from './model';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
// import './style.css'
// import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FileUploader } from "react-drag-drop-files";
// import { useHistory } from 'react-router-dom';
// import { render } from "react-dom";
import Carousel from 'better-react-carousel';

import CardContent from '@mui/joy/CardContent';
// import { Dropdown } from 'react-bootstrap';

import SearchBar from '../SearchBar';
// import ReactStars from "react-rating-stars-component";

// import Rating from '../RatingStars';

import Rating from '@mui/material/Rating';

import { AiFillHeart, AiOutlineClockCircle } from "react-icons/ai"

import { FaUtensils } from "react-icons/fa"

import RecipeCard from '../RecipeCard';

// import Carousel from 'react-bootstrap/Carousel'

import { Button as Button2 } from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';

const EditRecipeBasicInfo = ({ onNext, formValue, setFormValue, selectedCuisine, setSelectedCuisine,
    setSelectedDiets, selectedDiets, setImageFiles, setVideoFiles, setVideoPreviews, setImagePreviewUrls,
    imagePreviewUrls, imageFiles, videoFiles, videoPreviews, recipeData, deleteImages, deleteVideos,
    setDeleteImages, setDeleteVideos, existingImages, setExistingImages, existingVideos, setExistingVideos }) => {

    document.body.style.backgroundColor = "#E8E8E8";

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

    const deleteExistingImage = (index, id) => {
        const newImageFiles = [...existingImages];
        newImageFiles.splice(index, 1);
        setExistingImages(newImageFiles);

        setDeleteImages([...deleteImages, ...[id]])
    };

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


    const deleteExistingVideo = (index, id) => {
        const newVideoFiles = [...existingVideos];
        newVideoFiles.splice(index, 1);
        setExistingVideos(newVideoFiles);

        setDeleteVideos([...deleteVideos, ...[id]])
    };

    function convertTimeFormat(time) {
        if (time) {
            const timeParts = time.split(':');
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);

            return minutes;
        }
    }

    function convertCuisine(cuisine) {
        if (cuisine) {
            console.log(cuisine.charAt(0).toUpperCase() + cuisine.slice(1))
            return cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
        }
        return cuisine
    }

    // useEffect(() => {
    //     console.log(recipeData)
    //     if (recipeData){
    //         setSelectedCuisine({label: recipeData.cuisine.charAt(0).toUpperCase() + recipeData.cuisine.slice(1), value: recipeData.cuisine})
    //     }
    // })

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

    const handleSelect = (eventKey, event) => {
        setSelectedCuisine(cuisineOptions[eventKey]);
    };

    // const dietOptions = [
    //     { value: 'vegetarian', label: 'Vegetarian' },
    //     { value: 'vegan', label: 'Vegan' },
    //     { value: 'paleo', label: 'Paleo' },
    //     // add more diet options as needed
    // ];

    const handleNext = () => {
        onNext()
    }

    return (
        <>
            <Container style={{ height: '80vh', background: "white", borderRadius: 15, overflowY: "scroll" }} className="justify-content-center align-items-start my-5 px-5 py-1 shadow">
                <Row className="mt-5">
                    {/* <Col>
                        <Button onClick={handlePrev}>Back</Button>
                    </Col> */}
                    <Col className="d-flex justify-content-end">
                        <Button onClick={handleNext}>Next</Button>
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
                                <Form.Control type="text" id="recipeName" name="name" defaultValue={recipeData.name} onChange={handleChange} placeholder="Enter title" />
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
                                <Form.Control type="number" id="servings" name="servings" defaultValue={recipeData.serving} placeholder="Number of Servings" onChange={handleChange} />
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
                                    <Form.Control type="number" placeholder="Minutes" name="cooking_time_min" aria-label="Minutes" defaultValue={recipeData.cooking_time} onChange={handleChange} />
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
                                    <Form.Control type="number" placeholder="Minutes" name="prep_time_min" aria-label="Minutes" defaultValue={recipeData.prep_time} onChange={handleChange} />
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
                        <Form.Control as="textarea" placeholder="Description of Dish" id="description" defaultValue={recipeData.description} name="description" rows={3} onChange={handleChange} />
                        <Form.Text style={{ color: 'red' }}>
                            {formErr.description}
                        </Form.Text>
                    </Form.Group>
                    <Row>
                        <h5>Images & Videos</h5>
                        <Carousel centerMode containerStyle={{ maxWidth: '1200px', maxHeight: '200px' }} className="alight-items-center" style={{ width: '250px', height: '200px' }} gap={10} cols={3} loop>
                            
                            {existingImages.map((photo, index) => (
                                <Carousel.Item key={index}>
                                    <Card component="li" sx={{ minWidth: 600, minHeight: 200 }}>
                                        <CardContent sx={{ background: "black" }}>
                                            <IconButton
                                                sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
                                                onClick={() => deleteExistingImage(index, photo.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <img
                                                src={"http://127.0.0.1:8000/" + photo.photo}
                                                // srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2"
                                                loading="lazy"
                                                alt=""
                                                style={{ objectFit: 'contain', maxWidth: '600px', maxHeight: '180px' }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Carousel.Item>
                            ))}

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
                            {existingVideos.map((video, index) => (
                                <Carousel.Item key={index}>
                                <Card className="text-center" sx={{ minWidth: 600, minHeight: 200 }}>
                                    <CardContent style={{ background: "black" }}>
                                        <IconButton
                                            sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
                                            onClick={() => deleteExistingVideo(index, video.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <video style={{ objectFit: 'contain', maxWidth: '600px', maxHeight: '180px' }} controls>
                                            <source src={"http://127.0.0.1:8000/" + video.video} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
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
                        <div className="text-center mt-3 mb-4">
                            <Button variant="primary" onClick={() => document.querySelector('input[type="file"]').click()}>
                                Upload
                                <input hidden accept="image/*,video/*" multiple type="file" onChange={handleFileUpload} />
                            </Button>
                        </div>
                        {/* <Col>
                            <Form.Group>
                                <Form.Label style={{ fontWeight: 500, fontSize: "18px" }} htmlFor="images">Images</Form.Label>
                                <Form.Control type="file" id="images" multiple onChange={handleImageChange} />
                                <Form.Text className="text-muted">
                                    Select one or more images to upload.
                                </Form.Text>
                                <div className="image-preview">
                                    {imagePreviewUrls.map((url, index) => (
                                        <img key={index} src={url} alt={`Image ${index + 1}`} />
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Form.Label style={{ fontWeight: 500, fontSize: "18px" }}>Videos</Form.Label>
                                <Form.Control type="file" accept="video/*" onChange={handleVideoChange} multiple />
                                <div>
                                    <input type="file" accept="video/*" onChange={handleVideoChange} multiple />
                                    {renderVideoPreviews()}
                                </div>
                            </FormGroup>
                        </Col> */}
                    </Row>
                </Row>
            </Container>
        </>
    );

}

const EditRecipeIngredients = ({ onNext, onPrev, ingredients, setIngredients,
    ingredient,
    renderIngredients,
    deleteIngredient,
    NewIngredient }) => {

    const handleNext = () => {
        onNext()
    }

    const handlePrev = () => {
        onPrev()
    }

    document.body.style.backgroundColor = "#E8E8E8";

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

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormValue({ ...formValue, [name]: value });
    //     setFormErr(formErr => ({ ...formErr, [name]: '' }));
    // };



    // const [selectedValue, setSelectedValue] = useState('N/A');

    // const handleSelectChange = (event) => {
    //     setSelectedValue(event.target.value);
    // };

    // useEffect(() => {
    //     renderIngredients();
    // }, [ingredients]);

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
        if (index !== 0) {
            const list = [...ingredients];
            list.splice(index, 1);
            setIngredients(list);
        }
    };

    // console.log(existingImages);


    return (
        <>
            <Container style={{ height: '80vh', background: "white", borderRadius: 15, overflowY: "scroll" }} className="justify-content-center align-items-start my-5 px-5 py-1 shadow">
                <Row className="mt-5">
                    <Col>
                        <Button onClick={handlePrev}>Back</Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button onClick={handleNext}>Next</Button>
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
                        {ingredients.map((ingredient, index) => (
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
                                    <InputGroup.Text>Quantity</InputGroup.Text>
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
                        ))}
                        <div className="text-center mt-3">
                            <Button variant="success" onClick={handleAddClick}>New Ingredient</Button>
                        </div>
                        {/* <div>
                            {ingredientForms.map((index) => (
                                <div key={index} className="text-center">
                                    <div className="d-flex mb-3">
                                        <InputGroup>
                                            <InputGroup.Text>Name</InputGroup.Text>
                                            <Form.Control type="text" placeholder="Ingredient Name" />
                                            <InputGroup.Text>Quantity</InputGroup.Text>
                                            <Form.Control type="number" placeholder="Quantity" />
                                        </InputGroup>
                                        <IconButton><DeleteIcon /></IconButton>
                                    </div>
                                </div>
                            ))}
                            <div className="text-center mt-3">
                                <Button variant="success" onClick={addIngredientForm}>
                                    New Ingredient
                                </Button>
                            </div>
                        </div> */}
                        {/* <Form.Label htmlFor="ingredients">Add/Edit Ingredient</Form.Label> */}
                        {/* <div className="text-center">
                            <div className="d-flex">
                                <InputGroup>
                                    <InputGroup.Text>Name</InputGroup.Text>
                                    <Form.Control type="text" id="ingredientName" placeholder="Ingredient Name" />
                                    <InputGroup.Text>Quantity</InputGroup.Text>
                                    <Form.Control type="number" id="ingredientQuantity" placeholder="Quantity" />
                                </InputGroup>
                                <IconButton><DeleteIcon/></IconButton>
                            </div>
                            <Button type="button" id="addingredient" onClick={NewIngredient} className="m-1 btn btn-dark">+</Button>
                        </div>
                        <div className="text-center mt-3">
                            <Button variant="success" >New Ingredient</Button>
                        </div> */}

                        <Form.Text style={{ color: 'red' }}>
                            {formErr.ingredients}
                        </Form.Text>
                    </Form.Group>
                    {/* <Form.Group className="ms-1 me-2 mb-3">
                        <Form.Label htmlFor="ingredients">Ingredients</Form.Label>
                        <Table striped bordered hover id="ingredients-list" className="mt-1">
                            <thead>
                                <tr>
                                    <th style={{ width: "35%" }}>Name</th>
                                    <th style={{ width: "35%" }}>Quantity</th>
                                    <th style={{ width: "30%" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </Table>
                    </Form.Group> */}
                </Row>
            </Container>
        </>
    );

}

const EditRecipeSteps = ({ onPrev, addStep, setSteps, steps, deleteStep, renderSteps, handleSubmit,
    setStepsVideos, setStepsPhotos, stepsPhotos, stepsVideos, stepsPreviews, setStepsPreviews }) => {

    document.body.style.backgroundColor = "#E8E8E8";

    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

    const handleSubmitt = (e) => {
        e.preventDefault()
        handleSubmit()
    }

    // const NewStep = () => {
    //     setSteps([...steps, { stepNumber: 2, description: "", photos: [], videos: [] }]);
    //     // const newStepNumber = steps.length + 1;
    //     // setSteps([...steps, { stepNumber: newStepNumber, description: "", photos: [], videos: [] }]);
    //     setStepsPreviews([...stepsPreviews, { stepNumber: 2, media: [] }]);
    // };


    const handlePrev = () => {
        onPrev()
    }

    // const RemoveStep = (index) => {
    //     if (index !== 0) {
    //         const list = [...steps];
    //         list.splice(index, 1);
    //         setSteps(list);

    //         const previews = [...stepsPreviews];
    //         previews.splice(index, 1);
    //         setStepsPreviews(previews);
    //     }
    // }

    // const MediaUpload = (event, index) => {
    //     const selectedFiles = Array.from(event.target.files);

    //     const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];
    //     // Filter the selected files by type
    //     const selectedImages = selectedFiles.filter((file) =>
    //         fileTypes.includes(file.type.split("/")[1].toUpperCase())
    //     );

    //     const selectedVideos = selectedFiles.filter(
    //         (file) => file.type.split("/")[0] === "video"
    //     );

    //     // Update the photos and videos array for the specific step
    //     const list = [...steps];
    //     list[index].photos = [...list[index].photos, ...selectedImages];
    //     list[index].videos = [...list[index].videos, ...selectedVideos];
    //     setSteps(list);

    //     const imagePreviews = selectedImages.map((file) => URL.createObjectURL(file));
    //     const videoPreviewUrls = selectedVideos.map((file) => URL.createObjectURL(file));

    //     // Update the step previews for the specific step
    //     const previewsList = [...stepsPreviews];
    //     const stepPreview = previewsList.find((preview) => preview.stepNumber === index + 1);
    //     stepPreview.media = [...stepPreview.media, ...imagePreviews, ...videoPreviewUrls];
    //     setStepsPreviews(previewsList);
    // };

    // const NewStep = () => {
    //     const newStepNumber = steps.length + 1;
    //     setSteps([...steps, { stepNumber: newStepNumber, description: "", photos: [], videos: [] }]);
    //     setStepsPreviews([...stepsPreviews, { stepNumber: newStepNumber, media: [] }]);
    // };

    // const RemoveStep = (index) => {
    //     if (index !== 0) {
    //         const list = [...steps];
    //         list.splice(index, 1);
    //         setSteps(list);

    //         const previews = [...stepsPreviews];
    //         previews.splice(index, 1);
    //         setStepsPreviews(previews);
    //     }
    // };

    // const MediaUpload = (event, stepNumber) => {
    //     const selectedFiles = Array.from(event.target.files);

    //     const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];
    //     // Filter the selected files by type
    //     const selectedImages = selectedFiles.filter((file) =>
    //         fileTypes.includes(file.type.split("/")[1].toUpperCase())
    //     );

    //     const selectedVideos = selectedFiles.filter(
    //         (file) => file.type.split("/")[0] === "video"
    //     );

    //     // Update the photos and videos array for the specific step

    //     const list = [...steps];
    //     const stepIndex = list.findIndex(step => step.stepNumber === stepNumber);
    //     list[stepIndex].photos = [...list[stepIndex].photos, ...selectedImages];
    //     list[stepIndex].videos = [...list[stepIndex].videos, ...selectedVideos];
    //     setSteps(list);

    //     const imagePreviews = selectedImages.map((file) => URL.createObjectURL(file));
    //     const videoPreviewUrls = selectedVideos.map((file) => URL.createObjectURL(file));

    //     // Update the step previews for the specific step
    //     const previewsList = [...stepsPreviews];
    //     const stepPreview = previewsList.find((preview) => preview.stepNumber === stepNumber);
    //     stepPreview.media = [...stepPreview.media, ...imagePreviews, ...videoPreviewUrls];
    //     setStepsPreviews(previewsList);
    //     console.log(stepsPreviews)
    // };

    const NewStep = () => {
        const newStepNumber = steps.length + 1;
        setSteps([...steps, { stepNumber: newStepNumber, description: "", photos: [], videos: [] }]);
        setStepsPreviews([...stepsPreviews, { stepNumber: newStepNumber, photos: [], videos: [] }]);
    };

    const RemoveStep = (index) => {
        if (index !== 0) {
            const list = [...steps];
            list.splice(index, 1);
            setSteps(list);

            const previews = [...stepsPreviews];
            previews.splice(index, 1);
            setStepsPreviews(previews);
        }
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
                        <Button onClick={handlePrev}>Back</Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        {/* <Link to={`recipeinfo/${recipeData.id}`}>
                        <Button variant="outline-success" type="submit" onClick={handleSubmitt}>Info View</Button>
                        </Link> */}
                        <Button variant="success" type="submit" onClick={handleSubmitt}>Save Changes</Button>
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


export { EditRecipeBasicInfo, EditRecipeIngredients, EditRecipeSteps };