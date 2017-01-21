import React, { Component } from 'react';
import Clarifai from 'clarifai';
import { Button } from 'react-bootstrap';
import ImageContainer from './ImageContainer';
import FormInput from './FormInput';

class ImageUrlPage extends Component {
  state = {
		imageUrl: '',
		queryUrl: '',
		fetching: false,
		result: {},
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
				this.setState({
					fetching: false,
					imageUrl: queryUrl,
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
						label="Image Url"
						id="imageSearch"
						value={this.state.queryUrl}
						onChange={this.onChange}
					/>
					<Button
						bsStyle="primary"
						type="submit"
						disabled={this.state.fetching}
					>
						Find Background Song
					</Button>
				</form>
				{imageUrl && (
					<ImageContainer imageUrl={imageUrl} />
				)}
			</div>
		);
	}
}

export default ImageUrlPage;
