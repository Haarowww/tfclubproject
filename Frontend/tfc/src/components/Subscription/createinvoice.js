import Invoice from "./invoice";
import React, { useEffect, useState } from "react";
import CustomLayout from "../../containers/Layout";

const time = Date.now()

const CreateInvoice = () => {
    const token = localStorage.getItem('access_token');
    const [paymentHistorys, setPaymentHistorys] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/subscriptions/history/', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
         .then((response) => response.json())
         .then((data) => {
            setPaymentHistorys(data.results);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <CustomLayout>
            <div className="fullInvoices">
                <div className="cancelCurrentPlan">
                    <p>Want to cancel current plan? Click</p><button className='btn btn-primary mt-4' type='submit' > <a href="/cancelplan"> Cancel </a> </button>
                </div>
                {paymentHistorys.map((paymentHistory) => (
                    <div className="singleInvoice">
                    <Invoice data={paymentHistory}></Invoice>
                    <hr></hr>
                    </div>
                ))}
            </div>
        </CustomLayout>
    );
};

export default CreateInvoice;