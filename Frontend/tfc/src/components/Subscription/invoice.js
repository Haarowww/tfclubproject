
const Invoice = (props) => {
    const { amount, transaction_time, owner, card_info } = props.data

    return (
        <div className="invoiceSubscription">
            <div className="payment">
                <h1 className="header">Payment For This Period: </h1>
                <p>{ amount }</p>
            </div>
            <div className="transaction_time">
                <h1 className="header">Transaction Time: </h1>
                <p>{ transaction_time }</p>
            </div>
            <div className="owner_id">
                <h1 className="header">Owner ID: </h1>
                <p>{ owner }</p>
            </div>
            <div className="card_info">
                <h1 className="header">Card Info: </h1>
                <p>{ card_info }</p>
            </div>
        </div>
    );
};

export default Invoice;