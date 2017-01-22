import React, { Component } from 'react';
import Sound from 'react-sound';
import Clarifai from 'clarifai';
import axios from 'axios';
import { Button,
         InputGroup,
         ControlLabel,
         FormGroup,
         Col,
         Panel,
         Row} from 'react-bootstrap';
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
		this.setState({ queryUrl: '', fetching: true });
		this.props.api.models.predict(Clarifai.GENERAL_MODEL, queryUrl)
			.then(response => {
				const { concepts } = response.outputs[0].data;
				return concepts.map(concept => concept.name);
			})
			.then(concepts => {
				const searchUrl = `http://api.giphy.com/v1/gifs/search?q=${concepts[0]}+${concepts[1]}+${concepts[2]}+meme&api_key=dc6zaTOxFJmzC `
				console.log(searchUrl);
				axios.get(searchUrl)
					.then(response => response.data.data)
					.then(data => data.map(objs => objs.images.original.url))
					.then(urls => {
						axios.get('https://api.spotify.com/v1/search', {
							params: {
								q: `${concepts[0]}`,
								type: 'track',
							}
						})
							.then(result => result.data.tracks)
							.then(tracks => {
								let trackUrl = '';
								const { items } = tracks;
								if (items && items.length > 0) {
									trackUrl = items[0].preview_url;
								}
								this.setState({
									trackUrl,
									fetching: false,
									imageUrls: urls.slice(0, 10),
								});
							})
							.catch(err => {
								console.log(err);
								this.setState({
									fetching: false,
									error: true,
								})
							})
					})
					.catch(err => {
						console.log('error in giphy');
						this.setState({
							fetching: false,
							error: true,
						})
					})
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
                     <Col xs={6}>
                        <ControlLabel>Enter URL</ControlLabel>
                        <InputGroup>
            					<FormInput
            						label="Image Url"
            						id="imageSearch"
            						value={this.state.queryUrl}
            						onChange={this.onChange}
            					/>
                           <InputGroup.Addon className="btn-wrapper">
            					<Button
            						bsStyle="primary"
            						type="submit"
            						disabled={this.state.fetching}
            					>
            						Search Gifs
            					</Button></InputGroup.Addon>
                        </InputGroup>
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
