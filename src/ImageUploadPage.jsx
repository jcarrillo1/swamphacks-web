import React, { Component } from 'react';
import Clarifai from 'clarifai';
import axios from 'axios';
import { Button,
         FormGroup,
         Row,
         Panel } from 'react-bootstrap';
import CarouselContainer from './CarouselContainer';
import FormInput from './FormInput';

class ImageUploadPage extends Component {
  state = {
		file: '',
		imageUrls: [],
		fetching: false,
		result: {},
		error: false,
	}
	handleImageChange = (e) => {
		e.preventDefault();
		const reader = new FileReader();
		const file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				file: file,
				imageUrl: reader.result,
			});
		}
		reader.readAsDataURL(file);

	}
	onSubmit = (e) => {
		e.preventDefault();
		console.log(this.state.imageUrl);
		if(!this.state.imageUrl) {
			console.log('Nope');
			return;
		}
		this.setState({ fetching: true });
		this.props.api.models.predict(Clarifai.GENERAL_MODEL,
			{ base64: this.state.imageUrl.split(',')[1] })
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
									const audioObject = new Audio(trackUrl)
									audioObject.play();
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
		const { imageUrls } = this.state;
		return (
         <div>
            <Row>
   			      <FormGroup id="uploadForm">
         				<form onSubmit={this.onSubmit}>
         					<FormInput
         						label="Image Upload"
         						id="imageUpload"
         						type="file"
         						onChange={this.handleImageChange}
         					/>
         					<Button className="fileUploadImg"
         						bsStyle="primary"
         						type="submit"
         						disabled={this.state.fetching}>
         						Find a Background Song
         					</Button>
         				</form>
                  </FormGroup>
               </Row>
               <Row>
				      <Panel>{imageUrls && imageUrls.length > 0 && <CarouselContainer imageUrls={imageUrls} />}</Panel>
               </Row>

         </div>
		);
	}
}

export default ImageUploadPage;
