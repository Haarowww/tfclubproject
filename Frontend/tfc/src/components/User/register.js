import React, { useRef, useState } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomLayout from "../../containers/Layout";


export default function Register() {
    const history = useNavigate();
    const initialFormData = Object.freeze({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        avatar: null
    });
    const [formData, updateFormData] = useState(initialFormData);
    const [error, setError] = React.useState({
        username: '',
        password: '',
        email: '',
        phone_number: '',
        avatar: '',
    });
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [phone_number, setPhone_number] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const onChange = (e) => {
		updateFormData({
			...formData,
			// Trimming any whitespace
			[e.target.name]: e.target.value.trim(),
		});
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (e.target.name === "email") {
            setEmail(e.target.value);
            if (e.target.value !== "" && !regex.test(e.target.value)) {
                setError((error) => ({
                    ...error,
                    email: "Invalid email address!"
                }));
            }else{
                setError((error) => ({
                    ...error,
                    email: ""
                }));
            }
        }
        if (e.target.name === "password") {
            setPassword(e.target.value);
            if (e.target.value === "") {
                setError((error) => ({
                    ...error,
                    password: "Password must set!"
                }));
            }else if (e.target.value < 8) {
            setError((error) => ({
                    ...error,
                    password: "Password must be at least 8 characters long!"
                }));
            } else{
                setError((error) => ({
                    ...error,
                    password: ""
                }));
            }
        }
        if (e.target.name === "username") {
            setUsername(e.target.value);
            if (e.target.value === "") {
                setError((error) => ({
                    ...error,
                    username: "Username must set!"
                }));
            }else{
                setError((error) => ({
                    ...error,
                    username: ""
                }));
            }
        }
        const regex_phone = /^\d{3}-\d{3}-\d{4}$/;
        if (e.target.name === "phone_number") {
            setPhone_number(e.target.value);
            if (e.target.value === ""){
                setError((error) => ({
                    ...error,
                    phone_number: "Phone number must set!"
                }));
            }else if (!regex_phone.test(e.target.value)) {
                setError((error) => ({
                    ...error,
                    phone_number: "Invalid Phone number!"
                }));
            }else{
                setError((error) => ({
                    ...error,
                    phone_number: ""
                }));
            }
        }
	};
    const handleImageChange = (e) => {
        updateFormData({
			...formData,
			// Trimming any whitespace
			[e.target.name]: e.target.files[0]
		});

      };


    const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
        // handleUsernameInput(formData.username)

        if (username === "") {
            setError({
                ...error,
                username: "Username must set!"
            });
        }

        if (password === "") {
            setError({
                ...error,
                password: "Password must set!"
            });
        }else if (password < 8) {
            setError({
                ...error,
                password: "Password must be at least 8 characters long!"
            });
        }
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (email !== ""  && !regex.test(email)) {
            setError({
                ...error,
                email: "Invalid email address!"
            });
        }
        const regex_phone = /^\d{3}-\d{3}-\d{4}$/;
        if (phone_number !== ""  && !regex_phone.test(phone_number)) {
            setError({
                ...error,
                phone_number: "Invalid phone number!"
            });
        }

        axios({
            method:"post",
            url: 'http://127.0.0.1:8000/api/accounts/signup/',
            data: {
                username: formData.username,
				password: formData.password,
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number,
                avatar: formData.avatar,
            },
            headers: {
                Authorization: localStorage.getItem('access_token')
                    ? 'Bearer ' + localStorage.getItem('access_token')
                    : null,
                'Content-Type': "multipart/form-data",
            },
        })
            .then((res) => {
                history('/login');
                console.log(res);
				console.log(res.data);
                console.log(typeof (res.data))
			})
            .catch(function (error) {
                console.log(error.response)
              if (error.response) {
                  console.log(error.response.data.password)
                const errorMessage = {password: error.response.data.password,
                                      username: error.response.data.username,
                                      email: error.response.data.email,
                                      phone_number: error.response.data.phone_number,
                                      avatar: error.response.data.avatar
                                      };
                  console.log(errorMessage)
                setErrorMessage(errorMessage);
              }
            });
	};



    return (
        <CustomLayout>
            <div className='container mt-5'>
                <h1>Register for an Account </h1>
                <form className='mt-5' onSubmit={handleSubmit}>
                    <div>
                        <div className="form-group">
                            <label htmlFor='username'> Username </label>
                                <input className='form-control' type="text" name="username" placeholder="Enter a username"
                                        onChange={onChange} required value={username}/>
                            {error.username && (
                                <p style={{color: "red"}}>{error.username}</p>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor='password'> Password </label>
                                <input className='form-control' type="text" name="password" placeholder="Enter a password"
                                       onChange={onChange} required value={password}/>
                            {error.password && (
                                <p style={{color: "red"}}>{error.password}</p>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor='email'> Email </label>
                                <input className='form-control' type="email" name="email" placeholder="Enter an email"
                                       onChange={onChange}  required={false} value={email}/>
                            {error.email && (
                                <p style={{color: "red"}}>{error.email}</p>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor='first_name'> First Name </label>
                                <input className='form-control' type="text" name="first_name" placeholder="Enter a first name"
                                       onChange={onChange}  required={false} />
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor='last_name'> Last Name </label>
                                <input className='form-control' type="text" name="last_name" placeholder="Enter a last name"
                                       onChange={onChange}  required={false} />

                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor='phone_number'> Phone Number </label>
                                <input className='form-control' type="text" name="phone_number" placeholder="Enter a Phone Number"
                                       onChange={onChange}  required={false} value={phone_number}/>
                            {error.phone_number && (
                                <p style={{color: "red"}}>{error.phone_number}</p>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor='avatar'> Avatar </label>
                                <input className='form-control' type="file" name="avatar"
                                       onChange={handleImageChange} required={false}  accept="image/png, image/jpeg" />
                        </div>
                    </div>

                    <div>
                        <button className='btn btn-primary mt-4' type='submit' onClick={handleSubmit}>Register</button>
                    </div>
                    {errorMessage.username && <div style={{color: "red"}}>Username: {errorMessage.username}</div>}
                    {errorMessage.password && <div style={{color: "red"}}>Password: {errorMessage.password}</div>}
                    {errorMessage.phone_number && <div style={{color: "red"}}>Phone Number: {errorMessage.phone_number}</div>}
                    {errorMessage.email && <div style={{color: "red"}}>Email: {errorMessage.email}</div>}
                    {errorMessage.avatar && <div style={{color: "red"}}>Avatar: {errorMessage.avatar}</div>}
                </form>
            </div>
        </CustomLayout>
    );
};


