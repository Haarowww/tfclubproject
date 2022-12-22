import React, {useState} from "react";
import axios from "axios";

const DropCourse = ({ class_id, future, onCourseDropped}) => {
    const token = localStorage.getItem('access_token');
    const data = { class_id, future }
    const [error, setError] = React.useState('');
    const [refreshed, setRefreshed] = useState(false);

    const handleClick = () => {
        axios({
            method: 'POST',
            url: 'http://localhost:8000/classes/drop/',
            data: JSON.stringify(data),
            headers: {"Content-Type": "application/json", Authorization : `Bearer ${token}`,}
        }).then((response) => {
            if (response.ok){
                window.location.reload();
                onCourseDropped(class_id)
            }
        }).catch((error) => setError(error.response.data[0]));
        if (!refreshed) {
          window.location.reload();
          setRefreshed(true);
        }
    };

    if (!future) {
        return <button onClick={handleClick}>Drop Class</button>
    } else {
        return <button onClick={handleClick}>Drop Future Occurances</button>
    }
}

export default DropCourse;