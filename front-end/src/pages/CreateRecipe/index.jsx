import React from 'react';
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Table, Navbar, Nav, NavDropdown, Container, Button, Row, Col, InputGroup, FormControl, FormGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Ingredient, Step } from './model';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import './style.css'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FileUploader } from "react-drag-drop-files";

import { BaseRecipeSearch, WelcomeForm, RecipeBasicInfo, RecipeIngredients, RecipeSteps } from '../../components/CreateRecipeForm';


const CreateRecipe = () => {
    // document.body.style.backgroundColor = "#E8E8E8";

    const [page, setPage] = useState(0);
    const [base, setBase] = useState(null);

    const [cards, setCards] = useState([]);
    const [searchPage, setSearchPage] = useState(1);
    const [moreCards, setMoreCards] = useState(true);
    const [fetchURL, setFetchURL] = useState("http://localhost:8000/recipes/all/?page=")

    const [selectedCard, setSelectedCard] = useState(null);
  

    const retriveRecipes = async () => {
        try {
            const response = await fetch(`${fetchURL}${searchPage}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            const data = await response.json();
            if (searchPage > 1) {
                setCards(prevCards => [...prevCards, ...data.results]);
            } else {
                setCards(data.results);
            }
            setMoreCards(data.next !== null);
        }
        catch (error){
    
        }
    }
    
    useEffect(() => {
        retriveRecipes();
    }, [fetchURL, searchPage])


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


    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        const dietsString = diets.map((diet) => `diet=${diet}`).join('&');
        const cuisinesString = cuisines.map((cuisine) => `cuisine=${cuisine}`).join('&');
        const cooking = `cooking_time=00:${cookingTime}:00`;
        const newFetchURL = `http://localhost:8000/recipes/search/?search=${searchValue}&${dietsString}&${cuisinesString}&page=`;
        // setCards([]);
        // setMoreCards(true);
        setFetchURL(newFetchURL);
        setSearchPage(1);
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
        setSearchPage(prevPage => prevPage + 1);
    };

    const handleNext = (value) => {
        setPage(page + value);
    };

    const handlePrev = (value) => {
        setPage(page - value);
    };

    const initState = {
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
    };
    const [formValue, setFormValue] = useState(initState);
    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [ingredientOptions, setIngredientOptions] = useState(null);

    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

    // const [stepPhotos, setStepPhotos] = useState([]);
    // const [stepVideos, setStepVideos] = useState([]);

    const [videoFiles, setVideoFiles] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);
    const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];

    const [file, setFile] = useState(null);
    const handleUploadChange = (file) => {
        setFile(file);
    };

    const handleVideoChange = (event) => {
        const selectedVideos = Array.from(event.target.files);
        setVideoFiles(selectedVideos);

        const videoPreviewUrls = selectedVideos.map((video) => URL.createObjectURL(video));
        setVideoPreviews(videoPreviewUrls);
    };

    const handleVideoRemove = (index) => {
        const newVideoFiles = [...videoFiles];
        newVideoFiles.splice(index, 1);
        setVideoFiles(newVideoFiles);

        const newVideoPreviews = [...videoPreviews];
        newVideoPreviews.splice(index, 1);
        setVideoPreviews(newVideoPreviews);
    };

    const renderVideoPreviews = () => {
        if (videoPreviews.length > 0) {
            return (
                <div className="d-flex flex-wrap">
                    {videoPreviews.map((previewUrl, index) => (
                        <div key={index} className="d-flex flex-column align-items-center m-2">
                            <video src={previewUrl} alt={`Video ${index}`} controls width="200" height="200" />
                            <button type="button" className="btn btn-danger mt-2" onClick={() => handleVideoRemove(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setImageFiles(prevImageFiles => [...prevImageFiles, ...files]);
        const urls = files.map((file) => URL.createObjectURL(file));
        setImagePreviewUrls(urls);
    };

    // const deleteImage = (index) => {
    //     const newImageFiles = [...imageFiles];
    //     newImageFiles.splice(index, 1);
    //     setImageFiles(newImageFiles);

    //     const newImagePreviewUrls = [...imagePreviewUrls];
    //     newImagePreviewUrls.splice(index, 1);
    //     setImagePreviewUrls(newImagePreviewUrls);
    //   };

    // useEffect(() => {
    //     return () => {
    //         // Revoke the URLs when the component is unmounted to avoid memory leaks.
    //         imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    //     };
    // }, [imagePreviewUrls]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value });
        setFormErr(formErr => ({ ...formErr, [name]: '' }));
    };

    const handleSubmit = (e) => {
        console.log("works")
        // e.preventDefault();
        const errors = validateForm();
        setFormErr(errors);
        console.log(errors)
        if (Object.keys(errors).length === 0) {
            // Submit form
            // format data and send POST request
            // console.log("Send POST Request to log in redirect to home page!, set token as well, will complete later");
            // here check if username or password is incorrect, then username or password is incorrect error should show
            // console.log(ingredients)
            // const ingredientsTable = document.querySelector("#ingredients-list tbody");
            const ingredients_data = [];

            // Iterate over each row in the table
            // ingredientsTable.querySelectorAll("tr").forEach(row => {
            //     // Get the name and quantity inputs for the current row
            //     // const nameInput = row.querySelector("input[name='ingredientName']");
            //     // const quantityInput = row.querySelector("input[name='ingredientQuantity']");

            //     // console.log(nameInput)
            //     // console.log(quantityInput)

            //     const nameInput = row.querySelector("td:nth-of-type(1)");
            //     const quantityInput = row.querySelector("td:nth-of-type(2)");

            //     console.log(nameInput)
            //     console.log(quantityInput)

            //     // Create a new object for the current row
            //     const ingredientObj = {
            //         "ingredient": { "ingredient_name": nameInput.innerHTML },
            //         "quantity": quantityInput.innerHTML
            //     };

            //     // Add the object to the array of ingredients
            //     ingredients_data.push(ingredientObj);
            // });

            console.log(ingredients)
            console.log(steps)

            ingredients.forEach(ingredient => {
                // Create a new object for the current ingredient
                const ingredientObj = {
                    "ingredient": { "ingredient_name": ingredient.name },
                    "quantity": ingredient.quantity
                };

                // Add the object to the array of ingredients
                ingredients_data.push(ingredientObj);
            });

            const steps_data = [];

            // Loop through the step rows and add the step object to the steps array
            steps.forEach((step, index) => {

                // Create the step object and push it to the steps array
                const step_single = {
                    description: step.description,
                    photos: [],
                    videos: []
                };
                steps_data.push(step_single);
            });


            // let x = 0;
            // if (x === 0 ){
            //     return;
            // }

            // ingredients.forEach(ingredient => {
            //     // Create a new object for the current ingredient
            //     const ingredientObj = {
            //         "ingredient": { "ingredient_name": ingredient.name },
            //         "quantity": ingredient.quantity
            //     };

            //     // Add the object to the array of ingredients
            //     ingredients_data.push(ingredientObj);
            // });

            // Get the steps table and rows
            // const stepsTable = document.getElementById("steps-list");
            // const stepRows = stepsTable.querySelectorAll("tbody tr");

            // Create an empty array to hold the steps
            // const steps_data = [];

            // // Loop through the step rows and add the step object to the steps array
            // stepRows.forEach((row, index) => {
            //     const description = row.querySelector("td:nth-of-type(2)").innerHTML;
            //     console.log(description)
            //     console.log(row.querySelector("td:nth-of-type(2)").innerHTML)

            //     // Create the step object and push it to the steps array
            //     const step_single = {
            //         description: description,
            //         photos: [],
            //         videos: []
            //     };
            //     steps_data.push(step_single);
            // });

            const namerecipe = formValue.name

            // console.log(formValue.description)
            // console.log(videoFiles)
            // console.log(imageFiles)

            // console.log(selectedDiets)

            // console.log("above")


            let data = {
                "name": formValue.name,
                "cuisine": selectedCuisine.value,
                "diet": selectedDiets.map(diet => ({ "diet": diet.value })),
                "description": formValue.description,
                "serving": formValue.servings,
                "prep_time_hours": parseInt(formValue.prep_time_hours, 10),
                "prep_time_min": parseInt(formValue.prep_time_min, 10),
                "cooking_time_hours": parseInt(formValue.cooking_time_hours, 10),
                "cooking_time_min": parseInt(formValue.cooking_time_min, 10),
                "ingredients": ingredients_data,
                "base_recipe": "",
                "step": steps_data,
                "photos": [],
                "videos": []
            }

            if (base){
                data["base_recipe"] = base.id
            }

            console.log(data)

            console.log(data.cooking_time_min)

            axios.post("http://localhost:8000/recipes/create/", data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }).then(response => {
                if (response.status === 200) {
                    const recipe_id = response.data.id
                    const recipe_steps = response.data.step
                    console.log(imageFiles)
                    for (let i = 0; i < imageFiles.length; i++) {
                        const formData = new FormData();
                        formData.append('image', imageFiles[i]);
                        axios.post(`http://localhost:8000/recipes/uploadImage/${recipe_id}`, formData, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }).then(response => {
                            if (response.status === 201) {
                                console.log(response.data);
                            } else {
                                console.log(response);
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                    // Iterate over each video file and upload it
                    for (let i = 0; i < videoFiles.length; i++) {
                        const formData = new FormData();
                        formData.append('video', videoFiles[i]);
                        axios.post(`http://localhost:8000/recipes/uploadVideo/${recipe_id}`, formData, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }).then(response => {
                            if (response.status === 201) {
                                console.log(`Video ${i + 1} successfully uploaded`);
                            } else {
                                console.log(response);
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }

                    for (let i = 0; i < recipe_steps.length; i++) {
                        if (steps[i].photos.length > 0) {
                            for (let x = 0; x < steps[i].photos.length; x++) {
                                const formData = new FormData();
                                formData.append('photo', steps[i].photos[x]);
                                axios.post(`http://localhost:8000/recipes/uploadImage/step/${recipe_steps[x].id}`, formData, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    }
                                }).then(response => {
                                    if (response.status === 201) {
                                        console.log(`Video ${i + 1} successfully uploaded`);
                                    } else {
                                        console.log(response);
                                    }
                                }).catch(error => {
                                    console.log(error);
                                });
                            }
                        }
                        if (steps[i].videos.length > 0) {
                            for (let x = 0; x < steps[i].videos.length; x++) {
                                const formData = new FormData();
                                formData.append('video', steps[i].videos[x]);
                                axios.post(`http://localhost:8000/recipes/uploadVideo/step/${recipe_steps[x].id}`, formData, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    }
                                }).then(response => {
                                    if (response.status === 201) {
                                        console.log(`Video ${i + 1} successfully uploaded`);
                                    } else {
                                        console.log(response);
                                    }
                                }).catch(error => {
                                    console.log(error);
                                });
                            }
                        }
                        // console.log(recipe_steps[x].id)
                    }
                    // console.log(steps)


                    alert("Recipe Successfully Created!");
                    // console.log(response.data.id);
                    document.body.style.backgroundColor = "";
                    navigate(`/recipeinfo/${recipe_id}`);
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!formValue.name.trim()) {
            errors.name = "Title is required";
        }
        // if (!formValue.cuisine.trim()) {
        //     errors.cuisine = "Cuisine is required";
        // }

        console.log(formValue.servings)
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
        // if (ingredients.length < 1){
        //     errors.ingredients = "At least 1 ingredient is required"
        // }
        // if (document.querySelectorAll("#ingredients-list tbody tr").length < 1) {
        //     errors.ingredients = "At least 1 ingredient must be added"
        // }
        if (ingredients.length < 1) {
            errors.ingredients = "At least 1 ingredient must be added"
        }

        // if (steps.length < 1){
        //     errors.steps = "At least 1 step is required"
        // }
        if (steps.length < 1) {
            errors.steps = "At least 1 step must be added"
        }
        return errors;
    };


    const [selectedCuisine, setSelectedCuisine] = useState(null);
    const [selectedDiets, setSelectedDiets] = useState([]);

    const cuisineOptions = [
        { value: 'italian', label: 'Italian' },
        { value: 'mexican', label: 'Mexican' },
        { value: 'chinese', label: 'Chinese' },
        // add more cuisine options as needed
    ];

    const dietOptions = [
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'paleo', label: 'Paleo' },
        // add more diet options as needed
    ];

    const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);

    // const handleInputChange = (index, event) => {
    //     const { name, value } = event.target;
    //     const list = [...ingredients];
    //     list[index][name] = value;
    //     setIngredients(list);
    // };

    // const handleAddClick = () => {
    //     setIngredients([...ingredients, { name: "", quantity: "" }]);
    // };

    // const handleRemoveClick = (index) => {
    //     const list = [...ingredients];
    //     list.splice(index, 1);
    //     setIngredients(list);
    // };

    // const [ingredients, setIngredients] = useState([]);

    // const deleteIngredient = (name) => {
    //     setIngredients(ingredients.filter((item) => item.name !== name));
    // };

    // const renderIngredients = () => {
    //     const tbody = document.querySelector("#ingredients-list tbody");
    //     tbody.innerHTML = "";

    //     for (let i = 0; i < ingredients.length; i++) {
    //         let item = ingredients[i];

    //         const row = document.createElement("tr");
    //         row.id = item.name.replace(/\s+/g, "_");

    //         const name = document.createElement("td");
    //         name.textContent = " " + item.name + " ";
    //         row.appendChild(name);

    //         const quantity = document.createElement("td");
    //         quantity.textContent = " " + item.quantity + " ";
    //         row.appendChild(quantity);

    //         const deleteBtn = document.createElement("button");
    //         deleteBtn.textContent = "Delete";
    //         deleteBtn.className = "btn btn-danger";
    //         deleteBtn.addEventListener("click", () => deleteIngredient(item.name));
    //         const deleteCell = document.createElement("td");
    //         deleteCell.appendChild(deleteBtn);
    //         row.appendChild(deleteCell);

    //         tbody.appendChild(row);
    //     }
    // };

    // const NewIngredient = () => {
    //     const ingredientName = document.getElementById("ingredientName").value;
    //     const ingredientQuantity = document.getElementById("ingredientQuantity").value;

    //     if (ingredientName && ingredientQuantity) {
    //         let exists = false;
    //         for (let i = 0; i < ingredients.length; i++) {
    //             if (ingredients[i].name === ingredientName) {
    //                 ingredients[i].quantity = ingredientQuantity;
    //                 exists = true;
    //                 break;
    //             }
    //         }

    //         if (!exists) {
    //             let new_ing = new Ingredient(ingredientName, ingredientQuantity)
    //             setIngredients([...ingredients, new_ing]);
    //         }

    //         renderIngredients();
    //     }

    //     // Clear ingredient name and quantity inputs
    //     document.getElementById("ingredientName").value = "";
    //     document.getElementById("ingredientQuantity").value = "";
    // };

    // const [steps, setSteps] = useState([]);

    const [steps, setSteps] = useState([{ stepNumber: 1, description: "", photos: [], videos: [] }]);
    const [stepsPreviews, setStepsPreviews] = useState([{ stepNumber: 1, photos: [], videos: [] }]);

    // const [stepsImagePreviews, setStepsImagePreviews] = useState([{ stepNumber: 1, photos: [] }]);
    // const [stepsVideoPreviews, setStepsVideoPreviews] = useState([{ stepNumber: 1, videos: [] }]);

    const deleteStep = (index) => {
        setSteps((prevSteps) => {
            const newSteps = [...prevSteps];
            newSteps.splice(index, 1);
            return newSteps;
        });
    };

    const renderSteps = () => {
        const tbody = document.querySelector("#steps-list tbody");
        tbody.innerHTML = "";

        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];

            const row = document.createElement("tr");
            row.id = i;

            const number = document.createElement("td");
            number.textContent = i + 1;
            row.appendChild(number);

            const description = document.createElement("td");
            description.textContent = " " + step.description + " ";
            row.appendChild(description);

            // Create a cell for displaying media files
            const mediaCell = document.createElement("td");
            if (step.mediaFiles) {
                for (let j = 0; j < step.mediaFiles.length; j++) {
                    let mediaFile = step.mediaFiles[j];

                    // Create an HTML element to display the media file
                    let mediaElement;
                    if (mediaFile.type.includes("image")) {
                        mediaElement = document.createElement("img");
                        mediaElement.src = URL.createObjectURL(mediaFile);
                        mediaElement.alt = "Step media";
                    } else if (mediaFile.type.includes("video")) {
                        mediaElement = document.createElement("video");
                        mediaElement.src = URL.createObjectURL(mediaFile);
                        mediaElement.controls = true;
                    }

                    mediaCell.appendChild(mediaElement);

                    // Create a button to delete the media file
                    let deleteMediaBtn = document.createElement("button");
                    deleteMediaBtn.textContent = "Delete Media";
                    deleteMediaBtn.className = "btn btn-danger ms-2";
                    deleteMediaBtn.addEventListener("click", () => {
                        step.mediaFiles.splice(j, 1);
                        renderSteps();
                    });

                    mediaCell.appendChild(deleteMediaBtn);
                }
            }
            row.appendChild(mediaCell);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "btn btn-danger";
            deleteBtn.addEventListener("click", () => deleteStep(i));
            const deleteCell = document.createElement("td");
            deleteCell.appendChild(deleteBtn);
            row.appendChild(deleteCell);

            tbody.appendChild(row);
        }
    };

    const addStep = () => {
        const stepDescription = document.getElementById("stepdesc").value;
        const stepMediaInput = document.getElementById("stepmedia");
        const stepMediaFiles = stepMediaInput.files;

        if (stepDescription) {
            setSteps((prevSteps) => [
                ...prevSteps,
                { description: stepDescription, mediaFiles: stepMediaFiles },
            ]);
        }

        // Clear step description and media input
        document.getElementById("stepdesc").value = "";
        stepMediaInput.value = "";
    };

    return (
        <>
            {page === 0 && (<WelcomeForm setPage={setPage} onNext={handleNext} formValue={formValue} setFormValue={setFormValue} />)
            }
            {page === 1 && 
            (<BaseRecipeSearch 
                onNext={handleNext}
                onPrev={handlePrev}
                setSearchPage={setSearchPage}
                handleSearchSubmit={handleSearchSubmit}
                handleSearchChange={handleSearchChange}
                handleCuisineChange={handleCuisineChange}
                handleCookingTimeChange={handleCookingTimeChange}
                handleDietChange={handleDietChange}
                cookingTime={cookingTime}
                cards={cards}
                loadMoreCards={loadMoreCards}
                setCards={setCards}
                moreCards={moreCards}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                setPage={setPage}
                base={base}
                setBase={setBase}
                setVideoFiles={setVideoFiles}
                setImageFiles={setImageFiles}
                setImagePreviewUrls={setImagePreviewUrls}
                setVideoPreviews={setVideoPreviews}
                setSelectedCuisine={setSelectedCuisine}
                setSelectedDiets={setSelectedDiets}
                setIngredients={setIngredients}
                setFormValue={setFormValue}
                setStepsPreviews={setStepsPreviews}
                setSteps={setSteps}
            />)
            }
            {page === 2 &&
                (<RecipeBasicInfo
                    onNext={handleNext}
                    onPrev={handlePrev}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    setSelectedCuisine={setSelectedCuisine}
                    selectedCuisine={selectedCuisine}
                    selectedDiets={selectedDiets}
                    setSelectedDiets={setSelectedDiets}
                    setVideoFiles={setVideoFiles}
                    setImageFiles={setImageFiles}
                    setImagePreviewUrls={setImagePreviewUrls}
                    setVideoPreviews={setVideoPreviews}
                    imageFiles={imageFiles}
                    videoFiles={videoFiles}
                    videoPreviews={videoPreviews}
                    imagePreviewUrls={imagePreviewUrls}
                    setPage={setPage}
                    setStepsPreviews={setStepsPreviews}
                    setSteps={setSteps}
                    base={base}
                    // validateForm={validateForm()}
                    // setFormValue={setFormValue}
                />)
            }
            {page === 3 &&
                (<RecipeIngredients
                    onNext={handleNext}
                    onPrev={handlePrev}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    setIngredients={setIngredients}
                    ingredients={ingredients}
                    setPage={setPage}
                />)
            }
            {/* renderIngredients={renderIngredients}
                    deleteIngredient={deleteIngredient}
                    NewIngredient={NewIngredient} */}
            {page === 4 &&
                (<RecipeSteps
                    onPrev={handlePrev}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    setSteps={setSteps}
                    steps={steps}
                    renderSteps={renderSteps}
                    addStep={addStep}
                    deleteStep={deleteStep}
                    handleSubmit={handleSubmit}
                    stepsPreviews={stepsPreviews}
                    setStepsPreviews={setStepsPreviews}
                    setPage={setPage}
                // setStepsPhotos={setStepsPhotos}
                // setStepsVideos={setStepsVideos}
                // stepsVideos={stepsVideos}
                // stepsPhotos={stepsPhotos}
                />)
            }
        </>
    );

}


export default CreateRecipe;