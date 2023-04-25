import React from 'react';
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Table, Navbar, Nav, NavDropdown, Container, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Form } from 'react-bootstrap';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import { FcCheckmark } from "react-icons/fc";
import Typography from '@mui/joy/Typography';

import ShoppingListRecipe from '../../components/ShoppingListRecipe';
import { AiOutlineShoppingCart } from "react-icons/ai";

// import './style.css'

// function NewIngredient() {
//     console.log("works");
// }

// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById("addingredient").addEventListener('click', NewIngredient);
// });

const ShoppingList = () => {
    // document.body.style.backgroundColor = "#E8E8E8";

    const [items, setItems] = useState([]);
    const [itemsPage, setItemsPage] = useState(1);
    // const [moreMHcards, setMoreMHcards] = useState(true);

    const [ingredients, setIngredients] = useState([]);
    const [moreItems, setMoreItems] = useState(true);

    function changeServings(item, servings) {
        // axios.patch(`http://127.0.0.1:8000/recipes/shoppingList/${item}/updateServingsTo/${servings}`, {
        //     headers: {
        //         Authorization: `Bearer ${localStorage.getItem("token")}`,
        //     }
        // })
        const fd = new FormData();
        fd.append('_method', 'PATCH');
        axios.patch(`http://127.0.0.1:8000/recipes/shoppingList/${item}/updateServingsTo/${servings}`, fd, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })

            .then(response => {
                if (response.status === 200) {
                    fetch(`http://127.0.0.1:8000/recipes/shoppingList/`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            // setMHCards([...MHcards, ...data.results]);
                            console.log(data.ingredients)
                            setIngredients(data.ingredients)
                            // if (!data.next) {
                            //   setMoreMHcards(false);
                            // }
                        })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    function removeRecipe(item) {
        // axios.patch(`http://127.0.0.1:8000/recipes/shoppingList/${item}/updateServingsTo/${servings}`, {
        //     headers: {
        //         Authorization: `Bearer ${localStorage.getItem("token")}`,
        //     }
        // })
        fetch(`http://127.0.0.1:8000/recipes/removeFromShoppingList/${item}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
          }).then(response => {
                if (response.status === 200) {
                    fetch(`http://127.0.0.1:8000/recipes/shoppingList/`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            // setMHCards([...MHcards, ...data.results]);
                            console.log(data.ingredients)
                            setIngredients(data.ingredients)
                            setItems(data.recipes)
                            // if (!data.next) {
                            //   setMoreMHcards(false);
                            // }
                        })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }



    function retriveShoppingList() {
        fetch(`http://localhost:8000/recipes/shoppingList/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                // setMHCards([...MHcards, ...data.results]);
                console.log(data.recipes)
                setItems(data.recipes)
                setIngredients(data.ingredients)
                // if (!data.next) {
                //   setMoreMHcards(false);
                // }
            })
    }

    useEffect(() => {
        retriveShoppingList();
    }, [itemsPage]);


    return (
        <>
            <Container style={{ height: '80vh', background: "white", borderRadius: 15 }} className="justify-content-center align-items-start my-5 px-5 shadow">
                <Row className="mt-5 pt-5">
                    <Col>
                        <h1>Shopping List <AiOutlineShoppingCart className="mb-1"/></h1>
                        <h6 className="ms-1 font-weight-light grey-color">
                            {items.length} Recipe(s) in Shopping List
                        </h6>
                    </Col>
                    {/* <Col className="d-flex justify-content-end">
                        <Button type="button" variant="primary" className="align-self-end mb-5 me-1 mt-1">Back</Button>
                    </Col> */}
                </Row>
                <hr/>
                <Row>
                    <Col className="col-8">
                        <h2>Recipes</h2>
                        {/* <p>Click on a recipe to filter ingredients</p> */}
                        <div className="mt-3" style={{ height: '55vh', overflowY: "scroll" }}>
                            {items.map(item => (
                                <ShoppingListRecipe
                                    image={item.recipe.photos[0].image}
                                    title={item.recipe.name}
                                    description="This is a delicious recipe that you'll love."
                                    onRemove={removeRecipe}
                                    changeServings={changeServings}
                                    retriveShoppingList={retriveShoppingList}
                                    recipeID={item.recipe.id}
                                    servings={item.servings}
                                />
                            ))}
                        </div>

                    </Col>
                    <Col>
                        <h2>Ingredients</h2>
                        <List aria-labelledby="basic-list-demo">
                            {ingredients.map(ingredient => (
                                <ListItem key={ingredient.id} style={{ fontSize: '18px' }}>
                                    <FcCheckmark style={{ fontSize: '24px', marginRight: '10px' }} />
                                    {ingredient.quantity}g of {ingredient.ingredient.ingredient_name}
                                </ListItem>
                            ))}
                        </List>
                    </Col>
                </Row>
            </Container>
        </>
    );

}


export default ShoppingList;