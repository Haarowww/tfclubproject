import React, { useEffect, useState } from "react";
import DropCourse from "./dropCourse";
import './table.css';
import CustomLayout from "../../containers/Layout";
import {Button} from "antd";

const MyCourse = () => {
    const [mycourses, setMyCourses] = useState([]);
    const [page, setPage] = useState(1);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        fetch('http://localhost:8000/classes/list_my_classes/', {
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => response.json()).then(data => setMyCourses(data.results));
    }, []);
    const totalPages = Math.ceil(mycourses.length / 5);
	const startIndex = (page - 1) * 5;
	const endIndex = startIndex + 5;
	const paginatedData = mycourses.slice(startIndex, endIndex);

    const handleCourseDropped = (courseID) => {
        const updateCourses = mycourses.filter(mycourse => mycourse.id !== courseID);
        setMyCourses(updateCourses);
    }

    return (
        <CustomLayout>
            <div className="listUserCourses">
                <h1 className="header">List My Courses</h1>
                <div className="userCourse">
                    {mycourses.length === 0 && <p>You have not register any courses.</p>}
                    <table>
                        <thead>
                            <tr>
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
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((mycourse) => (
                                <tr className='course' key={mycourse.id}>
                                    <td>{ mycourse.id }</td>
                                    <td>{ mycourse.name }</td>
                                    <td>{ mycourse.coach }</td>
                                    <td>{ mycourse.description }</td>
                                    <td>{ mycourse.keywords }</td>
                                    <td>{ mycourse.capacity }</td>
                                    <td>{ mycourse.curr_enrollment }</td>
                                    <td>{ mycourse.start_time }</td>
                                    <td>{ mycourse.end_time }</td>
                                    <td>{ mycourse.status ? 'true' : 'false'}</td>
                                    <td><DropCourse class_id={mycourse.id} future={false} onCourseDropped={handleCourseDropped}/></td>
                                    <td><DropCourse class_id={mycourse.id} future={true} onCourseDropped={handleCourseDropped}/></td>
                                </tr>
                            ))}
                            <button onClick={() => setPage(page - 1)} disabled={page <= 1} >Previous</button>
                            <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} >Next</button>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                Want to Add More classes? <Button type="link"> <a href="/viewcourses" > Add More Classes!!! </a> </Button>
            </div>
        </CustomLayout>
    )
};

export default MyCourse;