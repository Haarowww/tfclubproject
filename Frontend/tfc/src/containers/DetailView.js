import React from 'react';
import Studio from "../components/Studios/Studio";
import axios from 'axios';
import {Avatar, Card, List} from 'antd';
import { useParams } from 'react-router-dom';
import CustomLayout from "./Layout";
import CardMedia from '@material-ui/core/CardMedia';
import { PositionMap } from './singleMap';

export function withRouter(Children){
     return(props)=>{

        const match  = {params: useParams()};
        return <Children {...props}  match = {match}/>
    }
}


class DetailView extends React.Component {
    state = {
        studio: {},
        userPosition: {}
    }
    componentDidMount() {
        const studioID = this.props.match.params.studioID;
        axios.get(`http://localhost:8000/studios/show/${studioID}/`)
            .then (res => {
                this.setState({
                    studio: res.data
                });
                // console.log(res.data.studio);
                console.log(this.state.studio)
            })
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({ userPosition: position.coords });
        }, () => null);
    }

    handleClick = () => {
        const directionlink = "http://maps.google.com/maps/dir/"+this.state.userPosition.latitude+",+"+this.state.userPosition.longitude+"/"+this.state.studio.latitude+",+"+this.state.studio.longitude+"/";
        window.location = directionlink;
    }

    render() {
        return (
            <CustomLayout>
                <List.Item>
                    <List.Item.Meta
                  // <List.Item.Meta can only place "avatar", "title" and "discription"
                        avatar={<Avatar src={`http://127.0.0.1:8000${this.state.studio.images}`} />}
                      />
                </List.Item>
                <Card title={this.state.studio.name}>
                    <div>
                        Location: ({this.state.studio.longitude}, {this.state.studio.latitude})
                    </div>
                    <div>
                        Address: {this.state.studio.address}
                    </div>
                    <div>
                        Postal code: {this.state.studio.postal_code}
                    </div>
                    <div>
                        Quantity: {this.state.studio.quantity}
                    </div>
                    <div>
                        Type: {this.state.studio.type}
                    </div>
                    <div>
                        Phone number: {this.state.studio.phone_number}
                    </div>
                    <img src={`http://127.0.0.1:8000${this.state.studio.images}`} alt={"Studio image"}/>
                    <div>
                        {(this.state.studio.amenities)?.map((item) => (
                            <div>
                                <p>Machine Type: {item.type}</p>
                                <p>Machine Quantity: {item.quantity}</p>
                            </div>
                          ))}
                    </div>
                    <div>
                        <button onClick={this.handleClick}>Get Direction</button>
                    </div>
                </Card>
                <PositionMap lat={this.state.studio.latitude} lng={this.state.studio.longitude}/>
            </CustomLayout>
        )
    }
}

export default withRouter(DetailView);