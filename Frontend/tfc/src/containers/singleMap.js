import { useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindowF, DirectionsRenderer } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "50vw",
    height: "50vh",
};

const options = {
    disableDefaultUI: true,
    zoomControl: false,
}

const time = new Date();

export const PositionMap = ({ lat, lng }) => {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: "AIzaSyB83RAl6XTm3VSLWzgl2tjTcyWxUMDjzks",
    });

    const center = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
    };

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    if (loadError) return "Error Loading Maps";
    if (!isLoaded) return "Loading Maps";


    return (
        <div>
            <GoogleMap 
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={center}
            options={options}
            onLoad={onMapLoad}
            >
                <Marker key={time.toISOString()}
                position={{ lat: center.lat, lng: center.lng }}/>
            </GoogleMap>
        </div>
    )
}