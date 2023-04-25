import React from 'react';
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Table, Navbar, Nav, NavDropdown, Container, Button, Row, Col, InputGroup, FormControl, FormGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
// import { Ingredient, Step } from './model';
import { useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
// import './style.css'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FileUploader } from "react-drag-drop-files";

import { EditRecipeBasicInfo, EditRecipeIngredients, EditRecipeSteps } from '../../components/EditRecipeForm';


const EditRecipe = () => {
    // document.body.style.backgroundColor = "#E8E8E8";

    const [page, setPage] = useState(0);

    const [recipeData, setRecipeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { recipe_id } = useParams();

    const handleNext = () => {
        setPage(page + 1);
    };

    const handlePrev = () => {
        setPage(page - 1);
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
        "steps": []
    };
    const [formValue, setFormValue] = useState(initState);

    // useEffect(() => {
    //     const initState = {
    //         "name": recipeData.name,
    //         "cuisine": "",
    //         "diet": [],
    //         "servings": recipeData.serving,
    //         "prep_time_hours": 0,
    //         "prep_time_min": recipeData.prep_time,
    //         "cooking_time_hours": 0,
    //         "cooking_time_min": recipeData.cooking_time,
    //         "description": recipeData.description,
    //         "ingredients": "",
    //         "steps": []
    //     };
    //     setFormValue(initState)
    //     setIsLoading(false);
    // }, [recipeData])





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
    const fileTypes = ["JPG", "PNG", "GIF"];

    const [existingImages, setExistingImages] = useState([]);
    const [existingVideos, setExistingVideos] = useState([]);
    const [existingStepImages, setExistingStepImages] = useState([]);
    const [existingStepVideos, setExistingStepVideos] = useState([]);

    const [deleteImages, setDeleteImages] = useState([]);
    const [deleteVideos, setDeleteVideos] = useState([]);
    const [deleteStepImages, setDeleteStepImages] = useState([]);
    const [deleteStepVideos, setDeleteStepVideos] = useState([]);


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
            const ingredients_data = [];
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

            let newdata = {};

            if (formValue.name !== "") {
                newdata["name"] = formValue.name;
            }

            if (selectedCuisine.value !== "") {
                newdata["cuisine"] = selectedCuisine.value;
            }

            if (selectedDiets.length > 0) {
                let d = selectedDiets.map(diet => ({ "diet": diet.value }));
                console.log(d)
                newdata["diet"] = []
                for (let i = 0; i < d.length; i++) {
                    newdata["diet"].push(d[i].diet)
                }
            }

            if (formValue.description !== "") {
                newdata["description"] = formValue.description;
            }

            if (formValue.servings !== "") {
                newdata["serving"] = formValue.servings;
            }

            if (ingredients_data.length > 0) {
                newdata["ingredients"] = ingredients_data;
            }

            if (steps_data.length > 0) {
                newdata["step"] = steps_data;
            }

            if (formValue.cooking_time_min){
                newdata["cooking_time"] = formValue.cooking_time_min;
            }

            if (formValue.prep_time_min){
                newdata["prep_time"] = formValue.prep_time_min;
            }

            console.log(newdata)



            axios.patch(`http://localhost:8000/recipes/recipe/info/edit/${recipe_id}`, JSON.stringify(newdata), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": 'application/json'
                }
            }).then(respond => {
                if (respond.status === 200) {
                    console.log(respond.data.description)
                    const recipe_steps = respond.data.step
                    console.log(recipe_steps)
                    console.log(steps, "hello")
                    for (let i = 0; i < recipe_steps.length; i++) {
                        if (steps[i].photos.length > 0){
                            for (let x = 0; x < steps[i].photos.length; x++) {
                                const formData = new FormData();
                                formData.append('photo', steps[i].photos[x]);
                                console.log("post request!")
                                axios.post(`http://localhost:8000/recipes/uploadImage/step/${recipe_steps[x].id}`, formData, {headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                }}).then(response => {
                                    if (response.status === 201) {
                                        // alert("uploaded!!!!!")
                                    } else {
                                        console.log(response);
                                    }
                                }).catch(error => {
                                    console.log(error);
                                });
                            }
                        }
                        if (steps[i].videos.length > 0){
                            for (let x = 0; x < steps[i].videos.length; x++) {
                                const formData = new FormData();
                                formData.append('video', steps[i].videos[x]);
                                axios.post(`http://localhost:8000/recipes/uploadVideo/step/${recipe_steps[x].id}`, formData, {headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                }}).then(response => {
                                    if (response.status === 201) {
                                        
                                    } else {
                                        console.log(response);
                                    }
                                }).catch(error => {
                                    console.log(error);
                                });
                            }
                        }
                    }
                }
            }).catch(error => {
                    console.log(error);
                })

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
                        console.log("did not work");
                    }
                }).catch(error => {
                    console.log(error);
                });
            }

            for (let x = 0; x < deleteImages.length; x++) {
                axios.delete(`http://localhost:8000/recipes/DeleteImage/recipe/${recipe_id}/image/${deleteImages[x]}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": 'application/json'
                    }
                }).then(response => {
                    console.log(response)
                })
            }

            for (let x = 0; x < deleteVideos.length; x++) {
                axios.delete(`http://localhost:8000/recipes/DeleteVideo/recipe/${recipe_id}/image/${deleteVideos[x]}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": 'application/json'
                    }
                }).then(response => {
                    console.log(response)
                })
            }

            // alert("Recipe Changes Saved!")


        }
    };

    const validateForm = () => {
        let errors = {};
        // if (!formValue.name.trim()) {
        //     errors.name = "Title is required";
        // }
        // if (!formValue.cuisine.trim()) {
        //     errors.cuisine = "Cuisine is required";
        // }
        // if (!formValue.servings.trim()) {
        //     errors.servings = "Servings is required";
        // }
        // if (!formValue.description.trim()) {
        //     errors.description = "Description is required";
        // }
        // if (!formValue.cooking_time_hours && !formValue.cooking_time_min) {
        //     errors.cooking_time_hours = "Cooking Time is required";
        // }
        // if (!formValue.prep_time_hours && !formValue.prep_time_min) {
        //     errors.prep_time_hours = "Prep Time is required";
        // }
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


    const [selectedCuisine, setSelectedCuisine] = useState({});
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

    const [ingredients, setIngredients] = useState(null);

    const [steps, setSteps] = useState([{ stepNumber: 1, description: "", photos: [], videos: [] }]);
    const [stepsPreviews, setStepsPreviews] = useState([{ stepNumber: 1, photos: [], videos: [] }]);

    // const [stepsImagePreviews, setStepsImagePreviews] = useState([{ stepNumber: 1, photos: [] }]);
    // const [stepsVideoPreviews, setStepsVideoPreviews] = useState([{ stepNumber: 1, videos: [] }]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/recipes/recipe/info/${recipe_id}`)
            .then(response => response.json())
            .then(data => {
                setRecipeData(data);
                console.log(data)
                {
                    data.photos.map((photo) => (
                        console.log(photo)
                    ))
                }
                // setIsLoading(false);
            })
            .catch(error => console.error(error));
    }, [recipe_id]);

    useEffect(() => {
        if (recipeData) {
            console.log(recipeData.step)
            setSelectedCuisine({ label: recipeData.cuisine.charAt(0).toUpperCase() + recipeData.cuisine.slice(1), value: recipeData.cuisine })
            const diets = recipeData.diet.map((diet) => ({
                label: diet.diet.charAt(0).toUpperCase() + diet.diet.slice(1),
                value: diet,
            }));
            setSelectedDiets(diets)
            const ingredient = recipeData.ingredients.map((ing) => ({
                name: ing.ingredient.ingredient_name,
                quantity: ing.quantity
            }))
            setIngredients(ingredient)
            // const stepd = recipeData.step.map((stp) => ({
            //     stepNumber: stp.order, description: stp.description, photos: stp.photos, videos: stp.videos
            // }))
            // const stepd = recipeData.step.map(async (stp) => {
            //     const photoBlobs = await Promise.all(stp.photos.map(async (photo) => {
            //       const response = await fetch("http://127.0.0.1:8000/" + photo.photo);
            //       const blob = await response.blob();
            //       return blob;
            //     }));

            //     const videoBlobs = await Promise.all(stp.videos.map(async (video) => {
            //       const response = await fetch("http://127.0.0.1:8000/" + video.video);
            //       const blob = await response.blob();
            //       return blob;
            //     }));

            //     return {
            //       stepNumber: stp.order,
            //       description: stp.description,
            //       photos: photoBlobs,
            //       videos: videoBlobs
            //     }
            //   });
            // setSteps(stepd)
            const stepdPromises = recipeData.step.map(async (stp) => {
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

            const recipephotos = recipeData.photos.map((pht) => ({
                id: pht.id, photo: pht.image
            }))
            setExistingImages(recipephotos)
            console.log(recipeData.videos)
            const recipevideos = recipeData.videos.map((video) => ({
                id: video.id, video: video.video
            }))
            setExistingVideos(recipevideos)
            // const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
            // const [steps, setSteps] = useState([{ stepNumber: 1, description: "", photos: [], videos: [] }]);

            // const [stepsPreviews, setStepsPreviews] = useState([{ stepNumber: 1, photos: [], videos: [] }]);
            setIsLoading(false);
        }
    }, [recipeData])

    if (isLoading) {
        return <div>Loading...</div>;
    }



    return (
        <>
            {/* {page === 0 && (<WelcomeForm onNext={handleNext} formValue={formValue} setFormValue={setFormValue} />)
            } */}
            {page === 0 &&
                (<EditRecipeBasicInfo
                    onNext={handleNext}
                    // onPrev={handlePrev}
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
                    recipeData={recipeData}
                    deleteImages={deleteImages}
                    deleteVideos={deleteVideos}
                    setDeleteImages={setDeleteImages}
                    setDeleteVideos={setDeleteVideos}
                    existingImages={existingImages}
                    setExistingImages={setExistingImages}
                    existingVideos={existingVideos}
                    setExistingVideos={setExistingVideos}
                    existingStepImages={existingStepImages}
                    setExistingStepImages={setExistingStepImages}
                    existingStepVideos={existingStepVideos}
                    setExistingStepVideos={setExistingStepVideos}

                />)
            }
            {page === 1 &&
                (<EditRecipeIngredients
                    onNext={handleNext}
                    onPrev={handlePrev}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    setIngredients={setIngredients}
                    ingredients={ingredients}
                />)
            }
            {/* renderIngredients={renderIngredients}
                    deleteIngredient={deleteIngredient}
                    NewIngredient={NewIngredient} */}
            {page === 2 &&
                (<EditRecipeSteps
                    onPrev={handlePrev}
                    formValue={formValue}
                    setFormValue={setFormValue}
                    setSteps={setSteps}
                    steps={steps}
                    // renderSteps={renderSteps}
                    // addStep={addStep}
                    // deleteStep={deleteStep}
                    handleSubmit={handleSubmit}
                    stepsPreviews={stepsPreviews}
                    setStepsPreviews={setStepsPreviews}
                    deleteStepImages={deleteStepImages}
                    deleteStepVideos={deleteStepVideos}
                    setDeleteStepImages={setDeleteStepImages}
                    setDeleteStepVideos={setDeleteStepVideos}
                // setStepsPhotos={setStepsPhotos}
                // setStepsVideos={setStepsVideos}
                // stepsVideos={stepsVideos}
                // stepsPhotos={stepsPhotos}
                />)
            }
        </>
    );

}


export default EditRecipe;