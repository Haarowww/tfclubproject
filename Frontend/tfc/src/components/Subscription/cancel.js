import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";

const CancelPlan = () => {
    const history = useNavigate();
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        fetch('http://localhost:8000/subscriptions/cancel/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'POST'
        }).then((response) => response.json())
        .then(() => console.log('Cancel Your Subscription.'))
        .catch((error) => { console.log(error); })
        .finally(() => history('/payment'));
    }, [])

    return <div>Cancel your plan successfully.</div>;
};

export default CancelPlan;