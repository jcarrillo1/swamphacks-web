import React from 'react';
import Slider from 'react-slick';
// import './CarouselContainer.css';

const carouselSettings = {
	// className: "slider variable-width",
	speed: 200,
	slideToShow: 1,
	slidesToScroll: 1,
	adaptiveHeight: true,
// variableWidth: true
};

const CarouselContainer = ({ imageUrls }) => (
  <Slider {...carouselSettings}>
		{imageUrls && imageUrls.map((imageUrl, key) => (
	    <img key={key} src={imageUrl}/>
		))}
  </Slider>
);

export default CarouselContainer;
