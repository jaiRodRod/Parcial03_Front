import React, {useState, useEffect} from "react";
import axios from "axios";
import keys from "../../keys.json"
import SingleItem from "./SingleItem";

import Cookies from "universal-cookie";
import { useSession } from "./SessionProvider";
const cookies = new Cookies();

import url from '../url.json'

function GetItemsFromGeocode() {
    const [geocodeCoord,setGeocodeCoord] = useState(null);
    const [data, setData] = useState(null);
    const [items, setItems] = useState(null);  
    const [address, setAddress] = useState(null);
    const email = cookies.get("email");
    const {isLoggedIn} = useSession();

    const cleanItems = () => {
        setGeocodeCoord(null);
        setData(null);
        setItems(null);
    }

    useEffect(() => {
        cleanItems();
    },[isLoggedIn]) 

    useEffect(() => {
        const fetchData = async() => {
            try {
                if(geocodeCoord) {
                    //CAMBIAR
                    const urlPeticion = `${url.active_urlBase}/event/?latitude=${geocodeCoord.lat}&longitude=${geocodeCoord.lng}&radius=0.2`
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
            const itemsComponented = data.map((item) => <SingleItem key={item._id} data={item} user={email} cleanItems={cleanItems}/>);
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
            <div className="flex justify-center">
                <div className="flex flex-wrap justify-center w-full lg:w-[50%]">
                    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                        <label htmlFor="address" className="flex-shrink-0">Dirección:</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Introduce una dirección"
                            required
                            className="appearance-none caret-gray-800 border-gray-300 border-b-2 focus:outline-none w-full sm:flex-grow px-2 py-1"
                        />
                        <button
                            type="submit"
                            className="font-bold bg-gray-100 px-4 py-1 rounded-full hover:bg-blue-200 focus:outline-none transition duration-300 flex-shrink-0"
                        >
                            Buscar
                        </button>
                    </form>
                </div>
            </div>
            {items && (
                <div className="flex-col justify-center my-4">
                    {items}
                </div>
            )}
        </div>
    );
}

export default GetItemsFromGeocode;