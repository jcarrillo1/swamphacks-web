import React from 'react';
import {
	Grid,
	Row,
	Col,
	Image,
} from 'react-bootstrap';
import './ImageContainer.css';

const ImageContainer = ({ imageUrl }) => (
	<Grid className="imageContainer">
		<Row>
			<Col xs={12} md={12}>
				<Image src={imageUrl} />
			</Col>
		</Row>
	</Grid>
);

export default ImageContainer;
