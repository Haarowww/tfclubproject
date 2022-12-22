import { useEffect, useState } from "react";

const UpdatePlanForm = () => {
    const [subscription, setSubscription] = useState('1');
    const [subscription_amount, setSubscriptionAmount] = useState(0);
    const [plans, setPlans] = useState([]);
    const token = localStorage.getItem('access_token');

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
        const data = { subscription, subscription_amount };

        fetch('http://localhost:8000/subscriptions/update/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }).then((response) => response.json())
        .then(() => console.log('Update plan successfully, you can see your new full payment history and cycle right now!'))
        .catch((error) => { console.log(error); })
    };

    return (
        <div className="PaymentForm">
            <h1 className="header">Update Your Subscription Plan</h1>
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
                <button>Update My Plan</button>
            </form>
        </div>
    );
};

export default UpdatePlanForm;