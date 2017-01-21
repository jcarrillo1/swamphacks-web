import React, { Component } from 'react';
import Clarifai from 'clarifai';
import { Button } from 'react-bootstrap';
import ImageContainer from './ImageContainer';
import FormInput from './FormInput';

class ImageUploadPage extends Component {
  state = {
		file: '',
		imagePreviewUrl: '',
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
		this.setState({ fetching: true });
		this.props.api.models.predict(Clarifai.GENERAL_MODEL,
			{ base64: this.state.imageUrl.split(',')[1] })
			.then(response => {
				const { concepts } = response.outputs[0].data;
				this.setState({
					fetching: false,
					result: concepts.map(concept => concept.name),
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
		const { imageUrl } = this.state;
		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<FormInput
						label="Image Upload"
						id="imageUpload"
						type="file"
						onChange={this.handleImageChange}
					/>
					<Button
						bsStyle="primary"
						type="submit"
						disabled={this.state.fetching}>
						Find a Background Song
					</Button>
				</form>
				{imageUrl && (
					<ImageContainer imageUrl={imageUrl} />
				)}
			</div>
		);
	}
}

export default ImageUploadPage;
