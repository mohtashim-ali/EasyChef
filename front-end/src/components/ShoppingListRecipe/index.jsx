import { Card, Button, Col, Row, Image } from 'react-bootstrap';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaBookmark, FaMinusCircle as FaMinus, FaPlusCircle as FaPlus, FaRegBookmark, FaUtensils, FaClipboardList, FaClock, FaUserFriends } from 'react-icons/fa';

function ShoppingListRecipe(props) {
  console.log(props)
  const [servings, setServings] = useState(props.servings);

  // const increaseServings = () => {
  //   setServings(servings + 1);
  //   props.changeServings(props.recipeID, servings)
  // };

  // const decreaseServings = () => {
  //   setServings(Math.max(servings - 1, 1));
  //   props.changeServings(props.recipeID, servings)
  // };

  const increaseServings = () => {
    const newServings = servings + 1;
    setServings(newServings);
    props.changeServings(props.recipeID, newServings);
  };
  
  const decreaseServings = () => {
    const newServings = Math.max(servings - 1, 1);
    setServings(newServings);
    props.changeServings(props.recipeID, newServings);
  };

  const removeItem = () => {
    props.onRemove(props.recipeID)
  }

  return (
    <Card className=" mb-3 shadow-sm" style={{ width: "750px" }}>
      <Row className="align-items-center">
        {/* <Col xs={4}>
          <Image src={props.image} thumbnail style={{objectFit: "cover"}}/>
        </Col> */}
        <Col xs={4} style={{ width: "200px" }}>
          <Image src={props.image} thumbnail style={{ objectFit: "cover", height: "150px", width: "200px" }} />
        </Col>
        <Col xs={6} className="text-start">
          <Card.Title>{props.title}</Card.Title>
          <div className="d-flex">
            <Card.Text className="mt-2 me-2">Servings: </Card.Text>
            <div className="d-flex justify-content-center align-items-center">
              <IconButton className="mb-3" onClick={decreaseServings}><FaMinus fontSize="inherit"/></IconButton>
              <Card.Text>{servings}</Card.Text>
              <IconButton className="mb-3" onClick={increaseServings}><FaPlus fontSize="inherit"/></IconButton>
            </div>
          </div>
        </Col>
        <Col xs={2} className="text-center">
          <IconButton aria-label="delete">
            <DeleteIcon onClick={removeItem} fontSize="inherit" />
          </IconButton>
        </Col>
      </Row>
    </Card>
  );
}

export default ShoppingListRecipe;