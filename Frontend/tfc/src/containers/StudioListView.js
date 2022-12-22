import React from 'react';
import Studio from "../components/Studios/Studio";
import axios from 'axios';
import CustomLayout from "./Layout";

class StudioList extends React.Component {
    state = {
        studios: []
    }
    componentDidMount() {
        axios.get('http://localhost:8000/studios/show/')
            .then (res => {
                this.setState({
                    studios: res.data
                });
                console.log(res.data);
                // console.log(this.state.studios)
            })
    }

    render() {
        return (
            <CustomLayout>
                <Studio data={this.state.studios}/>
            </CustomLayout>

        )
    }
}

export default StudioList;