import React from 'react';
import Clarifai from 'clarifai';
import {
	Tabs,
	Tab,
} from 'react-bootstrap';
import {
	CLARIFAI_CLIENTID,
	CLARIFAI_CLIENTSECRET,
} from './config';
import ImageUrlPage from './ImageUrlPage';
import ImageUploadPage from './ImageUploadPage';

const api = new Clarifai.App(
	`${CLARIFAI_CLIENTID}`,
	`${CLARIFAI_CLIENTSECRET}`,
);

const App = () => (
	<div className="container">
		<Tabs defaultActiveKey={1}  id="mainPage">
			<Tab eventKey={1} title="Image Url">
				<ImageUrlPage api={api} />
			</Tab>
			<Tab eventKey={2} title="Image Upload">
				<ImageUploadPage api={api} />
			</Tab>
		</Tabs>
	</div>
)

export default App;
