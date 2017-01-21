import React from 'react';
import {
	FormGroup,
	ControlLabel,
	FormControl,
} from 'react-bootstrap';

const FormInput = ({ label, type, value, onChange, id }) => (
	<FormGroup controlId={id}>
		<ControlLabel>{label}</ControlLabel>
		<FormControl
			type={type || 'text'}
			id={id}
			value={value}
			onChange={onChange}
		/>
	</FormGroup>
);

export default FormInput;
