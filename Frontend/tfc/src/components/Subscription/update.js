import React, { useEffect, useState } from "react";
import CustomLayout from "../../containers/Layout";
import {Button} from "antd";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";


const UpdateCard = () => {
    const history = useNavigate();
    function redirect(){
        return history("/");
    }
    const [card, setCard] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
     const [error, setError] = React.useState({
        card_info: '',
    });

    // useEffect(() => {
    //     const token = 'this api token';
    //     fetch('http://localhost:8000/subscriptions/updatecard/1/', {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     })
    //       .then((response) => response.json())
    //       .then((cardData) => setCard(cardData.card_info))
    //       .catch((error) => {
    //         console.log("cannot fetch data from this api, it has error");
    //       });
    // }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        if (card.length !== 16) {
            setError({
                ...error,
                card_info: "Card length must be 16!"
            });
        }

        const cardData = { 'card_info': card }
        const token = localStorage.getItem("access_token")
        const userID = localStorage.getItem("userid")
        axios(`http://localhost:8000/subscriptions/updatecard/${userID}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify(cardData),
        }).then((response) => { history("/")})
        // .then(() => console.log("Your information has been successfully updated"))
        .catch((error) => {
            if(error.response){
                const errorMessage = {Card: error.response.data.card_info};
                setErrorMessage(errorMessage);
                alert("Update card failed!!!")
            } })
        .finally(() => { setIsProcessing(false); });
    };

    return (
        <CustomLayout>
            <div className="updateCard">
                <h1>Update your card information</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="cardNumber">Card Number: </label>
                    <input
                       type="text"
                       id="cardNumber"
                       pattern="[0-9]*"
                       imputmode="numeric"
                       placeholder="****************"
                       value={card}
                       onChange={(e) => setCard(e.target.value)}
                    />
                    { !isProcessing && <button>Upload Card Info</button>}
                    { isProcessing && <button disabled>Uploading Your Card Info...</button>}
                    {error.card_info  && (
                                <p style={{color: "red"}}>{error.card_info}</p>
                    )}
                    <p className='mt-3'>
                        Misclick? Click on this!!! <Button type="link"> <a href="/" >Go home!!!</a> </Button>
                    </p>
                    <p className='mt-3'>
                        You don't have a card yet? Click on this!!! <Button type="link" > <a href="/createcard" >
                        Subscribe Your Card!!!</a> </Button>
                    </p>
                    {errorMessage.Card && <div style={{color: "red"}}>Card: {errorMessage.Card}</div>}

                </form>
            </div>
        </CustomLayout>
    );
}

export default UpdateCard;