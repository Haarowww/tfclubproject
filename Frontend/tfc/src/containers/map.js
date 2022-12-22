import React, { useCallback, useRef, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindowF, DirectionsRenderer } from "@react-google-maps/api";
// import { formatRelative } from "date-fns"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { Link } from "react-router-dom";

const libraries = ["places"];
const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
};
const center = {
    lat: 43.653225,
    lng: -79.383186,
}
const options = {
    disableDefaultUI: true,
    zoomControl: true,
}

export const Maps = (props) => {
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: "AIzaSyB83RAl6XTm3VSLWzgl2tjTcyWxUMDjzks",
        libraries,
    });
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const studios = props.studios;

    // const onMapClick = useCallback((event) => {
    //     setMarkers(current => [...current, {
    //             lat: element.latitude,
    //             lng: element.longitude,
    //             name: element.name,
    //             id: element.id,
    //             time: new Date(),
    //         }])
    // }, [])

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, [])

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, []);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    return (
        <div>
            <h1>See our studios on the map!</h1>
            {/* <Search panTo={panTo}/>
            <Locate panTo={panTo}/> */}

            <GoogleMap 
            mapContainerStyle={mapContainerStyle} 
            zoom={15} 
            center={center}
            options={options}
            // onClick={onMapClick}
            onLoad={onMapLoad}
            >
                {/* {markers.map(marker => <Marker 
                                         key={marker.time.toISOString()} 
                                         position={{lat: marker.lat, lng: marker.lng}} 
                                         onClick={() => {
                                            setSelected(marker);
                                         }}
                                        />)} */}
                {studios.map(studio => <Marker
                                        key={studio.id}
                                        position={{lat: studio.latitude, lng: studio.longitude}}
                                        onClick={() => {
                                            setSelected(studio);
                                        }}/>)}

                { selected ? (<InfoWindowF position={{lat: selected.latitude, lng: selected.longitude}} 
                onCloseClick={() => { setSelected(null); }}>
                    <div>
                        <h2>{ selected.name }</h2>
                        <p>For full information, click this <Link to={ `/${selected.id}` } target="_blank">link</Link></p>
                    </div>
                </InfoWindowF>): null}
            </GoogleMap>
        </div>
    )
}

function Locate({ panTo }){
    return (
        <button className="locate" onClick={() => {
            navigator.geolocation.getCurrentPosition((position) => {panTo({lat: position.coords.latitude, lng: position.coords.longitude});}, () => null);
        }}>
            <img src="./src/logo.svg" alt="compass - locate me"/>
        </button>
    );
}

function Search({ panTo }) {
    const {ready, value, suggestions: { status, data }, setValue, clearSuggestions, } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 43.653225, lng: () => -79.383186 }, 
            radius: 200 * 1000, 
        },
    });

    return (
        <div className="searchBox">
            <Combobox 
            onSelect={async (address) => {
                setValue(address, false);
                clearSuggestions();
                try {
                    const results = await getGeocode({address});
                    const { lat, lng } = await getLatLng(results[0]);
                    panTo({ lat, lng });
                } catch(error) {
                    console.log("error!")
                }
            }}>
                <ComboboxInput value={value} onChange={(e) => {
                    setValue(e.target.value);
                }} disabled={!ready} placeholder="Enter a valid studio"/>
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" && data.map(({ id, description }) => (<ComboboxOption key={id} value={description}/>))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}