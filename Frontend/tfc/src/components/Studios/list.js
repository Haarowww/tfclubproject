import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import React, { useCallback, useRef, useState, useEffect } from "react";
import CustomLayout from "../../containers/Layout";
import Studio from "./Studio";
import { Maps } from "../../containers/map";
import {Avatar, List} from "antd";

const ListStudio = () => {
    const [position, setPosition] = useState({ lat: 0, lng: 0 });
    const token = localStorage.getItem('access_token');
    const [studios, setStudios] = useState([]);
    
    useEffect(() => {
        const data = { longitude: position.lng, latitude: position.lat }
        fetch('http://localhost:8000/studios/distance/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
        .then((data) => setStudios(data.results))
    }, [position])


    const entries = Object.values(studios);
    return (
        <CustomLayout>
            <button onClick={() => navigator.geolocation.getCurrentPosition((position) => {
                setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
            })}>Search Nearest Studios</button>
            <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    onChange: page => {
                    },
                    pageSize: 1
                  }}
                  dataSource={entries}
                  renderItem={item => (
                    <List.Item
                      key={item.name}
                    >
                      <List.Item.Meta
                          // <List.Item.Meta can only place "avatar", "title" and "discription"
                        avatar={<Avatar src={`${item.images}`} />}
                        title={<a href={`/${item.id}`}> {item.name}</a>}
                      />
                        <div>
                            Studio: {item.name}
                        </div>
                        <div>
                            Location: ({item.longitude}, {item.latitude})
                        </div>
                        <div>
                            Address: {item.address}
                        </div>
                        <div>
                            Postal code: {item.postal_code}
                        </div>
                        <div>
                            Quantity: {item.quantity}
                        </div>
                        <div>
                            Phone number: {item.phone_number}
                        </div>
                        <div>
                            {(item.amenities)?.map((items) => (
                                <div>
                                    <p>Machine Type: {items.type}</p>
                                    <p>Machine Quantity: {items.quantity}</p>
                                </div>
                              ))}
                        </div>

                    </List.Item>
                  )}
                />
            <Maps studios={studios}/>
        </CustomLayout>
    )
};

export default ListStudio;