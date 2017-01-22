import React from 'react';
import {
	FormControl,
} from 'react-bootstrap';

const FormInput = ({ label, type, value, onChange, id }) => (
		<FormControl
			type={type || 'text'}
			id={id}
			value={value}
			onChange={onChange}
		/>
);

export default FormInput;
