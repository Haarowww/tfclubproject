import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import axios from "axios";
import CustomLayout from "../../containers/Layout";

export default function Login () {
    const history = useNavigate();
	const initialFormData = Object.freeze({
		username: '',
		password: '',
	});

	const [formData, updateFormData] = useState(initialFormData);

	const onChange = (e) => {
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};


	const onSubmit = (e) => {
		e.preventDefault();
		console.log(formData);

		axiosInstance
			.post(`accounts/login/`, {
				username: formData.username,
				password: formData.password,
			})
			.then((res) => {
				localStorage.setItem('userid', res.data);
			})

		axiosInstance
			.post(`token/`, {
				username: formData.username,
				password: formData.password,
			})
			.then((res) => {
				localStorage.setItem('access_token', res.data.access);
				localStorage.setItem('refresh_token', res.data.refresh);
				axiosInstance.defaults.headers['Authorization'] =
					'Bearer ' + localStorage.getItem('access_token');
				history('/');
				window.location.reload();
				//console.log(res);
				//console.log(res.data);
			})
			.catch((err) => {
				alert("Username and password mismatch or you can click on sign up to register!")
			})
	}

    return (
		<CustomLayout>
			<div className='container mt-5'>
				<h1>Sign In</h1>
				<p>Sign into your Account</p>
				<form onSubmit={e => onSubmit(e)}>
					<div className='form-group'>
						<input
							className='form-control'
							type='username'
							placeholder='Username'
							name='username'
							// value={username}
							onChange={e => onChange(e)}
							required
						/>
					</div>
					<div className='form-group'>
						<input
							className='form-control'
							type='password'
							placeholder='Password'
							name='password'
							// value={password}
							onChange={e => onChange(e)}
							minLength='8'
							required
						/>
					</div>
					<button className='btn btn-primary' type='submit'>Login</button>
				</form>
				<p className='mt-3'>
					Don't have an account? <Link to='/register'>Sign up</Link>
				</p>
				{/*<p className='mt-3'>*/}
				{/*    Forgot your password? <Link to='/reset-password'>Reset password</Link>*/}
				{/*</p>*/}
			</div>
		</CustomLayout>

    );
};
