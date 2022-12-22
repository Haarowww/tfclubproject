import React from "react";
import axios from "axios";
import {Button, Card} from "antd";
import {Link, useParams, Redirect } from "react-router-dom";
import CustomLayout from "./Layout";

export function withRouter(Children){
     return(props)=>{

        const match  = {params: useParams()};
        return <Children {...props}  match = {match}/>
    }
}



class DetailUserView extends React.Component {
    state = {
        user: {}
    }
    componentDidMount() {
        const userID = localStorage.getItem("userid");
        axios({
        method:"get",
        url: `http://localhost:8000/api/accounts/show/${userID}/`,
        headers: {
            Authorization: localStorage.getItem('access_token')
                ? 'Bearer ' + localStorage.getItem('access_token')
                : null,
            'Content-Type': "multipart/form-data",
        },
    })
        .then (res => {
            this.setState({
                user: res.data
            });
            console.log(res.data)
        })
    }
    render() {
        return (
            <CustomLayout>
                <Card title={this.state.user.username}>
                    <div>
                        First Name: {this.state.user.first_name}
                    </div>
                    <div>
                        Last Name: {this.state.user.last_name}
                    </div>
                    <div>
                        Email: {this.state.user.email}
                    </div>
                    <div>
                        <img src={`http://127.0.0.1:8000${this.state.user.avatar}`} alt={"User image"}/>
                    </div>
                    <div>
                        Phone number: {this.state.user.phone_number}
                    </div>
                    <div>
                        Expire Date of membership: {(this.state.user.expiry_date) ? (this.state.user.expiry_date) : "No subscription yet"}
                    </div>
                    <div>
                        Card Information : {(this.state.user.card_info)? (this.state.user.card_info) : "No card yet"}

                    </div>
                    {/*<div>*/}
                    {/*    Classes: {this.state.user.classes}*/}
                    {/*</div>*/}
                    Classes: {(this.state.user.classes)?.map((item) => (
                            <div>
                                <p>Class Name: {item.name}</p>
                                <p>Class coach: {item.coach}</p>
                                <p>Class description: {item.description}</p>
                                <p>Class start time: {item.start_time}</p>
                                <p>Class end time: {item.end_time}</p>
                            </div>
                    ))}
                </Card>
                <p className='mt-3'>
                    Want to update your user information? <Button type="link"> <a href="/updateUser" >Update info</a> </Button>
				</p>
                <p className='mt-3'>
                    Want to update your card information? <Button type="link"> <a href="/updatecard" >Update card</a> </Button>
				</p>
                <p className='mt-3'>
                    Want to create a card to subscribe our membership? <Button type="link"> <a href="/createcard" > Create card</a> </Button>
				</p>
            </CustomLayout>
        )
    }
}

export default withRouter(DetailUserView);