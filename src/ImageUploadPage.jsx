import React, { Component } from 'react';
import Sound from 'react-sound';
import Clarifai from 'clarifai';
import {
	Button,
	FormGroup,
	Row,
	Panel,
} from 'react-bootstrap';
import {
	giphySearch,
	spotifySearch,
} from './api';
import CarouselContainer from './CarouselContainer';
import FormInput from './FormInput';

class ImageUploadPage extends Component {
  state = {
		imageUrl: '',
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
				file,
				imageUrl: reader.result,
			});
		}
		reader.readAsDataURL(file);
	}
	onSubmit = (e) => {
		e.preventDefault();
		console.log(this.state.imageUrl);
		if(!this.state.imageUrl) {
			return;
		}
		this.setState({ fetching: true });
		this.props.api.models.predict(Clarifai.GENERAL_MODEL,
			{ base64: this.state.imageUrl.split(',')[1] })
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
         						disabled={this.state.fetching || !this.state.imageUrl}>
         						Search Gifs
         					</Button>
         				</form>
                  </FormGroup>
               </Row>
							 {imageUrls && imageUrls.length > 0 &&
               <Row>
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

export default ImageUploadPage;
