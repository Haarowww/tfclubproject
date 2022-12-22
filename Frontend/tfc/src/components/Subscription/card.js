import React, { useEffect, useState } from "react";
import CustomLayout from "../../containers/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateCard = () => {
    const history = useNavigate();
    const [card_info, setCardInfo] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
     const [error, setError] = React.useState({
        card_info: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const info = { card_info };

        setIsPending(true);
        if (card_info.length !== 16) {
            setError({
                ...error,
                card_info: "Card length must be 16!"
            });
        }

        const token = localStorage.getItem('access_token');;
        axios('http://localhost:8000/subscriptions/createcard/', {
            method: 'POST',
            headers: { "Content-Type": "application/json", Authorization : `Bearer ${token}`},
            data: JSON.stringify(info)
        }).then((response) => {
            history("/")
        }).catch((error) => {
            console.log(error)
            if(error.response){

                const errorMessage = {Card: error.response.data.card_info};
                console.log(errorMessage)
                // setErrorMessage(errorMessage);
                if (errorMessage.Card !== undefined){
                    setErrorMessage(errorMessage);
                }else{
                    alert("You have already subscribed your card!!!");
                    history("/")
                }
            }
        })
        .finally(() => {
            setCardInfo("");
            setIsPending(false);
        })
        // history("/");

        
    };

    return (
        <CustomLayout>
            <div className="createCard">
                <h1>Fill your card information</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="cardNumber">Card Number: </label>
                    <input
                       type="text"
                       id="cardNumber"
                       pattern="[0-9]*"
                       imputmode="numeric"
                       placeholder="****************"
                       value={card_info}
                       onChange={(e) => setCardInfo(e.target.value)}
                    />
                    { !isPending && <button>Upload Card Info</button>}
                    { isPending && <button disabled>Uploading Your Card Info...</button>}
                    {error.card_info  && (
                                <p style={{color: "red"}}>{error.card_info}</p>
                    )}
                </form>
            </div>
            <p className='mt-3'>
                Already had a Card? Click me!!!  <a href="/" > Go Home!!!</a>
            </p>
            {errorMessage.Card && <div style={{color: "red"}}>Card: {errorMessage.Card}</div>}
            {/*{errorMessage.CardLength && <div style={{color: "red"}}>Card: {errorMessage.CardLength}</div>}*/}
        </CustomLayout>
    )
};

export default CreateCard;