import React, { useEffect, useState } from "react";
import CustomLayout from "../../containers/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const PayForm = () => {
    const [subscription, setSubscription] = useState('1');
    const [subscription_amount, setSubscriptionAmount] = useState(0);
    const [plans, setPlans] = useState([]);
    const token = localStorage.getItem('access_token');
    const [isProcessing, setIsProcessing] = useState(false);
    const history = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch('http://localhost:8000/subscriptions/show/')
         .then((response) => response.json())
         .then((data) => {
            setPlans(data.results);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        const data = { subscription, subscription_amount };

        axios('http://localhost:8000/subscriptions/payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify(data),
        }).then((response) => history("/"))

        .catch((error) => {
            if(error.response) {
                console.log(error.response)
                const errorMessage = {Card: error.response.data};
                setErrorMessage(errorMessage);
                history("/createcard")
            }
        })
        .finally(() => { setIsProcessing(false); });
    };

    return (
        <CustomLayout>
            <div className="PaymentForm">
                <form className="payment" onSubmit={handleSubmit}>
                    <label htmlFor="Subscription">Choose Your Subscription Plan: </label>
                    <select name="subscription" onChange={(e) => setSubscription(e.target.value)}>
                        {plans.map((plan) => (
                            <option key={plan.id} value={plan.id}>
                                ${plan.money} per {plan.type}
                            </option>
                        ))}
                    </select>
                    <hr></hr>
                    <label htmlFor="SubscriptionAmount">Choose how long do you want: </label>
                    <input type="text" imputmode="numeric" onChange={(e) => setSubscriptionAmount(e.target.value)} value={subscription_amount} name="subscription_amount"/>
                    <hr></hr>
                    { !isProcessing && <button>Make Payment</button>}
                    { isProcessing && <button disabled>Processing Your Payment...</button>}
                </form>
            </div>
            {errorMessage.Card && <div style={{color: "red"}}> No payment card yet: {errorMessage.Card}</div>}
            <di>
                { token && <p className='mt-3'>
                Want to check your payment history?  <a href="/history" > Let's Go!!! </a>
            </p>}
            </di>
        </CustomLayout>
    );
};

export default PayForm;