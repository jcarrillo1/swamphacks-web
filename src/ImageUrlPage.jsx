import React, { Component } from 'react';
import Sound from 'react-sound';
import Clarifai from 'clarifai';
import {
	Button,
	ControlLabel,
	FormGroup,
	Col,
	Panel,
	Row,
} from 'react-bootstrap';
import {
	giphySearch,
	spotifySearch,
} from './api';
import CarouselContainer from './CarouselContainer';
import FormInput from './FormInput';

class ImageUrlPage extends Component {
  state = {
		imageUrls: [],
		trackUrl: '',
		queryUrl: '',
		fetching: false,
		results: [],
		error: false,
	}
	onChange = (e) => {
		e.preventDefault();
		this.setState({
			error: false,
			queryUrl: e.target.value,
		});
	}
	onSubmit = (e) => {
		e.preventDefault();
		const { queryUrl } = this.state;
		this.setState({
			queryUrl: '',
			fetching: true,
			trackUrl: '',
			imageUrls: [],
			results: [],
			error: false,
		});
		this.props.api.models.predict(Clarifai.GENERAL_MODEL, queryUrl)
			.then(response => {
				const { concepts } = response.outputs[0].data;
				return concepts.map(concept => concept.name);
			})
			.then(async (concepts) => {
				const trackUrl = await spotifySearch(concepts);
				const imageUrls = await giphySearch(concepts);
				this.setState({
					trackUrl,
					fetching: false,
					imageUrls: imageUrls.slice(0, 10),
				});
			})
			.catch(err => {
				console.log(err);
				this.setState({
					fetching: false,
					error: true,
				})
			});
	}
	render() {
		const { imageUrls, trackUrl } = this.state;
		return (
			<div>
            <Row className="inputRow">
   				<form onSubmit={this.onSubmit}>
                  <FormGroup>
                     <Col md={6}>
                        <ControlLabel>Enter URL</ControlLabel>
            					<FormInput
            						label="Image Url"
            						id="imageSearch"
            						value={this.state.queryUrl}
            						onChange={this.onChange}
            					/>
            					<Button
												className="fileUploadImg"
            						bsStyle="primary"
            						type="submit"
            						disabled={this.state.fetching || !this.state.queryUrl}
            					>
            						Search Gifs
            					</Button>
                     </Col>
                  </FormGroup>
   				</form>
            </Row>
            {imageUrls && imageUrls.length > 0 && <Row>
   				<Panel><CarouselContainer imageUrls={imageUrls} /></Panel>
				</Row>}
				{trackUrl && (
					<Sound
						url={trackUrl}
						playStatus={Sound.status.PLAYING}
					/>
				)}
			</div>
		);
	}
}

export default ImageUrlPage;
