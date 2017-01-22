import React from 'react';
import { Carousel, Image } from 'react-bootstrap';
import './CarouselContainer.css';

const CarouselContainer = ({ imageUrls }) => (
  <Carousel>
		{imageUrls && imageUrls.map((imageUrl, key) => (
			<Carousel.Item key={key} >
	      <Image width={700} height={500} alt="900x500" src={imageUrl}/>
	    </Carousel.Item>
		))}
  </Carousel>
);

export default CarouselContainer;
