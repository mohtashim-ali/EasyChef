import React, { useState, useEffect } from 'react';
import { Button, Tab, Nav, Form, Container, Row, Col, Badge, Card } from 'react-bootstrap';
import { FaBookmark, FaMinusCircle as FaMinus, FaPlusCircle as FaPlus, FaRegBookmark, FaUtensils, FaClipboardList, FaClock, FaUserFriends } from 'react-icons/fa';
import Carousel from 'better-react-carousel'
import { useParams } from 'react-router-dom';
import { AiFillClockCircle, AiOutlineHeart } from 'react-icons/ai';
import { BsFillPersonFill, BsArrowLeft, BsHeartFill, BsBookmark, BsBookmarkFill, BsHeart, BsClockHistory, BsClock, BsUniversalAccessCircle } from 'react-icons/bs'
import './style.css'
// import { FaClock, FaUserFriends } from 'react-icons/fa';
import { IoIosStopwatch } from 'react-icons/io';
import { IconContext } from "react-icons";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';
import axios from "axios";

// import Grid from '@material-ui/core/Grid';

import { Link } from "react-router-dom";

import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
// import Typography from '@mui/material/Typography';
import Typography from '@mui/joy/Typography';

import Avatar from '@mui/material/Avatar';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';


// import Box from '@mui/joy/Box';
// import { Card2 as Card } from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
// import Typography from '@mui/joy/Typography';

// Horizontal scroll image list https://stackoverflow.com/questions/69597992/how-to-implement-horizontal-scrolling-of-tiles-in-mui-gridlist

function RecipeInfo(props) {

    const [recipeData, setRecipeData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [index, setIndex] = useState(0);

    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);
    // const [commentdata, setCommentData] = useState("");

    const MediaUpload = (event) => {
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

    // const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const [value, setValue] = useState(0);

    const setFaveValue = (event, value) => {
        setValue(value)
        axios.post(`http://localhost:8000/recipes/recipe/${recipe_id}/addRating`, {
            "rating": value
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }).then(response => {
            console.log(response.data["total rating"])
            const updatedRecipeData = { ...recipeData, current_rating: response.data.rating, ratings: response.data.total_ratings }
            setRecipeData(updatedRecipeData)

        }).catch(error => {
            console.log(error)
        })
    }

    const handleLikeClick = () => {
        if (liked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setLiked(!liked);
    }

    const user = localStorage.getItem("userid");
    console.log(user)
    const [liked, setLiked] = useState(recipeData.likes && recipeData.likes.some((like) => like.userId === user));

    const handleClick = () => {
        if (liked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setLiked(!liked);
        LikeRecipe();
    };


    const { recipe_id } = useParams();

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    function convertTimeFormat(time) {
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);

        return `${minutes} min`;
    }

    const [bookmarked, setBookmarked] = useState(false);

    const handleBookmarkClick = () => {
        const state = !bookmarked
        setBookmarked(state);
        FaveRecipe(state);
    };

    const addShopping = () => {
        axios.post(`http://localhost:8000/recipes/addToShoppingList/${recipe_id}/servings/1`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }).then(response => {
            if (response.status === 200) {
                alert("Added to Shopping List!")
            }
        })
    }

    const LikeRecipe = () => {
        axios.post(`http://localhost:8000/recipes/${recipe_id}/like/`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
    }

    const FaveRecipe = (status) => {
        axios.post(`http://localhost:8000/recipes/recipe/${recipe_id}/markFavorite`, {
            "favorite": status
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }).then(response => {
            if (response.status === 200) {
                console.log(response.data)
                alert(response.data.key)
            }
        })
    }

    const CommentRecipe = () => {
        axios.post(`http://localhost:8000/recipes/recipe/${recipe_id}/comment`, {
            "comment": review
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }).then(response => {
            if (response.status === 200) {
                const comment_id = response.data.id

                for (let i = 0; i < imageFiles.length; i++) {
                    const formData = new FormData();
                    formData.append('photo', imageFiles[i]);
                    axios.post(`http://localhost:8000/recipes/uploadImage/comment/${comment_id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }).then(response => {
                        if (response.status === 201) {
                            fetch(`http://127.0.0.1:8000/recipes/recipe/info/${recipe_id}`)
                                .then(response => response.json())
                                .then(data => {
                                    setRecipeData(data);
                                    console.log(data.step)
                                    {
                                        data.photos.map((photo) => (
                                            console.log(photo)
                                        ))
                                    }
                                    // setIsLoading(false);
                                })
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
                    axios.post(`http://localhost:8000/recipes/uploadVideo/comment/${comment_id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }).then(response => {
                        if (response.status === 201) {
                            fetch(`http://127.0.0.1:8000/recipes/recipe/info/${recipe_id}`)
                                .then(response => response.json())
                                .then(data => {
                                    setRecipeData(data);
                                    console.log(data.step)
                                    {
                                        data.photos.map((photo) => (
                                            console.log(photo)
                                        ))
                                    }
                                    // setIsLoading(false);
                                })
                        } else {
                            console.log(response);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }

                fetch(`http://127.0.0.1:8000/recipes/recipe/info/${recipe_id}`)
                    .then(response => response.json())
                    .then(data => {
                        setRecipeData(data);
                        console.log(data.step)
                        {
                            data.photos.map((photo) => (
                                console.log(photo)
                            ))
                        }
                        // setIsLoading(false);
                    })

                setImagePreviewUrls([]);
                setVideoFiles([]);
                setImageFiles([]);
                setVideoPreviews([]);
                setReview("");
                alert("Comment Added!")

            }
        })

        // for (let i = 0; i < imageFiles.length; i++) {
        //     const formData = new FormData();
        //     formData.append('photo', imageFiles[i]);
        //     axios.post(`http://localhost:8000/recipes/uploadImage/comment/${comment_id}`, formData, {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem("token")}`,
        //         },
        //     }).then(response => {
        //         if (response.status === 201) {
        //             console.log(response.data);
        //         } else {
        //             console.log(response);
        //         }
        //     }).catch(error => {
        //         console.log(error);
        //     });
        // }

        // for (let i = 0; i < videoFiles.length; i++) {
        //     const formData = new FormData();
        //     formData.append('video', videoFiles[i]);
        //     axios.post(`http://localhost:8000/recipes/uploadVideo/comment/${comment_id}`, formData, {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem("token")}`,
        //         },
        //     }).then(response => {
        //         if (response.status === 201) {
        //             console.log(response.data);
        //         } else {
        //             console.log(response);
        //         }
        //     }).catch(error => {
        //         console.log(error);
        //     });
        // }

        // fetch(`http://127.0.0.1:8000/recipes/recipe/info/${recipe_id}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         setRecipeData(data);
        //         console.log(data.step)
        //         {
        //             data.photos.map((photo) => (
        //                 console.log(photo)
        //             ))
        //         }
        //         // setIsLoading(false);
        //     })
        //     .catch(error => console.error(error));

        // setImagePreviewUrls([]);
        // setVideoFiles([]);
        // setImageFiles([]);
        // setVideoPreviews([]);
        // setReview("");

        // // alert("Comment Added!")
    }

    const itemData = [
        {
            img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
            title: 'Breakfast',
            rows: 2,
            cols: 2,
        },
        {
            img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
            title: 'Burger',
        },
        {
            img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
            title: 'Camera',
        },
        {
            img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
            title: 'Coffee',
            cols: 2,
        },
        {
            img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
            title: 'Hats',
            cols: 2,
        },
        {
            img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
            title: 'Honey',
            author: '@arwinneil',
            rows: 2,
            cols: 2,
        },
        {
            img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
            title: 'Basketball',
        },
        {
            img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
            title: 'Fern',
        },
        {
            img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
            title: 'Mushrooms',
            rows: 2,
            cols: 2,
        },
        {
            img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
            title: 'Tomato basil',
        },
        {
            img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
            title: 'Sea star',
        },
        {
            img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
            title: 'Bike',
            cols: 2,
        },
    ];

    function srcset(image, size, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${size * cols}&h=${size * rows
                }&fit=crop&auto=format&dpr=2 2x`,
        };
    }

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



    // const [liked, setLiked] = useState(false);
    // const [count, setCount] = useState(0);

    // const handleClick = () => {
    //     setLiked(!liked);
    //     setCount(liked ? count - 1 : count + 1);
    // };

    const [active, setActive] = useState(false)

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
                const user = localStorage.getItem("userid");
                // console.log(user)
                console.log(data.owner)
                setLiked(data.likes && data.likes.includes(parseInt(user)));
                setBookmarked(data.favorites && data.favorites.includes(parseInt(user)))
                setLikes(data.likes_count)
                console.log(data.ratingss)
                let userRating = 0;
                for (let x = 0; x < data.ratingss.length; x++) {
                    if (data.ratingss[x].user === parseInt(user)) {
                        userRating = data.ratingss[x].rating
                        break;
                    }
                }
                console.log(userRating)
                setValue(userRating);
                console.log(data.cuisine)
                console.log(data.diet)
                setIsLoading(false);

            })
            .catch(error => console.error(error));
    }, [recipe_id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    {/* <h1>{recipeData.name}</h1>
                    <p>Creator: {recipeData.owner.first_name} {recipeData.owner.last_name}</p> */}
                    <Link to="/search">
                      <Button type="button" variant="outline-dark" className="mb-5 me-1 mt-1"><BsArrowLeft className="mb-1 me-1" />Back</Button>
                    </Link>
                </Col>
                <Col className="d-flex justify-content-end">
                    {/* <Link to={`/recipeinfo/${recipe_id}/edit`}>
                        <Button type="button" variant="outline-primary" className="align-self-end mb-5 me-1 mt-1">Edit Recipe</Button>
                    </Link> */}
                    {(recipeData.owner.id === parseInt(user)) && (
                        <Link to={`/recipeinfo/${recipe_id}/edit`}>
                            <Button type="button" variant="outline-primary" className="align-self-end mb-5 me-1 mt-1">
                                Edit Recipe
                            </Button>
                        </Link>
                    )}
                    {/* <Button type="button" variant="warning" className="align-self-end mb-5 me-1 mt-1">Add to Favourites <FaRegBookmark className="mb-1" /></Button> */}
                    <Button type="button" onClick={addShopping} variant="primary" className="align-self-end mb-5 me-1 mt-1">Add to Shopping List <FaClipboardList className="mb-1" /></Button>
                </Col>
            </Row>
            <Container style={{ borderRadius: 13 }} className="mb-5 p-4 shadow">
                <Row>
                    <Row>
                        <Col>
                            <h1 className="ms-2">{recipeData.name}</h1>
                            <p className="ms-2">By: {recipeData.owner.username}</p>
                            <Container className="d-flex justify-content-start align-items-start">
                                <Rating name="read-only" value={recipeData.current_rating} readOnly />
                                <p className="ms-2">({recipeData.ratings})</p>
                            </Container>
                            {/* <Container className="d-flex justify-content-start align-items-start">
                                <Avatar sx={{ width: 24, height: 24 }} alt="Remy Sharp" src={recipeData.owner.avatar} />
                                <p className="ms-2">{recipeData.owner.first_name} {recipeData.owner.last_name}</p>
                            </Container> */}
                        </Col>
                        {/* <Col className="d-flex justify-content-end">
                            <IconButton className="mb-3" onClick={handleClick}>
                                {liked ? <FavoriteIcon style={{ fontSize: "40px", color: "red" }} /> : <FavoriteBorderIcon style={{ fontSize: "40px" }} />}
                            </IconButton>
                            <IconButton className="mb-3" onClick={handleBookmarkClick}>
                                {bookmarked ? <BookmarkIcon style={{ fontSize: "40px", color: "#ffd700" }} /> : <BookmarkBorderIcon style={{ fontSize: "40px" }} />}
                            </IconButton>
                        </Col> */}

                        <Col className="d-flex justify-content-end">
                            <h5 className="mt-4 pt-2 me-1">Likes: {likes}</h5>
                            {(recipeData.owner.id !== parseInt(user)) && (<>
                            <IconButton className="mb-5" onClick={handleClick}>
                            {liked ? <FavoriteIcon style={{ fontSize: "50px", color: "red" }} /> : <FavoriteBorderIcon style={{ fontSize: "40px" }} />}
                        </IconButton>
                        <IconButton className="mb-5" onClick={handleBookmarkClick}>
                            {bookmarked ? <BookmarkIcon style={{ fontSize: "50px", color: "#ffd700" }} /> : <BookmarkBorderIcon style={{ fontSize: "40px" }} />}
                        </IconButton>
                        </>
                    )}
                            {/* <IconButton className="mb-5" onClick={handleClick}>
                                {liked ? <FavoriteIcon style={{ fontSize: "50px", color: "red" }} /> : <FavoriteBorderIcon style={{ fontSize: "40px" }} />}
                            </IconButton>
                            <IconButton className="mb-5" onClick={handleBookmarkClick}>
                                {bookmarked ? <BookmarkIcon style={{ fontSize: "50px", color: "#ffd700" }} /> : <BookmarkBorderIcon style={{ fontSize: "40px" }} />}
                            </IconButton> */}
                        </Col>
                    </Row>
                    <Row>
                        {/* source: https://reactjsexample.com/react-responsive-carousel-component-with-grid-layout-to-easily-create-a-carousel-like-photo-gallery/ */}
                        <Col>

                            <Carousel centerMode containerStyle={{ maxWidth: '600px', maxHeight: '400px' }} className="alight-items-center" style={{ width: '250px', height: '200px' }} gap={10} loop>

                                {recipeData.photos.map((photo) => (
                                    <Carousel.Item>
                                        <Card component="li" sx={{ minWidth: 600, minHeight: 400 }}>
                                            <CardContent sx={{ background: "black" }}>
                                                <img
                                                    src={"http://localhost:8000" + photo.image}
                                                    // srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2"
                                                    loading="lazy"
                                                    alt=""
                                                    style={{ objectFit: 'contain', maxWidth: '600px', maxHeight: '350px' }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Carousel.Item>
                                ))}
                                {recipeData.videos.map((video) => (
                                    <Carousel.Item>
                                        <Card className="text-center" sx={{ minWidth: 600, minHeight: 400 }}>
                                            <Card.Body style={{ background: "black" }}>
                                                <video style={{ objectFit: 'contain', maxWidth: '600px', maxHeight: '350px' }} controls>
                                                    <source src={"http://127.0.0.1:8000" + video.video} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </Card.Body>
                                        </Card>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Col>
                        <Col>
                            {/* <Row className="text-center">
                                <p className="lead">{recipeData.description}</p>
                            </Row> */}
                            <Row className="text-center">
                                <Container style={{ height: '200px', overflow: 'scroll', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* <p className="lead">{recipeData.description}</p> */}
                                    <p className="lead" style={{ fontStyle: 'italic', quotes: '\u201C' + ' ' + '\u201D' }}>&ldquo;{recipeData.description}&rdquo;</p>
                                </Container>
                            </Row>
                            <Row className="text-center">
                                <div className="d-flex justify-content-between w-55 mt-5">
                                    <Col className="text-center">
                                        <p><BsClockHistory className="icon" /></p>
                                        <h5>Prep Time</h5>
                                        <p>{recipeData.prep_time}</p>
                                    </Col>
                                    <Col className="text-center">
                                        <p><AiFillClockCircle className="icon" /></p>
                                        <h5>Cook Time</h5>
                                        <p>{recipeData.cooking_time}</p>
                                    </Col>
                                    <Col className="text-center">
                                        <p><BsFillPersonFill className="icon" /></p>
                                        <h5>Servings</h5>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <p><FaMinus className="me-1 mt-1" /></p>
                                            <h6>{recipeData.serving}</h6>
                                            <p><FaPlus className="ms-1 mt-1" /></p>
                                        </div>
                                    </Col>
                                </div>
                            </Row>
                        </Col>

                        {/* <Col>
                    <p><AiFillClockCircle className="mb-1"/> {convertTimeFormat(recipeData.cooking_time)}</p>
                    <p><FaUtensils className="mb-1"/> {convertTimeFormat(recipeData.prep_time)}</p>
                </Col> */}
                    </Row>
                </Row>
            </Container>
            {/* <Row>
                <Container className="shadow p-3 mx-3 mb-5" style={{ borderRadius: 15, width: "98%" }}>
                    <h4>Tags: </h4>
                </Container>
            </Row> */}
            <Row>
                <Container className="d-flex justify-content-start shadow p-3 mx-3 mb-5" style={{ borderRadius: 15, width: "98%" }}>
                    <Col xs={1}>
                        <h4>Tags:</h4>
                    </Col>
                    <Col xs={11}>
                        <span key={index} className="badge bg-primary mx-1 mt-2">{recipeData.cuisine}</span>
                        {recipeData.diet.map((dietItem, index) => (
                            <span key={index} className="badge bg-secondary mx-1 mt-2">{dietItem.value}</span>
                        ))}
                    </Col>
                </Container>
            </Row>

            {recipeData.base_recipe && (
                <Row className="d-flex justify-content-center">
                    <Container className="shadow p-3 mx-2 mb-5" style={{ borderRadius: 15, width: "30%" }}>
                        <h4>Base Recipe</h4>
                        <p>This recipe was inspired by {recipeData.base_recipe.name}. Click below to view the original recipe!</p>
                        <Container className="text-center">
                            <Link to={`/recipeinfo/${recipeData.base_recipe.id}`}>
                                <Button variant="outline-success">View Base Recipe</Button>
                            </Link>
                        </Container>
                    </Container>
                </Row>
            )
            }

            {/* <Row>
                <Col>
                    <p>Description: {recipeData.description}</p>
                </Col>
            </Row> */}
            {/* <Row>
                <Col>
                    <p><AiFillClockCircle className="mb-1"/> {convertTimeFormat(recipeData.cooking_time)}</p>
                    <p><FaUtensils className="mb-1"/> {convertTimeFormat(recipeData.prep_time)}</p>
                </Col>
            </Row> */}
            {/* <Row>
                <Col>
                    <h2>Ingredients</h2>
                    <ul>
                        <li>Ingredient 1</li>
                        <li>Ingredient 2</li>
                        <li>Ingredient 3</li>
                        ...
                    </ul>
                </Col>
            </Row> */}
            {/* <Row>
                <Col className="col-8">
                    <h2>Steps</h2>
                    {recipeData.step.map((step, index) => (
                        <div style={{ borderRadius: 13 }} className="px-3 py-3 mb-4 shadow">
                            <Row>
                                <Col xs={8} className="step-description mb-2">
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <h4>{index + 1}.</h4>
                                        <div style={{ marginLeft: "10px" }}><p className="mt-2" style={{ fontSize: "18px" }}>{step.description}</p></div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <Carousel centerMode containerStyle={{ width: '270px', height: '150px' }} className="alight-items-center" style={{ width: '250px', height: '200px' }} gap={10} loop>
                                        <Carousel.Item>
                                            <img style={{ maxWidth: '600px', height: '150px' }} src="https://www.foodandwine.com/thmb/Wd4lBRZz3X_8qBr69UOu2m7I2iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg" />
                                        </Carousel.Item>
                                    </Carousel>
                                </Col>
                            </Row>
                        </div>
                    ))}
                </Col>
                <Col className="col-4">
                    <h2>Ingredients</h2>
                    <ul>
                        {recipeData.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.quantity} quantity of {ingredient.ingredient.ingredient_name}
                            </li>
                        ))}
                    </ul>
                </Col>
            </Row> */}
            {/* <Row>
                <Col>
                    <Col>
                        <h2>Steps</h2>
                        <ol>
                        {recipeData.step.map((step, index) => (
                            <li key={index}>
                                {step.description}
                            </li>
                        ))}
                        </ol>
                    </Col>
                </Col>
            </Row> */}
            <div className="product-info-tabs mb-5">
                <Tab.Container id="myTab" defaultActiveKey="description">
                    <Row>
                        <Col>
                            <Nav variant="tabs">
                                <Nav.Item>
                                    <Nav.Link eventKey="description">Description</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="comment">Reviews</Nav.Link>
                                </Nav.Item>
                                {/* <Nav.Item>
                                    <Nav.Link eventKey="review">Review</Nav.Link>
                                </Nav.Item> */}
                            </Nav>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Tab.Content>
                                <Tab.Pane eventKey="description">
                                    <Row className="p-3">
                                        <Col className="col-8">
                                            <h2>Steps</h2>
                                            {/* <ol> */}
                                            {recipeData.step.map((step, index) => (
                                                <div style={{ borderRadius: 13 }} className="px-3 py-3 mb-4 shadow">
                                                    {/* <li key={index}> */}
                                                    <Row>
                                                        {/* <Col xs={8} className="step-description mb-2"><h4>{index + 1}.</h4> {step.description}</Col> */}
                                                        <Col xs={8} className="step-description mb-2">
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <h4>{index + 1}.</h4>
                                                                <div style={{ marginLeft: "10px" }}><p className="mt-2" style={{ fontSize: "18px" }}>{step.description}</p></div>
                                                            </div>
                                                        </Col>
                                                        {step.photos.length > 0 || step.videos.length > 0 && (
                                                            <Col xs={4}>
                                                                <Carousel centerMode containerStyle={{ width: '270px', height: '150px' }} className="alight-items-center" style={{ width: '250px', height: '200px' }} gap={10} loop>
                                                                    {step.photos.map((photo) => (
                                                                        <Carousel.Item>
                                                                            <Card component="li" sx={{ minWidth: 600, minHeight: 400 }}>
                                                                                <CardContent sx={{ background: "black" }}>

                                                                                    <img
                                                                                        src={"http://localhost:8000" + photo.photo}
                                                                                        // srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2"
                                                                                        loading="lazy"
                                                                                        alt=""
                                                                                        style={{ objectFit: 'contain', maxWidth: '270px', maxHeight: '150px' }}
                                                                                    />
                                                                                </CardContent>
                                                                            </Card>
                                                                        </Carousel.Item>
                                                                    ))}
                                                                    {step.videos.map((video) => (
                                                                        <Carousel.Item>
                                                                            <Card component="li" sx={{ minWidth: 600, minHeight: 400 }}>
                                                                                <CardContent sx={{ background: "black" }}>
                                                                                    <video style={{ objectFit: 'contain', maxWidth: '250px', maxHeight: '150px' }} controls>
                                                                                        <source src={"http://127.0.0.1:8000" + video.video} type="video/mp4" />
                                                                                        Your browser does not support the video tag.
                                                                                    </video>
                                                                                </CardContent>
                                                                            </Card>
                                                                        </Carousel.Item>
                                                                    ))}
                                                                </Carousel>
                                                            </Col>
                                                        )}
                                                        {/* <Col xs={4}>
                                                            <Carousel centerMode containerStyle={{ width: '270px', height: '150px' }} className="alight-items-center" style={{ width: '250px', height: '200px' }} gap={10} loop>
                                                                {step.photos.map((photo) => (
                                                                    <Carousel.Item>
                                                                        <Card component="li" sx={{ minWidth: 600, minHeight: 400 }}>
                                                                            <CardContent sx={{ background: "black" }}>

                                                                                <img
                                                                                    src={"http://localhost:8000" + photo.photo}
                                                                                    // srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2"
                                                                                    loading="lazy"
                                                                                    alt=""
                                                                                    style={{ objectFit: 'contain', maxWidth: '270px', maxHeight: '150px' }}
                                                                                />
                                                                            </CardContent>
                                                                        </Card>
                                                                    </Carousel.Item>
                                                                ))}
                                                                {step.videos.map((video) => (
                                                                    <Carousel.Item>
                                                                        <Card component="li" sx={{ minWidth: 600, minHeight: 400 }}>
                                                                            <CardContent sx={{ background: "black" }}>
                                                                                <video style={{ objectFit: 'contain', maxWidth: '250px', maxHeight: '150px' }} controls>
                                                                                    <source src={"http://127.0.0.1:8000" + video.video} type="video/mp4" />
                                                                                    Your browser does not support the video tag.
                                                                                </video>
                                                                            </CardContent>
                                                                        </Card>
                                                                    </Carousel.Item>
                                                                ))}
                                                            </Carousel>
                                                        </Col> */}
                                                    </Row>
                                                    {/* </li> */}
                                                </div>
                                            ))}
                                            {/* </ol> */}
                                        </Col>
                                        <Col className="col-4">
                                            <h2>Ingredients</h2>
                                            <ul>
                                                {recipeData.ingredients.map((ingredient, index) => (
                                                    <li key={index}>
                                                        {ingredient.quantity}g of {ingredient.ingredient.ingredient_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Col>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="comment">
                                    <Container className="p-3">
                                        <h3>Comments</h3>
                                        {/* <Container> */}
                                        {recipeData.comments.length > 0 ? (
                                            <List
                                                aria-labelledby="ellipsis-list-demo"
                                                sx={{ '--ListItemDecorator-size': '56px', overflowY: "scroll", height: "400px" }}
                                            >
                                                {recipeData.comments.map((comment) => (
                                                    <ListItem className="shadow mb-2 py-3 mx-3">
                                                        <ListItemDecorator sx={{ alignSelf: 'flex-start' }}>
                                                            <Avatar src={comment.user.avatar} />
                                                        </ListItemDecorator>
                                                        <ListItemContent className="d-flex">
                                                            <Container classname="mt-4">
                                                                <Typography>{comment.user.first_name} {comment.user.last_name}</Typography>
                                                                <Typography level="body2" noWrap>
                                                                    {comment.comment}
                                                                </Typography>
                                                            </Container>
                                                            {(comment.photos.length > 0 || comment.videos.length > 0) && (
                                                                <Container className="mt-3" style={{ marginLeft: 550 }}>
                                                                    <Carousel centerMode containerStyle={{ maxWidth: '450px', maxHeight: '200px' }} className="alight-items-center" style={{ width: '250px', height: '200px' }} gap={10} loop>

                                                                        {comment.photos.map((photo) => (
                                                                            <Carousel.Item>
                                                                                <Card component="li" sx={{ minWidth: 450, minHeight: 150 }}>
                                                                                    <CardContent sx={{ background: "black" }}>
                                                                                        <img
                                                                                            src={"http://localhost:8000" + photo.photo}
                                                                                            // srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2"
                                                                                            loading="lazy"
                                                                                            alt=""
                                                                                            style={{ objectFit: 'contain', maxWidth: '450px', maxHeight: '150px' }}
                                                                                        />
                                                                                    </CardContent>
                                                                                </Card>
                                                                            </Carousel.Item>
                                                                        ))}
                                                                        {comment.videos.map((video) => (
                                                                            <Carousel.Item>
                                                                                <Card className="text-center" sx={{ minWidth: 450, minHeight: 150 }}>
                                                                                    <Card.Body style={{ background: "black" }}>
                                                                                        <video style={{ objectFit: 'contain', maxWidth: '450px', maxHeight: '150px' }} controls>
                                                                                            <source src={"http://127.0.0.1:8000" + video.video} type="video/mp4" />
                                                                                            Your browser does not support the video tag.
                                                                                        </video>
                                                                                    </Card.Body>
                                                                                </Card>
                                                                            </Carousel.Item>
                                                                        ))}
                                                                    </Carousel>
                                                                </Container>

                                                            )}
                                                        </ListItemContent>
                                                        {/* <Grid item xs={3}> */}
                                                        {/* </Grid> */}
                                                    </ListItem>
                                                ))}

                                            </List>) : (<h6>Be the first to comment!</h6>)}
                                        {/* </Container> */}
                                        {/* <p className="mb-20">There are no reviews yet.</p> */}
                                        {(recipeData.owner.id !== parseInt(user)) && (
                                        <Form className="review-form mt-3">
                                            <Form.Group>
                                                {/* <Form.Label>Your rating</Form.Label> */}
                                                <h5>Your Rating</h5>
                                                <div className="reviews-counter">
                                                    <div className="rate">
                                                        <Rating
                                                            name="simple-controlled"
                                                            value={value}
                                                            onChange={(event, newValue) => {
                                                                setFaveValue(event, newValue);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </Form.Group>
                                            <Form.Group className="mt-3">
                                                <h5>New Comment</h5>
                                                <Form.Label>Message</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    value={review}
                                                    onChange={(e) => setReview(e.target.value)}
                                                />
                                                <Form.Label className="mt-2">Images & Videos</Form.Label>
                                                {imagePreviewUrls.length > 0 || videoPreviews.length > 0 ? (
                                                    <Carousel centerMode containerStyle={{ maxWidth: '1200px', maxHeight: '200px' }} className="alight-items-center" style={{ width: '250px', height: '200px' }} gap={10} cols={3} loop>

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
                                                ) : ((<p className="text-muted">No images or videos to display.</p>))}
                                                <Container className="text-center mt-2">
                                                    <Button variant="primary" onClick={() => document.querySelector('input[type="file"]').click()}>
                                                        Upload
                                                        <input type="file" multiple accept="image/*, video/*" onChange={(e) => MediaUpload(e)} hidden />
                                                    </Button>
                                                </Container>
                                            </Form.Group>
                                            <Button variant="primary" onClick={CommentRecipe} className="mt-2">
                                                Submit Comment
                                            </Button>
                                        </Form>
                                                            )}
                                    </Container>
                                </Tab.Pane>
                                <Tab.Pane eventKey="review">
                                    <Container className="p-3">
                                        <h3>Review</h3>
                                    </Container>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        </Container >

    );
}

export default RecipeInfo;
