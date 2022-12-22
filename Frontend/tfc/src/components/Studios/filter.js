import React, { useRef, useState } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomLayout from "../../containers/Layout";
import Studiofilter from "./Studio_filter";

export default function Filter() {
    const history = useNavigate();
    const initialFormData = Object.freeze({
        name: '',
        type: '',
        quantity: '0',
        coach_name: '',
        class_name: '',
    });
    const [formData, updateFormData] = useState(initialFormData);

    const [quantity, setQuantity] = React.useState("");
    const [type, setType] = React.useState("");
    const [name, setName] = React.useState("");
    const [coach_name, setCoachName] = React.useState("");
    const [class_name, setClassName] = React.useState("");
    const [data, setData] = React.useState("");

    const onChange = (e) => {
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
        if (e.target.name === "type") {setType(e.target.value);}
        if (e.target.name === "name") {setName(e.target.value);}
        if (e.target.name === "coach_name") {setCoachName(e.target.value);}
        if (e.target.name === "class_name") {setClassName(e.target.value);}
        if (e.target.name === "quantity") {
            setQuantity(e.target.value);
        }
	};


    const handleSubmit = (e) => {
		e.preventDefault();
		// console.log(formData);
        // handleUsernameInput(formData.username)


        axios({
            method:"post",
            url: 'http://127.0.0.1:8000/studios/filter/',
            data: {
                name: formData.name,
                type: formData.type,
                quantity:  formData.quantity,
                coach_name: formData.coach_name,
                class_name: formData.class_name
            },
            headers: {
                Authorization: localStorage.getItem('access_token')
                    ? 'Bearer ' + localStorage.getItem('access_token')
                    : null,
                'Content-Type': "multipart/form-data",
            },
        })
            .then((res) => {
                // history("/studio_filter");
                setData(res.data.results);
                console.log(res.data);
				console.log(res.data.results);
			})
            .catch(function (error) {
              alert("No match filter")
            });
	};



    return (
        <CustomLayout>
               <div className='container mt-5'>
                   <h1> Filter your favorites </h1>
                   <form className='mt-5' onSubmit={handleSubmit}>
                       <div>
                           <div className="form-group">
                               <label htmlFor='name'> Name </label>
                                   <input className='form-control' type="text" name="name" placeholder="Enter a Name"
                                        onChange={onChange} required={false} value={name}/>
                        </div>


                        <div className="form-group mt-3">
                            <label htmlFor='coach_name'> Coach Name </label>
                                <input className='form-control' type="text" name="coach_name" placeholder="Enter a Coach Name"
                                       onChange={onChange}  required={false} value={coach_name}/>

                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor='class_name'> Class Name </label>
                                <input className='form-control' type="text" name="class_name" placeholder="Enter a Class Name"
                                       onChange={onChange} required={false}  value={class_name} />
                        </div>
                       <div className="form-group mt-3">
                           <label htmlFor='type'> Amenities Type </label>
                               <input className='form-control' type="text" name="type" placeholder="Enter a Type"

                                   onChange={onChange} required={false} value={type}/>
                        </div>
                       <div className="form-group mt-3">
                           <label htmlFor='quantity'> Amenities Quantity </label>
                               <input className='form-control' type="text" name="quantity" placeholder="Enter a Quantity"
                                   onChange={onChange} required={false} value={quantity}/>
                        </div>
                        <button className='btn btn-primary mt-4' type='submit' >Filter</button>
                    </div>
                    {data && <Studiofilter data={data}/>}
                </form>
            </div>
        </CustomLayout>
    );
};