import React from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './style.css'

import Rating from '@mui/material/Rating';

import { AiFillHeart, AiOutlineClockCircle } from "react-icons/ai"

import { FaUtensils } from "react-icons/fa"

function RecipeCard({ title, rating, servings, time, likes, link, image }) {

  function convertTimeFormat(time) {
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    return `${minutes} min`;
}
  // const { title, rating, servings, time, likes } = props;
  return (
    // boxShadow: "0 0 88px 0 rgba(0, 0, 0, 0.1607843137254902)"
    <a href={link} style={{textDecoration: "none"}}>
    <div className="shadow ft-recipe my-4 ms-3" style={{ width: "250px", height: "330px", background: "var(--white)", display: "flex", flexDirection: "column", borderRadius: 15 }}>
      <div className="ft-recipe__thumb" style={{ position: "relative", height: "100px", borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
        <img src={image} alt={`${title}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", borderTopLeftRadius: 15, borderTopRightRadius: 15 }} />
      </div>
      <div className="ft-recipe__content" style={{ flex: 1, padding: "0 2em 1em" }}>
        <header className="content__header">
          {/* borderBottom: "1px solid #d8d8d8" */}
          <div className="row-wrapper" style={{ display: "flex", flexDirection: "column", padding: ".55em 0 .3em", borderBottom: "1px solid #d8d8d8" }}>
            <h5 className="recipe-title" style={{ fontFamily: "var(--headlinesFont)", fontWeight: 600 }}>{title}</h5>
          </div>
        </header>
        <div className="mt-1" id="ratings">
          <Rating name="read-only" value={rating} readOnly />
        </div>
        <div className="ms-1 mt-2">
          <h6><FaUtensils /> {servings} servings</h6>
          <h6><AiOutlineClockCircle className="mb-1" /> {time}</h6>
          <h6><AiFillHeart className="mb-1" /> {likes} likes</h6>
        </div>
      </div>
    </div>
    </a>
  );
}

export default RecipeCard;