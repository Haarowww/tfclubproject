import axios from "axios";
import React, { useEffect, useState } from "react";
import "./table.css";
import {Breadcrumb} from "antd";
import {Link} from "react-router-dom";
import {Content} from "antd/es/layout/layout";
import zumba_adobe_express from "../../zumba_adobe_express.svg"
import Kickboxing from "../../Kickboxing.svg"
import Yoga from "../../Yoga.svg"
import { useNavigate } from "react-router-dom";

const Courses = (props) => {
    const token = localStorage.getItem('access_token');
    const [page, setPage] = useState(1);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/classes/list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(props)
        }).then((response) => response.json())
        .then((data) => setCourses(data.results))
    }, [props.studio]);

    const totalPages = Math.ceil(courses.length / 5);
	const startIndex = (page - 1) * 5;
	const endIndex = startIndex + 5;
	const paginatedData = courses.slice(startIndex, endIndex);

    return (
        <table className="courseTable">
            <thead>
                <tr className="headers">
                    <th>ID</th>
                    <th>Course Name</th>
                    <th>Coach</th>
                    <th>Course Description</th>
                    <th>Keywords</th>
                    <th>Capacity</th>
                    <th>Current Enrollment</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {paginatedData.map(course => (
                    <tr className='course' key={course.id}>
                        <td>{ course.id }</td>
                        <td>{ course.name }</td>
                        <td>{ course.coach }</td>
                        <td>{ course.description }</td>
                        <td>{ course.keywords }</td>
                        <td>{ course.capacity }</td>
                        <td>{ course.curr_enrollment }</td>
                        <td>{ course.start_time }</td>
                        <td>{ course.end_time }</td>
                        <td>{ course.status ? 'true' : 'false'}</td>
                    </tr>
                ))}
                <button onClick={() => setPage(page - 1)} disabled={page <= 1} >Previous</button>
				<button onClick={() => setPage(page + 1)} disabled={page >= totalPages} >Next</button>
            </tbody>
        </table>
    )
}

const SignupCourse = () => {
    const historty = useNavigate();
    const [class_id, setClassID] = useState('');
    const [future, setFuture] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { class_id, future };
        const token = localStorage.getItem('access_token');
        axios({
            method: 'POST',
            url: 'http://localhost:8000/classes/signup/',
            data: JSON.stringify(data),
            headers: {"Content-Type": "application/json", Authorization : `Bearer ${token}`,}
        }).then((res) => historty("/user/myclasses")).catch((error) => setError(error.response.data[0]));
    }

    const checkBoxChange = (e) => {
        const { checked } = e.target;

        setFuture(checked);
    }

    const onChangeID = (e) => {
        if (e.target.name === "class_id"){
            setClassID(e.target.value);
            if (e.target.value < 0){
                setError("the value of class id should not less than 0");
            } else {
                setError('');
            };
        }
    };

    return (
        <div className="SignupCourse" >
          <h1>Find Your Interested Course and Register For it!</h1>
          <form onSubmit={handleSubmit} style={{border: '1px solid #ccc', padding: '16px'}}>
            <label htmlFor="class_id" style={{display: 'block'}}>
              Enter The Class ID to Register:
              <input name="class_id" id="class_id" type="number" value={ class_id } onChange={onChangeID} style={{display: 'block', marginTop: '8px'}} />
            </label>
            <hr />
            <label htmlFor="future" style={{display: 'block'}}>
              Subscribe for All the Future Occurances?
              <input type="checkbox" name="future" id="future" value={ future } onChange={checkBoxChange} style={{display: 'block', marginTop: '8px'}} />
            </label>
            <hr />
            {error && <p style={{color: "red"}}>{ error }</p>}
            <button className='btn btn-primary mt-4' type='submit' style={{backgroundColor: '#4CAF50', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px'}}>
              Register the Course
            </button>
          </form>

          <div style={{marginTop: '32px'}}>
            <h3>Some Popular Courses:</h3>
            <div style={{display: 'flex'}}>
              <div style={{marginRight: '32px'}}>
                <img src={Yoga} alt="Yoga Class" style={{width: '128px', height: '128px'}} />
                <p>Yoga Class</p>
              </div>
              <div style={{marginRight: '32px'}}>
                <img src={zumba_adobe_express} alt="Zumba Class" style={{width: '128px', height: '128px'}} />
                <p>Zumba Class</p>
              </div>
                <div>
                <img src={Kickboxing} alt="Kickboxing Class" style={{width: '128px', height: '128px'}} />
                <p>Kickboxing Class</p>
              </div>
            </div>
          </div>
            <div>
                Finished registration ? Let's explore more on HomePage!!! <a href="/" > HomePage </a>
            </div>
            <div>
                Want to see your Registered classes? Here we come !!! <a href="/user/myclasses" > Your Classes!!! </a>
            </div>
        </div>



    )
}

const ChooseStudio = () => {
    const token = localStorage.getItem('access_token');
    const [studios, setStudios] = useState({});
    const [selectedKey, setSelectedKey] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/classes/list/', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => response.json())
        .then((data) => setStudios(studios => ({
            ...studios, ...data
        })))
    }, []);


    return <div className="chooseStudioForm">
        <h1> Choose a studio to see the available courses</h1>
        <div className="listStudios">
            {Object.entries(studios).map( ([key, value]) => <button key={key} onClick={() => setSelectedKey(key)}>{ value }</button>)}
        </div>
        { selectedKey && (
            <div className="selectedCourses">
                <p>{ selectedKey } is selected</p>
                <Courses studio={selectedKey} />
            </div>
        )}
        <SignupCourse />
    </div>
};

export default ChooseStudio;