import React from 'react';
import { List, Avatar } from "antd";


const Studio = (props) => {
    // console.log(props.data)
    const entries = Object.values(props.data);
    console.log(entries)
    // console.log(`/TFClubPF/Backend/TFClub${.images}`)
    return (
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
            },
            pageSize: 2
          }}
          dataSource={entries}
          renderItem={item => (
            <List.Item
              key={item.name}
            >
              <List.Item.Meta
                  // <List.Item.Meta can only place "avatar", "title" and "discription"
                avatar={<Avatar src={`http://127.0.0.1:8000${item.images}`} />}
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
    )
}

export default Studio;