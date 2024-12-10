import React, {useState, useEffect} from "react";
import axios from "axios";
import keys from "../../keys.json"
import SingleItem from "./SingleItem";

function GetItemsFromGeocode() {
    const [geocodeCoord,setGeocodeCoord] = useState(null);
    const [data, setData] = useState(null);
    const [items, setItems] = useState(null);  
    const [address, setAddress] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                if(geocodeCoord) {
                    //CAMBIAR
                    const urlPeticion = `http://localhost:8000/event/?latitude=${geocodeCoord.lat}&longitude=${geocodeCoord.lng}&radius=0.2`
                    const response = await axios.get(urlPeticion);
                    setData(response.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [geocodeCoord]);

    useEffect(() => {
        if(data !== null) {
            const itemsComponented = data.map((item) => <SingleItem key={item._id} data={item}/>);
            setItems(itemsComponented);
        }
    }, [data]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // API key de OpenCage
        const API_KEY = keys.OpenCage_API_KEY;

        try {
            // Solicitud a la API de OpenCage
            const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
                params: {
                    q: address, // Dirección a buscar
                    key: API_KEY,
                    language: "es", // Idioma de los resultados
                    limit: 1, // Limita los resultados a uno
                },
            });

            if (response.data.results.length > 0) {
                const location = response.data.results[0].geometry;
                setGeocodeCoord(location);
                //console.log(geocodeCoord);
            } else {
                alert("No se encontraron resultados para esa dirección.");
            }
        } catch (error) {
            console.error("Error en la solicitud de geocoding:", error);
            alert("Hubo un problema al obtener los datos de geocoding.");
        };
    }

    return (
        <div className="flex-col">
            <div className="flex-row">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="address">Dirección:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Introduce una dirección"
                        required
                    />
                    <button type="submit">Buscar</button>
                </form>
            </div>
            {items && (
                <div className="flex-col">
                    {items}
                </div>
            )}
        </div>
    );
}

export default GetItemsFromGeocode;