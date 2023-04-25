import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import RecipeCard from '../../components/RecipeCard';
import Carousel from 'better-react-carousel'

function MyRecipes() {

  // document.body.style.backgroundColor = "#E8E8E8";


  // const [myRecipeData, setMyRecipeData] = useState({});
  // const [myFaveData, setMyFaveData] = useState({});
  // const [myHistoryData, setMyHistoryData] = useState({});
  // const [isLoading, setIsLoading] = useState(true);

  // const [myRecipePage, setRecipePage] = useState(1)

  const [MFcards, setMFCards] = useState([]);
  const [MFpage, setMFPage] = useState(1);
  const [moreMFcards, setMoreMFcards] = useState(true);

  const [MRcards, setMRCards] = useState([]);
  const [MRpage, setMRPage] = useState(1);
  const [moreMRcards, setMoreMRcards] = useState(true);

  const [MHcards, setMHCards] = useState([]);
  const [MHpage, setMHPage] = useState(1);
  const [moreMHcards, setMoreMHcards] = useState(true);

  // useEffect(() => {
  //   retreiveMyFave();
  //   retriveMyRecipe();
  //   retriveMyHistory ()
  // }, [MFpage, MRpage, MHpage]);

  useEffect(() => {
    retreiveMyFave();
  }, [MFpage]);

  useEffect(() => {
    retriveMyRecipe();
  }, [MRpage]);

  useEffect(() => {
    retriveMyHistory();
  }, [MHpage]);

  function retriveMyHistory() {
    fetch(`http://localhost:8000/recipes/myHistory/?page=${MHpage}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        setMHCards([...MHcards, ...data.results]);
        console.log(data.results)
        if (!data.next) {
          setMoreMHcards(false);
        }
      })
  }

  function retriveMyRecipe() {
    fetch(`http://localhost:8000/recipes/myRecipe?page=${MRpage}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        setMRCards([...MRcards, ...data.results]);
        console.log(data.results)
        // console.log(MRcards)
        // if (data.next){
        //   myrecipepage++;
        //   retreiveMyRecipe();
        // }
        if (!data.next) {
          setMoreMRcards(false);
        }
      })
  }

  function retreiveMyFave() {
    fetch(`http://localhost:8000/recipes/myFavorite/?page=${MFpage}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        setMFCards([...MFcards, ...data.results]);
        console.log(data.results)
        // console.log(MRcards)
        // if (data.next){
        //   myrecipepage++;
        //   retreiveMyRecipe();
        // }
        if (!data.next) {
          setMoreMFcards(false);
        }
      })
      .catch(error => {
        console.error("Error getting data", error)
      })
  }

  const loadMoreMFCards = () => {
    setMFPage(prevPage => prevPage + 1);
  };

  const loadMoreMRCards = () => {
    setMRPage(prevPage => prevPage + 1);
  };

  const loadMoreMHCards = () => {
    setMHPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <Container className="mt-5">
        <h1 className="text-start"><span style={{ color: 'green' }}>My</span>Creations</h1>
        <h6>Recipes you have created.</h6>
        <Container style={{ height: "50vh", borderRadius: 15, backgroundColor: "white" }} className="d-flex flex-column justify-content-center align-items-center shadow">
          <Row>
            {MRcards.length > 0 && (
              <Carousel centerMode showDots containerStyle={{ width: '1250px', height: '380px' }} className="alight-items-center ms-3 mt-1" style={{ width: '250px', height: '200px' }} cols={4} rows={1} gap={5} loop>
                {MRcards.map(card => {
                  return (
                    <Carousel.Item id="card.id">
                      <RecipeCard
                        title={card.name}
                        rating={card.ratings}
                        servings={card.serving}
                        time={card.cooking_time}
                        likes={6}
                        image={card.photos[0].image}
                      />
                    </Carousel.Item>
                  );
                })}
                {MRcards.length > 0 && moreMRcards ? (
                  <Carousel.Item>
                    <Container style={{ height: "35vh" }} className="d-flex justify-content-center align-items-center">
                      <Button variant="success" onClick={loadMoreMRCards}>Load More</Button>
                    </Container>
                  </Carousel.Item>

                ) : null}

              </Carousel>
            )}

          </Row>
        </Container>
      </Container>
      <Container className="mt-5">
        <h1 className="text-start"><span style={{ color: 'green' }}>My</span>Favorites</h1>
        <h6>Recipes you marked as favorite.</h6>
        <Container style={{ height: "50vh", borderRadius: 15, backgroundColor: "white" }} className="d-flex flex-column justify-content-center align-items-center shadow">
          <Row>
            {MFcards.length > 0 && (
              <Carousel centerMode showDots containerStyle={{ width: '1250px', height: '380px' }} className="alight-items-center ms-3 mt-1" style={{ width: '250px', height: '200px' }} cols={4} rows={1} gap={5} loop>
                {MFcards.map(card => {
                  return (
                    <Carousel.Item id="card.id">
                      <RecipeCard
                        title={card.recipe.name}
                        rating={card.recipe.ratings}
                        servings={card.recipe.serving}
                        time={card.recipe.cooking_time}
                        likes={6}
                        image={card.recipe.photos[0].image}
                      />
                    </Carousel.Item>
                  );
                })}
                {MFcards.length > 0 && moreMFcards ? (
                  <Carousel.Item>
                    <Container style={{ height: "35vh" }} className="d-flex justify-content-center align-items-center mt-2">
                      <Button variant="success" onClick={loadMoreMFCards}>Load More</Button>
                    </Container>
                  </Carousel.Item>

                ) : null}

              </Carousel>
            )}
          </Row>
        </Container>
      </Container>
      <Container className="mt-5 mb-5">
        <h1 className="text-start"><span style={{ color: 'green' }}>My</span>Interactions</h1>
        <h6>Recipes you liked, created, commented on, and rated.</h6>
        <Container style={{ height: "50vh", borderRadius: 15, backgroundColor: "white" }} className="d-flex flex-column justify-content-center align-items-center shadow">
          <Row>
            {MHcards.length > 0 && (
              <Carousel centerMode showDots containerStyle={{ width: '1250px', height: '380px' }} className="alight-items-center ms-3 mt-1" style={{ width: '250px', height: '200px' }} cols={4} rows={1} gap={5} loop>
                {MHcards.map(card => {
                  return (
                    <Carousel.Item id="card.id">
                      <RecipeCard
                        title={card.recipe.name}
                        rating={card.recipe.ratings}
                        servings={card.recipe.serving}
                        time={card.recipe.cooking_time}
                        likes={6}
                        image={card.recipe.photos[0].image}
                      />
                    </Carousel.Item>
                  );
                })}
                {MHcards.length > 0 && moreMHcards ? (
                  <Carousel.Item>
                    <Container style={{ height: "35vh" }} className="d-flex justify-content-center align-items-center">
                      <Button variant="success" onClick={loadMoreMHCards}>Load More</Button>
                    </Container>
                  </Carousel.Item>

                ) : null}

              </Carousel>
            )}
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default MyRecipes;
